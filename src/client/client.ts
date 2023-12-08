import { ServiceClient } from "@fraym/proto/freym/streams/clientchannel";
import { credentials } from "@grpc/grpc-js";
import { getAllEvents } from "./allEvents";
import { ClientConfig, useConfigDefaults } from "./config";
import { AlreadySubscribedError } from "./errors/alreadySubscribed";
import { HandlerFunc, PublishEvent, SubscriptionEvent } from "./event";
import { initEventHandler } from "./handler";
import { initStream } from "./init";
import { sendInvalidateGdpr } from "./invalidateGdpr";
import { sendPublish } from "./publish";
import { sendSnapshot } from "./snapshot";
import { getStream } from "./stream";
import { sendSubscribe } from "./subscribe";
import { getEvent } from "./getEvent";
import { introduceGdprOnEventField, introduceGdprOnField } from "./introduceGdpr";

export interface Client {
    getAllEvents: (
        tenantId: string,
        topic: string,
        includedEventTypes: string[],
        perPage: number,
        handler: HandlerFunc
    ) => Promise<void>;
    getEvent: (tenantId: string, topic: string, eventId: string) => Promise<SubscriptionEvent>;
    getStream: (
        tenantId: string,
        stream: string,
        perPage: number,
        handler: HandlerFunc
    ) => Promise<void>;
    useEventHandler: (type: string, handler: HandlerFunc) => void;
    useEventHandlerForAllEventTypes: (handler: HandlerFunc) => void;
    subscribe: (includedTopics?: string[], excludedTopics?: string[]) => Promise<void>;
    publish: (topic: string, events: PublishEvent[]) => Promise<void>;
    invalidateGdprData: (tenantId: string, topic: string, gdprId: string) => Promise<void>;
    introduceGdprOnField: (
        defaultValue: string,
        topic: string,
        eventType: string,
        fieldName: string,
        serviceClient: ServiceClient
    ) => Promise<void>;
    introduceGdprOnEventField: (
        tenantId: string,
        defaultValue: string,
        topic: string,
        eventId: string,
        fieldName: string,
        serviceClient: ServiceClient
    ) => Promise<void>;
    createSnapshot: (topic: string, toTime: Date) => Promise<void>;
    close: () => void;
}

export const newClient = async (config: ClientConfig): Promise<Client> => {
    config = useConfigDefaults(config);
    const serviceClient = new ServiceClient(config.serverAddress, credentials.createInsecure(), {
        "grpc.keepalive_time_ms": config.keepaliveInterval,
        "grpc.keepalive_timeout_ms": config.keepaliveTimeout,
        "grpc.keepalive_permit_without_calls": 1,
    });
    const stream = await initStream(config, serviceClient);
    const eventHandler = initEventHandler(stream);
    let hasSubscribed = false;

    return {
        getAllEvents: async (tenantId, topic, includedEventTypes, perPage, handler) => {
            await getAllEvents(
                tenantId,
                topic,
                includedEventTypes,
                perPage,
                handler,
                serviceClient
            );
        },
        getEvent: async (tenantId, topic, eventId) => {
            return await getEvent(tenantId, topic, eventId, serviceClient);
        },
        getStream: async (tenantId, stream, perPage, handler) => {
            return await getStream(tenantId, stream, perPage, handler, serviceClient);
        },
        useEventHandler: (type, handler) => {
            eventHandler.addHandler(type, handler);
        },
        useEventHandlerForAllEventTypes: handler => {
            eventHandler.addHandlerForAllTypes(handler);
        },
        subscribe: async (includedTopics: string[] = [], excludedTopics: string[] = []) => {
            if (hasSubscribed) {
                throw new AlreadySubscribedError();
            }

            return await sendSubscribe(includedTopics, excludedTopics, config, stream);
        },
        publish: async (topic, events) => {
            return sendPublish(topic, events, serviceClient);
        },
        introduceGdprOnField: async (
            defaultValue: string,
            topic: string,
            eventType: string,
            fieldName: string
        ) => {
            return await introduceGdprOnField(
                defaultValue,
                topic,
                eventType,
                fieldName,
                serviceClient
            );
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
        createSnapshot: async (topic, toTime) => {
            return await sendSnapshot(topic, toTime, serviceClient);
        },
        close: () => {
            stream.end();
        },
    };
};
