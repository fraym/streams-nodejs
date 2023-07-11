import { PublishEventEnvelope } from "@fraym/streams-proto";

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

export type EventData = any | GdprEventData;

export interface GdprEventData {
    id?: string;
    value: any;
    gdprDefault: any;
    isInvalidated: boolean;
}

export const isGdprEventData = (value: EventData): value is GdprEventData => {
    return (
        value &&
        typeof value === "object" &&
        Object.keys(value).length == 2 &&
        value.hasOwnProperty("value") &&
        value.hasOwnProperty("gdprDefault")
    );
};

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
                    value: JSON.parse(data.value),
                    gdprDefault: data.metadata.gdpr.default
                        ? JSON.parse(data.metadata.gdpr.default)
                        : "",
                    isInvalidated: data.metadata.gdpr.invalidated,
                };
            } else {
                payload[key] = JSON.parse(data.value);
            }
        }
    }

    return {
        id: event.id,
        topic: eventEnvelope.topic,
        tenantId: eventEnvelope.tenantId,
        payload,
        raisedAt: new Date(parseInt(event.raisedAt.slice(0, -6))),
        stream: event.stream || undefined,
        type: event.type || undefined,
        causationId: event.causationId || undefined,
        correlationId: event.correlationId || undefined,
        reason: event.reason || undefined,
    };
};
