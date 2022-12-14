import { v4 as uuid } from "uuid";
import { Stream } from "./init";
import { ClientConfig } from "./config";
import { PublishEvent } from "./event";
import { Response, Request, Data, EventEnvelope } from "@fraym/streams-proto";

export const sendPublish = async (
    topic: string,
    events: PublishEvent[],
    config: ClientConfig,
    stream: Stream
) => {
    const publishActionId = uuid();
    stream.write(newPublishRequest(publishActionId, topic, events));

    return new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
            stream.off("data", fn);
            reject("did not receive publish ack in configured timeout range");
        }, config.ackTimeout);

        const fn = (data: Response) => {
            if (
                data.data?.$case === "publishAck" &&
                data.data.publishAck.publishActionId === publishActionId
            ) {
                clearTimeout(timeout);
                stream.off("data", fn);
                resolve();
                return;
            }

            if (
                data.data?.$case === "publishNotAck" &&
                data.data.publishNotAck.publishActionId === publishActionId
            ) {
                clearTimeout(timeout);
                stream.off("data", fn);
                reject(`did receive publish not ack message: ${data.data.publishNotAck.reason}`);
                return;
            }
        };

        stream.on("data", fn);
    });
};

const newPublishRequest = (
    publishActionId: string,
    topic: string,
    events: PublishEvent[]
): Request => {
    return {
        payload: {
            $case: "publish",
            publish: {
                topic,
                publishActionId,
                events: events.map(getEventEnvelopeFromPublishedEvent),
            },
        },
    };
};

const getEventEnvelopeFromPublishedEvent = (event: PublishEvent): EventEnvelope => {
    const payload: Record<string, Data> = {};

    for (const key in event.payload) {
        const currentData = event.payload[key];

        payload[key] =
            typeof currentData === "string"
                ? {
                      value: currentData,
                  }
                : {
                      value: currentData.value,
                      metadata: {
                          $case: "gdpr",
                          gdpr: {
                              default: currentData.gdprDefault,
                              id: "",
                          },
                      },
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
            raisedAt: "0",
        },
    };
};
