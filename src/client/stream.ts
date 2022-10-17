import { getSubscriptionEvent, SubscriptionEvent } from "./event";
import { ServiceClient } from "@fraym/streams-proto";

export const getStream = async (
    tenantId: string,
    stream: string,
    serviceClient: ServiceClient
): Promise<SubscriptionEvent[]> => {
    return new Promise<SubscriptionEvent[]>((resolve, reject) => {
        serviceClient.getStream(
            {
                stream,
                tenantId,
            },
            (error, response) => {
                if (error) {
                    reject(error.message);
                    return;
                }

                resolve(
                    response.events
                        .map(getSubscriptionEvent)
                        .filter(event => event !== null) as SubscriptionEvent[]
                );
            }
        );
    });
};
