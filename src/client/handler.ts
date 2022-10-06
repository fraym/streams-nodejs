import { Stream } from "./init";
import { Response } from "../protobuf/clientchannel/response_pb";
import { getSubscriptionEvent, HandlerFunc, SubscriptionEvent } from "./event";
import { Request } from "../protobuf/clientchannel/request_pb";

interface EventHandler {
    addHandler: (type: string, handler: HandlerFunc) => void;
    addHandlerForAllTypes: (handler: HandlerFunc) => void;
}

export const initEventHandler = (stream: Stream): EventHandler => {
    const typeHandlerMap: Record<string, HandlerFunc[]> = {};
    const globalHandlers: HandlerFunc[] = [];

    stream.on("data", (data: Response) => {
        const eventEnvelope = data.hasEvent() ? data.getEvent() : null;
        const event = eventEnvelope ? getSubscriptionEvent(eventEnvelope) : null;
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
    const action = new Request.EventAck();
    action.setTenantId(tenantId);
    action.setTopic(topic);
    action.setEventId(eventId);

    const request = new Request();
    request.setEventAck(action);
    return request;
};

const newEventNotAckRequest = (
    tenantId: string,
    topic: string,
    eventId: string,
    reason: string
): Request => {
    const action = new Request.EventNotAck();
    action.setTenantId(tenantId);
    action.setTopic(topic);
    action.setEventId(eventId);
    action.setReason(reason);

    const request = new Request();
    request.setEventNotAck(action);
    return request;
};
