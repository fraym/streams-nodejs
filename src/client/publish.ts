import { EventEnvelope, Event, Data } from "../protobuf/clientchannel/event_pb";
import { v4 as uuid } from "uuid";
import { Request } from "../protobuf/clientchannel/request_pb";
import { Stream } from "./init";
import { Response } from "../protobuf/clientchannel/response_pb";
import { ClientConfig } from "./config";
import { PublishEvent } from "./event";

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
                data.hasPublishAck() &&
                data.getPublishAck()?.getPublishActionId() === publishActionId
            ) {
                clearTimeout(timeout);
                stream.off("data", fn);
                resolve();
                return;
            }

            if (
                data.hasPublishNotAck() &&
                data.getPublishNotAck()?.getPublishActionId() === publishActionId
            ) {
                clearTimeout(timeout);
                stream.off("data", fn);
                reject("did receive publish not ack message");
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
    const action = new Request.PublishAction();
    action.setPublishActionId(publishActionId);
    action.setTopic(topic);
    action.setEventsList(events.map(getEventEnvelopeFromPublishedEvent));

    const request = new Request();
    request.setPublish(action);
    return request;
};

const getEventEnvelopeFromPublishedEvent = (event: PublishEvent): EventEnvelope => {
    const newEvent = new Event();
    newEvent.setId(event.id);
    newEvent.setType(event.type ?? "");
    newEvent.setReason(event.reason ?? "");
    newEvent.setStream(event.stream ?? "");
    newEvent.setCorrelationId(event.correlationId ?? "");
    newEvent.setCausationId(event.causationId ?? "");
    newEvent.setReason(event.reason ?? "");

    for (const key in event.payload) {
        const currentData = event.payload[key];
        const data = new Data();

        if (typeof currentData === "string") {
            data.setValue(currentData);
        } else {
            const metadata = new Data.GdprMetadata();
            metadata.setDefault(currentData.gdprDefault);
            data.setGdpr(metadata);
            data.setValue(currentData.value);
        }

        newEvent.getPayloadMap().set(key, data);
    }

    const envelope = new EventEnvelope();
    envelope.setTenantId(event.tenantId);
    envelope.setBroadcast(event.broadcast ?? false);
    envelope.setEvent(newEvent);

    return envelope;
};
