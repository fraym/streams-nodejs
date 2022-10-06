import { PublishEventEnvelope } from "../protobuf/clientchannel/event_pb";

export interface SubscriptionEvent extends BaseEvent {
    topic: string;
    raisedAt: Date;
}

export interface PublishEvent extends BaseEvent {
    broadcast?: boolean;
}

export interface BaseEvent {
    id: string;
    payload: Record<string, EventData>;
    tenantId: string;
    type?: string;
    stream?: string;
    correlationId?: string;
    causationId?: string;
    reason?: string;
}

export type EventData = string | GdprEventData;

export interface GdprEventData {
    value: string;
    gdprDefault: string;
}

export type HandlerFunc = (event: SubscriptionEvent) => Promise<void>;

export const getSubscriptionEvent = (
    eventEnvelope: PublishEventEnvelope
): SubscriptionEvent | null => {
    const event = eventEnvelope.getEvent();
    if (!event) {
        return null;
    }

    const payload: Record<string, EventData> = {};

    event.getPayloadMap().forEach((data, key) => {
        if (data.hasGdpr()) {
            payload[key] = {
                value: data.getValue(),
                gdprDefault: data.getGdpr()?.getDefault() ?? "",
            };
        } else {
            payload[key] = data.getValue();
        }
    });

    return {
        id: event.getId(),
        topic: eventEnvelope.getTopic(),
        tenantId: eventEnvelope.getTenantId(),
        payload,
        raisedAt: new Date(event.getRaisedAt()),
        stream: event.getStream() || undefined,
        type: event.getType() || undefined,
        causationId: event.getCausationId() || undefined,
        correlationId: event.getCorrelationId() || undefined,
        reason: event.getReason() || undefined,
    };
};
