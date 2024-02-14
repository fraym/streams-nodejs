import { Event } from "@fraym/proto/freym/streams/management";

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

export const getSubscriptionEvent = (event: Event): SubscriptionEvent | null => {
    const payload: Record<string, EventData> = {};

    for (const key in event.payload) {
        if (Object.prototype.hasOwnProperty.call(event.payload, key)) {
            const data = event.payload[key];

            if (data.gdpr) {
                payload[key] = {
                    value: JSON.parse(data.value),
                    gdprDefault: data.gdpr.default ? JSON.parse(data.gdpr.default) : "",
                    isInvalidated: data.gdpr.isInvalidated,
                };
            } else {
                payload[key] = JSON.parse(data.value);
            }
        }
    }

    return {
        id: event.id,
        topic: event.topic,
        tenantId: event.tenantId,
        payload,
        raisedAt: new Date(parseInt(event.raisedAt.slice(0, -6))),
        stream: event.stream || undefined,
        type: event.type || undefined,
        causationId: event.metadata ? event.metadata.causationId : undefined,
        correlationId: event.metadata ? event.metadata.correlationId : undefined,
        reason: event.reason || undefined,
    };
};
