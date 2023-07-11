import { ServiceClient } from "@fraym/streams-proto";

export const introduceGdprOnField = async (
    defaultValue: string,
    topic: string,
    eventType: string,
    fieldName: string,
    serviceClient: ServiceClient
) => {
    return new Promise<void>((resolve, reject) => {
        serviceClient.introduceGdprOnField(
            {
                defaultValue,
                topic,
                eventType,
                fieldName,
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

export const introduceGdprOnEventField = async (
    tenantId: string,
    defaultValue: string,
    topic: string,
    eventId: string,
    fieldName: string,
    serviceClient: ServiceClient
) => {
    return new Promise<void>((resolve, reject) => {
        serviceClient.introduceGdprOnEventField(
            {
                tenant: tenantId,
                defaultValue,
                topic,
                eventId,
                fieldName,
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
