import { Stream } from "./init";
import { getSubscriptionEvent, HandlerFunc, SubscriptionEvent } from "./event";
import { SubscribeRequest, SubscribeResponse } from "@fraym/streams-proto";

interface EventHandler {
    addHandler: (type: string, handler: HandlerFunc) => void;
    addHandlerForAllTypes: (handler: HandlerFunc) => void;
}

export const initEventHandler = (stream: Stream): EventHandler => {
    const typeHandlerMap: Record<string, HandlerFunc[]> = {};
    const globalHandlers: HandlerFunc[] = [];

    stream.on("data", (data: SubscribeResponse) => {
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
    stream.write(newEventReceivedRequest(event.tenantId, event.topic, event.id));

    handler(event)
        .then(() => {
            stream.write(newEventHandledRequest(event.tenantId, event.topic, event.id));
        })
        .catch(e => {
            stream.write(newEventNotHandledRequest(event.tenantId, event.topic, event.id, e));
        });
};

const newEventReceivedRequest = (
    tenantId: string,
    topic: string,
    eventId: string
): SubscribeRequest => {
    return {
        payload: {
            $case: "eventReceived",
            eventReceived: {
                eventId,
                tenantId,
                topic,
            },
        },
    };
};

const newEventHandledRequest = (
    tenantId: string,
    topic: string,
    eventId: string
): SubscribeRequest => {
    return {
        payload: {
            $case: "eventHandled",
            eventHandled: {
                eventId,
                tenantId,
                topic,
            },
        },
    };
};

const newEventNotHandledRequest = (
    tenantId: string,
    topic: string,
    eventId: string,
    reason: string
): SubscribeRequest => {
    return {
        payload: {
            $case: "eventNotHandled",
            eventNotHandled: {
                eventId,
                tenantId,
                topic,
                reason,
            },
        },
    };
};
