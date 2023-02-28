import { ServiceClient } from "@fraym/streams-proto";

export const sendSnapshot = async (topic: string, toTime: Date, serviceClient: ServiceClient) => {
    return new Promise<void>((resolve, reject) => {
        serviceClient.snapshot(
            {
                topic,
                toTime: toTime.toISOString(),
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
