import { ServiceClient } from "@fraym/proto/freym/streams/management";
import { SubscriptionEvent, getSubscriptionEvent } from "./event";
import { retry } from "./util";

export const getLastEventByTypes = async (
    tenantId: string,
    topic: string,
    types: string[],
    serviceClient: ServiceClient
) => {
    return retry(
        () =>
            new Promise<SubscriptionEvent | null>((resolve, reject) => {
                serviceClient.getLastEventByTypes(
                    {
                        tenantId,
                        topic,
                        types,
                    },
                    (error, response) => {
                        if (error?.details.includes("unable to find last event by types")) {
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

                        reject("unable to resolve last event by types from event data");
                    }
                );
            })
    );
};
