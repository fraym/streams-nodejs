import { ServiceClient } from "@fraym/proto/freym/streams/management";
import { credentials } from "@grpc/grpc-js";
import { ClientConfig, useConfigDefaults } from "./config";
import { HandlerFunc, PublishEvent, SubscriptionEvent } from "./event";
import { getEvent } from "./getEvent";
import { getAllEvents, getAllEventsAfterEvent } from "./allEvents";
import { sendPublish } from "./publish";
import { introduceGdprOnEventField } from "./introduceGdpr";
import { sendInvalidateGdpr } from "./invalidateGdpr";
import { createStreamSnapshot, getStream, getStreamAfterEvent, isStreamEmpty } from "./stream";
import { Subscription, newSubscription } from "./subscribe";
import { getLastEvent } from "./getLastEvent";

export interface StreamIterator {
    forEach: (callback: (event: SubscriptionEvent) => void) => Promise<void>;
    forEachAfterEvent: (
        eventId: string,
        callback: (event: SubscriptionEvent) => void
    ) => Promise<void>;
    isEmpty: () => Promise<boolean>;
}

type LastEventCheck = (lastEvent: SubscriptionEvent | null) => boolean;

export interface Client {
    getEvent: (tenantId: string, topic: string, eventId: string) => Promise<SubscriptionEvent>;
    getLastEvent: (tenantId: string, topic: string) => Promise<SubscriptionEvent | null>;
    iterateAllEvents: (
        tenantId: string,
        topic: string,
        includedEventTypes: string[],
        perPage: number,
        handler: HandlerFunc
    ) => Promise<void>;
    iterateAllEventsAfterEvent: (
        tenantId: string,
        topic: string,
        includedEventTypes: string[],
        eventId: string,
        perPage: number,
        handler: HandlerFunc
    ) => Promise<void>;
    publish: (topic: string, events: PublishEvent[]) => Promise<void>;
    // deprecated: typo
    getStreamItarator: (
        topic: string,
        tenantId: string,
        stream: string,
        perPage: number
    ) => Promise<StreamIterator>;
    getStreamIterator: (
        topic: string,
        tenantId: string,
        stream: string,
        perPage: number
    ) => Promise<StreamIterator>;
    subscribe: (topics?: string[], ignoreUnhandledEvents?: boolean) => Subscription;
    invalidateGdprData: (tenantId: string, topic: string, gdprId: string) => Promise<void>;
    introduceGdprOnEventField: (
        tenantId: string,
        defaultValue: string,
        topic: string,
        eventId: string,
        fieldName: string
    ) => Promise<void>;
    createStreamSnapshot: (
        tenantId: string,
        topic: string,
        stream: string,
        lastSnapshottedEventId: string,
        snapshotEvent: PublishEvent
    ) => Promise<void>;
    close: () => void;
}

export const newClient = async (config: ClientConfig): Promise<Client> => {
    config = useConfigDefaults(config);
    const serviceClient = new ServiceClient(config.serverAddress, credentials.createInsecure(), {
        "grpc.keepalive_time_ms": config.keepaliveInterval,
        "grpc.keepalive_timeout_ms": config.keepaliveTimeout,
        "grpc.keepalive_permit_without_calls": 1,
    });

    const closeFunctions: (() => void)[] = [];

    const getLastEventCheck = async (
        tenantId: string,
        topic: string
    ): Promise<LastEventCheck | null> => {
        const now = new Date(new Date().getTime() + 3000);
        const lastEvent = await getLastEvent(tenantId, topic, serviceClient);

        if (!lastEvent) {
            return null;
        }

        const lastOrderSerial = lastEvent.orderSerial;

        return (lastEvent: SubscriptionEvent | null) => {
            if (!lastEvent) {
                return true;
            }

            if (lastOrderSerial == undefined) {
                return lastEvent.raisedAt > now;
            }

            const orderSerial = lastEvent.orderSerial ? lastEvent.orderSerial : 0;

            return orderSerial > lastOrderSerial;
        };
    };

    const getStreamIterator: (
        topic: string,
        tenantId: string,
        stream: string,
        perPage: number
    ) => Promise<StreamIterator> = async (topic, tenantId, stream, perPage) => {
        return {
            forEach: async callback => {
                const lastEventCheck = await getLastEventCheck(tenantId, topic);

                if (!lastEventCheck) {
                    return;
                }

                return await getStream(
                    topic,
                    tenantId,
                    stream,
                    perPage,
                    async (event: SubscriptionEvent) => {
                        callback(event);
                    },
                    lastEventCheck,
                    serviceClient
                );
            },
            forEachAfterEvent: async (eventId, callback) => {
                const lastEventCheck = await getLastEventCheck(tenantId, topic);

                if (!lastEventCheck) {
                    return;
                }

                return await getStreamAfterEvent(
                    topic,
                    tenantId,
                    stream,
                    eventId,
                    perPage,
                    async (event: SubscriptionEvent) => {
                        callback(event);
                    },
                    lastEventCheck,
                    serviceClient
                );
            },
            isEmpty: async () => {
                return isStreamEmpty(topic, tenantId, stream, serviceClient);
            },
        };
    };

    return {
        getEvent: async (tenantId, topic, eventId) => {
            return await getEvent(tenantId, topic, eventId, serviceClient);
        },
        getLastEvent: async (tenantId, topic) => {
            return await getLastEvent(tenantId, topic, serviceClient);
        },
        iterateAllEvents: async (tenantId, topic, includedEventTypes, perPage, handler) => {
            const lastEventCheck = await getLastEventCheck(tenantId, topic);

            if (!lastEventCheck) {
                return;
            }

            await getAllEvents(
                tenantId,
                topic,
                includedEventTypes,
                perPage,
                handler,
                lastEventCheck,
                serviceClient
            );
        },
        iterateAllEventsAfterEvent: async (
            tenantId,
            topic,
            includedEventTypes,
            eventId,
            perPage,
            handler
        ) => {
            const lastEventCheck = await getLastEventCheck(tenantId, topic);

            if (!lastEventCheck) {
                return;
            }

            await getAllEventsAfterEvent(
                tenantId,
                topic,
                includedEventTypes,
                eventId,
                perPage,
                handler,
                lastEventCheck,
                serviceClient
            );
        },
        publish: async (topic, events) => {
            return await sendPublish(topic, events, serviceClient);
        },
        getStreamItarator: async (topic, tenantId, stream, perPage) => {
            return await getStreamIterator(topic, tenantId, stream, perPage);
        },
        getStreamIterator: async (topic, tenantId, stream, perPage) => {
            return await getStreamIterator(topic, tenantId, stream, perPage);
        },
        subscribe: (topics: string[] = [], ignoreUnhandledEvents: boolean = false) => {
            const subscription = newSubscription(
                topics,
                ignoreUnhandledEvents,
                config,
                serviceClient
            );

            closeFunctions.push(subscription.stop);

            return subscription;
        },
        introduceGdprOnEventField: async (
            tenantId: string,
            defaultValue: string,
            topic: string,
            eventId: string,
            fieldName: string
        ) => {
            return await introduceGdprOnEventField(
                tenantId,
                defaultValue,
                topic,
                eventId,
                fieldName,
                serviceClient
            );
        },
        invalidateGdprData: async (tenantId, topic, gdprId) => {
            return await sendInvalidateGdpr(tenantId, topic, gdprId, serviceClient);
        },
        createStreamSnapshot: async (
            tenantId: string,
            topic: string,
            stream: string,
            idOfLastEventThatGotSnapshotted: string,
            snapshotEvent: PublishEvent
        ) => {
            console.log("aaa");

            return await createStreamSnapshot(
                tenantId,
                topic,
                stream,
                idOfLastEventThatGotSnapshotted,
                snapshotEvent,
                serviceClient
            );
        },
        close: () => {
            closeFunctions.forEach(close => close());
        },
    };
};
