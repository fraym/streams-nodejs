import { ServiceClient } from "@fraym/proto/freym/streams/management";
import { retry } from "./util";

export const sendInvalidateGdpr = async (
    tenantId: string,
    topic: string,
    gdprId: string,
    serviceClient: ServiceClient
) => {
    return retry(
        () =>
            new Promise<void>((resolve, reject) => {
                serviceClient.invalidateGdpr(
                    {
                        tenantId,
                        topic,
                        gdprId,
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
