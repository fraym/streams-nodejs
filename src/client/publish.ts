import { isGdprEventData, PublishEvent } from "./event";
import { Data, EventEnvelope, ServiceClient } from "@fraym/proto/freym/streams/clientchannel";

export const sendPublish = async (
    topic: string,
    events: PublishEvent[],
    serviceClient: ServiceClient
) => {
    return new Promise<void>((resolve, reject) => {
        serviceClient.publish(
            {
                events: events.map(getEventEnvelopeFromPublishedEvent),
                topic,
            },
            error => {
                if (error) {
                    reject(error.message);
                    return;
                }

                resolve();
            }
        );
    });
};

const getEventEnvelopeFromPublishedEvent = (event: PublishEvent): EventEnvelope => {
    const payload: Record<string, Data> = {};

    for (const key in event.payload) {
        const currentData = event.payload[key];

        payload[key] = isGdprEventData(currentData)
            ? {
                  value: JSON.stringify(currentData.value),
                  metadata: {
                      $case: "gdpr",
                      gdpr: {
                          default: JSON.stringify(currentData.gdprDefault),
                          id: currentData.id ?? "",
                          invalidated: false,
                      },
                  },
              }
            : {
                  value: JSON.stringify(currentData),
              };
    }

    return {
        broadcast: event.broadcast ?? false,
        tenantId: event.tenantId,
        event: {
            id: event.id,
            type: event.type ?? "",
            reason: event.reason ?? "",
            stream: event.stream ?? "",
            correlationId: event.correlationId ?? "",
            causationId: event.causationId ?? "",
            payload,
            raisedAt: 0,
        },
    };
};
