import { ServiceClient } from "../protobuf/clientchannel/service_grpc_pb";
import { GetEventsFromStartRequest } from "../protobuf/clientchannel/get_events_from_start_pb";
import { PublishEventEnvelope } from "../protobuf/clientchannel/event_pb";
import { getSubscriptionEvent, HandlerFunc } from "./event";

export const getAllEvents = async (
    includedTopics: string[],
    excludedTopics: string[],
    handler: HandlerFunc,
    serviceClient: ServiceClient
): Promise<void> => {
    const stream = serviceClient.getEventsFromStart(
        newGetEventsFromStartRequest(includedTopics, excludedTopics)
    );

    return new Promise<void>((resolve, reject) => {
        stream.on("data", (data: PublishEventEnvelope) => {
            const event = getSubscriptionEvent(data);
            if (event) {
                handler(event);
            }
        });
        stream.on("end", () => {
            resolve();
        });
        stream.on("error", e => {
            reject(e);
        });
    });
};

const newGetEventsFromStartRequest = (
    includedTopics: string[],
    excludedTopics: string[]
): GetEventsFromStartRequest => {
    const request = new GetEventsFromStartRequest();
    request.setIncludedTopicsList(includedTopics);
    request.setExcludedTopicsList(excludedTopics);
    return request;
};
