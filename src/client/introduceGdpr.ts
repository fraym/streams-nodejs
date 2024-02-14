import { ServiceClient } from "@fraym/proto/freym/streams/management";
import { retry } from "./util";

export const introduceGdprOnEventField = async (
    tenantId: string,
    defaultValue: string,
    topic: string,
    eventId: string,
    fieldName: string,
    serviceClient: ServiceClient
) => {
    return retry(
        () =>
            new Promise<void>((resolve, reject) => {
                serviceClient.introduceGdprOnEventField(
                    {
                        tenantId,
                        defaultValue,
                        topic,
                        eventId,
                        fieldName,
                    },
                    error => {
                        if (error) {
                            reject(error);
                            return;
                        }

                        resolve();
                    }
                );
            })
    );
};
