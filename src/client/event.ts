import { PublishEventEnvelope } from "@fraym/streams-proto/dist/event";

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
    const event = eventEnvelope.event;
    if (!event) {
        return null;
    }

    const payload: Record<string, EventData> = {};

    for (const key in event.payload) {
        if (Object.prototype.hasOwnProperty.call(event.payload, key)) {
            const data = event.payload[key];

            if (data.metadata && data.metadata.gdpr) {
                payload[key] = {
                    value: data.value,
                    gdprDefault: data.metadata.gdpr.default ?? "",
                };
            } else {
                payload[key] = data.value;
            }
        }
    }

    return {
        id: event.id,
        topic: eventEnvelope.topic,
        tenantId: eventEnvelope.tenantId,
        payload,
        raisedAt: new Date(event.raisedAt),
        stream: event.stream || undefined,
        type: event.type || undefined,
        causationId: event.causationId || undefined,
        correlationId: event.correlationId || undefined,
        reason: event.reason || undefined,
    };
};
