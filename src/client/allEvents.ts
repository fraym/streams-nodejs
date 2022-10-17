import { ServiceClient } from "@fraym/streams-proto";
import { PublishEventEnvelope } from "@fraym/streams-proto/dist/event";
import { getSubscriptionEvent, HandlerFunc } from "./event";

export const getAllEvents = async (
    includedTopics: string[],
    excludedTopics: string[],
    handler: HandlerFunc,
    serviceClient: ServiceClient
): Promise<void> => {
    const stream = serviceClient.getEventsFromStart({
        excludedTopics,
        includedTopics,
    });

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
