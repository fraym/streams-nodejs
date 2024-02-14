import { ServiceClient } from "@fraym/proto/freym/streams/management";
import { credentials } from "@grpc/grpc-js";
import { ClientConfig, useConfigDefaults } from "./config";
import { HandlerFunc, PublishEvent, SubscriptionEvent } from "./event";
import { getEvent } from "./getEvent";
import { getAllEvents } from "./allEvents";
import { sendPublish } from "./publish";
import { introduceGdprOnEventField } from "./introduceGdpr";
import { sendInvalidateGdpr } from "./invalidateGdpr";
import { getStream, isStreamEmpty } from "./stream";
import { Subscription, newSubscription } from "./subscribe";

export interface StreamIterator {
    forEach: (callback: (event: SubscriptionEvent) => void) => Promise<void>;
    isEmpty: () => Promise<boolean>;
}

export interface Client {
    getEvent: (tenantId: string, topic: string, eventId: string) => Promise<SubscriptionEvent>;
    iterateAllEvents: (
        tenantId: string,
        topic: string,
        includedEventTypes: string[],
        perPage: number,
        handler: HandlerFunc
    ) => Promise<void>;
    publish: (topic: string, events: PublishEvent[]) => Promise<void>;
    getStreamItarator: (
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
        fieldName: string,
        serviceClient: ServiceClient
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

    return {
        getEvent: async (tenantId, topic, eventId) => {
            return await getEvent(tenantId, topic, eventId, serviceClient);
        },
        iterateAllEvents: async (tenantId, topic, includedEventTypes, perPage, handler) => {
            await getAllEvents(
                tenantId,
                topic,
                includedEventTypes,
                perPage,
                handler,
                serviceClient
            );
        },
        publish: async (topic, events) => {
            return sendPublish(topic, events, serviceClient);
        },
        getStreamItarator: async (topic, tenantId, stream, perPage) => {
            return {
                forEach: async callback => {
                    return await getStream(
                        topic,
                        tenantId,
                        stream,
                        perPage,
                        async (event: SubscriptionEvent) => {
                            callback(event);
                        },
                        serviceClient
                    );
                },
                isEmpty: async () => {
                    return isStreamEmpty(topic, tenantId, stream, serviceClient);
                },
            };
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
            return introduceGdprOnEventField(
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
        close: () => {
            closeFunctions.forEach(close => close());
        },
    };
};
