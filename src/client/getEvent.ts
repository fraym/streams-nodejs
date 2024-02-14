import { ServiceClient } from "@fraym/proto/freym/streams/management";
import { SubscriptionEvent, getSubscriptionEvent } from "./event";
import { retry } from "./util";

export const getEvent = async (
    tenantId: string,
    topic: string,
    eventId: string,
    serviceClient: ServiceClient
) => {
    return retry(
        () =>
            new Promise<SubscriptionEvent>((resolve, reject) => {
                serviceClient.getEvent(
                    {
                        tenantId,
                        topic,
                        id: eventId,
                    },
                    (error, response) => {
                        if (error) {
                            reject(error);
                            return;
                        }
                        const event = getSubscriptionEvent(response);

                        if (event) {
                            resolve(event);
                            return;
                        }

                        reject("unable to resolve event from event data");
                    }
                );
            })
    );
};
