import { isGdprEventData, PublishEvent } from "./event";
import {
    PublishEvent as ProtobufPublishEvent,
    EventPayload,
    ServiceClient,
} from "@fraym/proto/freym/streams/management";
import { retry } from "./util";

export const sendPublish = async (
    topic: string,
    events: PublishEvent[],
    serviceClient: ServiceClient
) => {
    return retry(
        () =>
            new Promise<void>((resolve, reject) => {
                serviceClient.publish(
                    {
                        events: events.map(getProtobufPublishEventFromPublishedEvent),
                        topic,
                    },
                    error => {
                        if (error) {
                            reject(error);
                            return;
                        }

                        resolve();
                    }
                );
            })
    );
};

const getProtobufPublishEventFromPublishedEvent = (event: PublishEvent): ProtobufPublishEvent => {
    const payload: Record<string, EventPayload> = {};

    for (const key in event.payload) {
        const currentData = event.payload[key];

        payload[key] = isGdprEventData(currentData)
            ? {
                  value: JSON.stringify(currentData.value),
                  gdpr: {
                      default: JSON.stringify(currentData.gdprDefault),
                      id: currentData.id ?? "",
                      isInvalidated: false,
                  },
              }
            : {
                  value: JSON.stringify(currentData),
                  gdpr: undefined,
              };
    }

    return {
        id: event.id,
        metadata: {
            causationId: event.causationId ?? "",
            correlationId: event.correlationId ?? "",
        },
        options: {
            broadcast: event.broadcast ?? false,
        },
        reason: event.reason ?? "",
        stream: event.stream ?? "",
        tenantId: event.tenantId,
        type: event.type ?? "",
        payload,
    };
};
