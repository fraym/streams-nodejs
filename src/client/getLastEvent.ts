import { ServiceClient } from "@fraym/proto/freym/streams/management";
import { SubscriptionEvent, getSubscriptionEvent } from "./event";
import { retry } from "./util";

export const getLastEvent = async (
    tenantId: string,
    topic: string,
    serviceClient: ServiceClient
) => {
    return retry(
        () =>
            new Promise<SubscriptionEvent | null>((resolve, reject) => {
                serviceClient.getLastEvent(
                    {
                        tenantId,
                        topic,
                    },
                    (error, response) => {
                        if (error?.details.includes("unable to find last event")) {
                            resolve(null);
                            return;
                        }

                        if (error) {
                            reject(error);
                            return;
                        }
                        const event = getSubscriptionEvent(response);

                        if (event) {
                            resolve(event);
                            return;
                        }

                        reject("unable to resolve last event from event data");
                    }
                );
            })
    );
};
