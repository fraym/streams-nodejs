import { getSubscriptionEvent, HandlerFunc } from "./event";
import { ServiceClient, Event } from "@fraym/proto/freym/streams/management";
import { retry } from "./util";

export const getStream = async (
    topic: string,
    tenantId: string,
    stream: string,
    perPage: number,
    handler: HandlerFunc,
    serviceClient: ServiceClient
): Promise<void> => {
    let page = 0;

    while (true) {
        const events = await getStreamPage(topic, tenantId, stream, perPage, page, serviceClient);

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

const getStreamPage = async (
    topic: string,
    tenantId: string,
    stream: string,
    perPage: number,
    page: number,
    serviceClient: ServiceClient
) => {
    return retry(
        () =>
            new Promise<Event[]>((resolve, reject) => {
                serviceClient.paginateStream(
                    {
                        stream,
                        tenantId,
                        topic,
                        page: page.toString(),
                        perPage: perPage.toString(),
                    },
                    async (error, data) => {
                        if (error) {
                            reject(error);
                            return;
                        }

                        resolve(data.events);
                    }
                );
            })
    );
};

export const isStreamEmpty = async (
    topic: string,
    tenantId: string,
    stream: string,
    serviceClient: ServiceClient
): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        serviceClient.isStreamEmpty(
            {
                topic,
                stream,
                tenantId,
            },
            (error, data) => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve(data.isEmpty);
            }
        );
    });
};
