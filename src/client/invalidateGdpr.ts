import { ServiceClient } from "@fraym/proto/freym/streams/clientchannel";

export const sendInvalidateGdpr = async (
    tenantId: string,
    topic: string,
    gdprId: string,
    serviceClient: ServiceClient
) => {
    return new Promise<void>((resolve, reject) => {
        serviceClient.invalidateGdpr(
            {
                tenantId,
                topic,
                gdprId,
            },
            error => {
                if (error) {
                    reject(error.message);
                    return;
                }

                resolve();
            }
        );
    });
};
