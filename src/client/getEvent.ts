import { ServiceClient } from "@fraym/streams-proto";
import { SubscriptionEvent, getSubscriptionEvent } from "./event";

export const getEvent = async (
    tenantId: string,
    topic: string,
    eventId: string,
    serviceClient: ServiceClient
) => {
    return new Promise<SubscriptionEvent>((resolve, reject) => {
        serviceClient.getEvent(
            {
                tenantId,
                topic,
                eventId,
            },
            (error, response) => {
                if (error) {
                    reject(error.message);
                    return;
                }
                const event = getSubscriptionEvent(response);
                if (event) {
                    resolve(event);
                }
                reject("unable to resolve event from event data");
            }
        );
    });
};
