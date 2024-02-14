import { Event, ServiceClient } from "@fraym/proto/freym/streams/management";
import { HandlerFunc, getSubscriptionEvent } from "./event";
import { retry } from "./util";

export const getAllEvents = async (
    tenantId: string,
    topic: string,
    types: string[],
    perPage: number,
    handler: HandlerFunc,
    serviceClient: ServiceClient
): Promise<void> => {
    let page = 0;

    while (true) {
        const events = await getEventPage(tenantId, topic, types, perPage, page, serviceClient);

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

const getEventPage = async (
    tenantId: string,
    topic: string,
    types: string[],
    perPage: number,
    page: number,
    serviceClient: ServiceClient
) => {
    return retry(
        () =>
            new Promise<Event[]>((resolve, reject) => {
                serviceClient.paginateEvents(
                    {
                        tenantId,
                        topic,
                        types,
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
