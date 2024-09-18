import { Event, ServiceClient } from "@fraym/proto/freym/streams/management";
import { HandlerFunc, SubscriptionEvent, getSubscriptionEvent } from "./event";
import { StopLoadingMoreFunc, retry } from "./util";

export const getAllEvents = async (
    tenantId: string,
    topic: string,
    types: string[],
    perPage: number,
    handler: HandlerFunc,
    stopLoadingMore: StopLoadingMoreFunc,
    serviceClient: ServiceClient
): Promise<void> => {
    let lastEventId: string | null = null;
    let events: Event[] = [];

    while (true) {
        if (!lastEventId) {
            events = await getEventPage(tenantId, topic, types, perPage, 0, serviceClient);
        } else {
            events = await getEventPageAfterEvent(
                tenantId,
                topic,
                types,
                lastEventId,
                perPage,
                0,
                serviceClient
            );
        }

        let lastEvent: SubscriptionEvent | null = null;

        for (const eventData of events) {
            const event = getSubscriptionEvent(eventData);
            if (event) {
                await handler(event);
                lastEvent = event;
                lastEventId = event.id;
            }
        }

        if (stopLoadingMore(lastEvent)) {
            return;
        }
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

export const getAllEventsAfterEvent = async (
    tenantId: string,
    topic: string,
    types: string[],
    eventId: string,
    perPage: number,
    handler: HandlerFunc,
    stopLoadingMore: StopLoadingMoreFunc,
    serviceClient: ServiceClient
): Promise<void> => {
    let page = 0;

    while (true) {
        const events = await getEventPageAfterEvent(
            tenantId,
            topic,
            types,
            eventId,
            perPage,
            page,
            serviceClient
        );

        page++;

        let lastEvent: SubscriptionEvent | null = null;

        for (const eventData of events) {
            const event = getSubscriptionEvent(eventData);
            if (event) {
                await handler(event);
                lastEvent = event;
            }
        }

        if (stopLoadingMore(lastEvent)) {
            return;
        }
    }
};

const getEventPageAfterEvent = async (
    tenantId: string,
    topic: string,
    types: string[],
    eventId: string,
    perPage: number,
    page: number,
    serviceClient: ServiceClient
) => {
    return retry(
        () =>
            new Promise<Event[]>((resolve, reject) => {
                serviceClient.paginateEventsAfterEventId(
                    {
                        tenantId,
                        topic,
                        types,
                        eventId,
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
