import { getSubscriptionEvent, HandlerFunc } from "./event";
import { ServiceClient, PublishEventEnvelope } from "@fraym/proto/freym/streams/clientchannel";

export const getStream = async (
    tenantId: string,
    stream: string,
    perPage: number,
    handler: HandlerFunc,
    serviceClient: ServiceClient
): Promise<void> => {
    let page = 0;

    while (true) {
        const events = await getStreamPage(tenantId, stream, perPage, page, serviceClient);

        if (events.length === 0) {
            return;
        }

        for (const eventData of events) {
            const event = getSubscriptionEvent(eventData);
            if (event) {
                await handler(event);
            }
        }

        page++;
    }
};

export const getStreamPage = async (
    tenantId: string,
    stream: string,
    perPage: number,
    page: number,
    serviceClient: ServiceClient
) => {
    return new Promise<PublishEventEnvelope[]>((resolve, reject) => {
        serviceClient.paginateStream(
            {
                tenantId,
                stream,
                page: page.toString(),
                perPage: perPage.toString(),
            },
            async (error, data) => {
                if (error) {
                    reject(error.message);
                    return;
                }

                resolve(data.events);
            }
        );
    });
};

export const isStreamEmpty = async (
    tenantId: string,
    stream: string,
    serviceClient: ServiceClient
): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        serviceClient.isStreamEmpty(
            {
                stream,
                tenantId,
            },
            (error, data) => {
                if (error) {
                    reject(error.message);
                    return;
                }

                resolve(data.isEmpty);
            }
        );
    });
};
