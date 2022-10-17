import { ServiceClient } from "@fraym/streams-proto";
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

export interface Client {
    getAllEvents: (
        handler: HandlerFunc,
        includedTopics?: string[],
        excludedTopics?: string[]
    ) => Promise<void>;
    getStream: (tenantId: string, stream: string) => Promise<SubscriptionEvent[]>;
    useEventHandler: (type: string, handler: HandlerFunc) => void;
    useEventHandlerForAllEventTypes: (handler: HandlerFunc) => void;
    subscribe: (includedTopics?: string[], excludedTopics?: string[]) => Promise<void>;
    publish: (topic: string, events: PublishEvent[]) => Promise<void>;
    invalidateGdprData: (tenantId: string, topic: string, gdprId: string) => Promise<void>;
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
        getAllEvents: async (
            handler,
            includedTopics: string[] = [],
            excludedTopics: string[] = []
        ) => {
            await getAllEvents(includedTopics, excludedTopics, handler, serviceClient);
        },
        getStream: async (tenantId, stream) => {
            return await getStream(tenantId, stream, serviceClient);
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
            return sendPublish(topic, events, config, stream);
        },
        invalidateGdprData: async (tenantId, topic, gdprId) => {
            return await sendInvalidateGdpr(tenantId, topic, gdprId, config, stream);
        },
        createSnapshot: async (topic, toTime) => {
            return await sendSnapshot(topic, toTime, config, stream);
        },
        close: () => {
            stream.end();
        },
    };
};
