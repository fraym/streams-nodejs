import { getSubscriptionEvent, HandlerFunc, PublishEvent, SubscriptionEvent } from "./event";
import { ServiceClient, Event } from "@fraym/proto/freym/streams/management";
import { retry, StopLoadingMoreFunc } from "./util";
import { getProtobufPublishEventFromPublishedEvent } from "./publish";

export const getStream = async (
    topic: string,
    tenantId: string,
    stream: string,
    perPage: number,
    handler: HandlerFunc,
    stopLoadingMore: StopLoadingMoreFunc,
    serviceClient: ServiceClient
): Promise<void> => {
    let lastEventId: string | null = null;
    let possibleSnapshotEventId: string | null = null;
    let events: Event[] = [];

    while (true) {
        if (!lastEventId) {
            events = await getStreamPage(topic, tenantId, stream, perPage, 0, serviceClient);

            if (events.length > 0) {
                possibleSnapshotEventId = events[0].id;
            }
        } else {
            events = await getStreamPageAfterEvent(
                topic,
                tenantId,
                stream,
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
                if (lastEventId != null && possibleSnapshotEventId) {
                    if (event.id === possibleSnapshotEventId) {
                        continue;
                    }
                }

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

export const getStreamAfterEvent = async (
    topic: string,
    tenantId: string,
    stream: string,
    eventId: string,
    perPage: number,
    handler: HandlerFunc,
    stopLoadingMore: StopLoadingMoreFunc,
    serviceClient: ServiceClient
): Promise<void> => {
    let page = 0;

    while (true) {
        const events = await getStreamPageAfterEvent(
            topic,
            tenantId,
            stream,
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

const getStreamPageAfterEvent = async (
    topic: string,
    tenantId: string,
    stream: string,
    eventId: string,
    perPage: number,
    page: number,
    serviceClient: ServiceClient
) => {
    return retry(
        () =>
            new Promise<Event[]>((resolve, reject) => {
                serviceClient.paginateStreamAfterEventId(
                    {
                        stream,
                        tenantId,
                        topic,
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

export const createStreamSnapshot = async (
    tenantId: string,
    topic: string,
    stream: string,
    lastSnapshottedEventId: string,
    snapshotEvent: PublishEvent,
    serviceClient: ServiceClient
): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
        serviceClient.createStreamSnapshot(
            {
                topic,
                stream,
                tenantId,
                lastSnapshottedEventId,
                snapshotEvent: getProtobufPublishEventFromPublishedEvent(snapshotEvent),
            },
            error => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve();
            }
        );
    });
};
