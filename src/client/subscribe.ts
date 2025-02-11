import {
    ServiceClient,
    SubscribeRequest,
    SubscribeResponse,
} from "@fraym/proto/freym/streams/management";
import { v4 as uuid } from "uuid";
import { ClientDuplexStream } from "@grpc/grpc-js";
import { Status } from "@grpc/grpc-js/build/src/constants";
import { ClientConfig } from "./config";
import { HandlerFunc, getSubscriptionEvent } from "./event";

export interface Subscription {
    useHandler: (type: string, handler: HandlerFunc) => void;
    useHandlerForAllTypes: (handler: HandlerFunc) => void;
    start: () => void;
    stop: () => void;
}

export type Stream = ClientDuplexStream<SubscribeRequest, SubscribeResponse>;

export const newSubscription = (
    topics: string[],
    ignoreUnhandledEvents: boolean,
    config: ClientConfig,
    serviceClient: ServiceClient
): Subscription => {
    let stream: Stream | null = null;
    let closed = false;
    const typeHandlerMap: Record<string, HandlerFunc[]> = {};
    const globalHandlers: HandlerFunc[] = [];

    const rebuildConnection = (currentStream: Stream, retries: number) => {
        currentStream.cancel();
        currentStream.removeAllListeners();

        setTimeout(() => {
            stream = null;
            reconnect(retries);
        }, 100);
    };

    const reconnect = async (retries: number) => {
        const newStream = serviceClient.subscribe();
        newStream.on("end", () => {
            if (closed) {
                newStream.cancel();
                return;
            }

            rebuildConnection(newStream, retries - 1);
        });
        newStream.on("error", (err: any) => {
            if (closed) {
                return;
            }

            if (retries === 0 || (err && err.code && err.code === Status.UNKNOWN)) {
                closed = true;
                throw err;
            }

            rebuildConnection(newStream, retries - 1);
        });

        const dataFn = async (data: SubscribeResponse) => {
            if (
                !data.payload ||
                data.payload?.$case === "panic" ||
                data.payload?.$case === "subscribed"
            ) {
                newStream.cancel();
                return;
            }

            const event = getSubscriptionEvent(data.payload.event);
            if (!event) {
                return;
            }

            const currentHandlers = typeHandlerMap[event.type ?? ""] ?? [];
            currentHandlers.push(...globalHandlers);

            if (currentHandlers.length === 0) {
                if (ignoreUnhandledEvents) {
                    newStream.write(newHandledRequest(event.tenantId, event.topic));
                    return;
                }

                newStream.write(
                    newHandledRequest(
                        event.tenantId,
                        event.topic,
                        "no handlers for this event, maybe you forgot to register an event handler"
                    )
                );
                return;
            }

            try {
                for (const handler of currentHandlers) {
                    await handler(event);
                }

                newStream.write(newHandledRequest(event.tenantId, event.topic));
            } catch (err) {
                newStream.write(newHandledRequest(event.tenantId, event.topic, err as string));
                throw err;
            }
        };
        stream = newStream;

        await initStream(topics, config, newStream);

        retries = 50;
        newStream.on("data", dataFn);
    };

    return {
        useHandler: (type: string, handler: HandlerFunc) => {
            if (!typeHandlerMap[type]) {
                typeHandlerMap[type] = [handler];
            } else {
                typeHandlerMap[type].push(handler);
            }
        },
        useHandlerForAllTypes: (handler: HandlerFunc) => {
            globalHandlers.push(handler);
        },
        start: () => {
            reconnect(50);
        },
        stop: () => {
            if (stream) {
                stream.cancel();
                stream = null;
            }

            closed = true;
        },
    };
};

export const initStream = async (
    topics: string[],
    config: ClientConfig,
    stream: Stream
): Promise<Stream> => {
    return new Promise<Stream>((resolve, reject) => {
        stream.write({
            payload: {
                $case: "subscribe",
                subscribe: {
                    metadata: {
                        group: config.groupId,
                        subscriberId: uuid(),
                    },
                    topics,
                },
            },
        });

        stream.once("data", (data: SubscribeResponse) => {
            if (data.payload?.$case !== "subscribed") {
                reject("connection to streams service was not initialized correctly");
                return;
            }

            if (data.payload.subscribed.error) {
                reject(`unable to subscribe to streams service: ${data.payload.subscribed.error}`);
                return;
            }

            resolve(stream);
        });
    });
};

const newHandledRequest = (tenantId: string, topic: string, error?: string): SubscribeRequest => {
    return {
        payload: {
            $case: "handled",
            handled: {
                tenantId,
                topic,
                error: error ?? "",
            },
        },
    };
};
