import { ServiceClient, PublishEventEnvelope } from "@fraym/proto/freym/streams/clientchannel";
import { getSubscriptionEvent, HandlerFunc } from "./event";

export const getAllEventsFiltered = async (
    includedTopics: string[],
    includedEventTypes: string[],
    handler: HandlerFunc,
    serviceClient: ServiceClient
): Promise<void> => {
    const stream = serviceClient.getFilteredEventsFromStart({
        includedTopics,
        includedEventTypes,
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
