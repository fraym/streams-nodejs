import { Stream } from "./init";
import { getSubscriptionEvent, HandlerFunc, SubscriptionEvent } from "./event";
import { Response } from "@fraym/streams-proto/dist/response";
import { Request } from "@fraym/streams-proto/dist/request";

interface EventHandler {
    addHandler: (type: string, handler: HandlerFunc) => void;
    addHandlerForAllTypes: (handler: HandlerFunc) => void;
}

export const initEventHandler = (stream: Stream): EventHandler => {
    const typeHandlerMap: Record<string, HandlerFunc[]> = {};
    const globalHandlers: HandlerFunc[] = [];

    stream.on("data", (data: Response) => {
        if (data.data?.$case !== "event") {
            return;
        }

        const event = getSubscriptionEvent(data.data.event);
        if (!event) {
            return;
        }

        const typeHandlers = typeHandlerMap[event.type ?? ""] ?? [];
        typeHandlers.forEach(handler => handleEvent(event, handler, stream));
        globalHandlers.forEach(handler => handleEvent(event, handler, stream));
    });

    return {
        addHandler: (type, handler) => {
            if (!typeHandlerMap[type]) {
                typeHandlerMap[type] = [handler];
            } else {
                typeHandlerMap[type].push(handler);
            }
        },
        addHandlerForAllTypes: handler => {
            globalHandlers.push(handler);
        },
    };
};

const handleEvent = (event: SubscriptionEvent, handler: HandlerFunc, stream: Stream) => {
    handler(event)
        .then(() => {
            stream.write(newEventAckRequest(event.tenantId, event.topic, event.id));
        })
        .catch(e => {
            stream.write(newEventNotAckRequest(event.tenantId, event.topic, event.id, e));
        });
};

const newEventAckRequest = (tenantId: string, topic: string, eventId: string): Request => {
    return {
        payload: {
            $case: "eventAck",
            eventAck: {
                eventId,
                tenantId,
                topic,
            },
        },
    };
};

const newEventNotAckRequest = (
    tenantId: string,
    topic: string,
    eventId: string,
    reason: string
): Request => {
    return {
        payload: {
            $case: "eventNotAck",
            eventNotAck: {
                eventId,
                tenantId,
                topic,
                reason,
            },
        },
    };
};
