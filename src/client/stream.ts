import { Event, ServiceClient } from "@fraym/proto/freym/streams/management";
import { HandlerFunc, PublishEvent, SubscriptionEvent, getSubscriptionEvent } from "./event";
import { getProtobufPublishEventFromPublishedEvent } from "./publish";
import { StopLoadingMoreFunc, retry } from "./util";

export const getStream = async (
    topic: string,
    tenantId: string,
    stream: string,
    perPage: number,
    handler: HandlerFunc,
    stopLoadingMore: StopLoadingMoreFunc,
    serviceClient: ServiceClient
): Promise<void> => {
    let page = 0;
    let snapshotEventId: string | null = null;

    while (true) {
        const response = await getStreamPage(
            topic,
            tenantId,
            stream,
            perPage,
            page,
            snapshotEventId,
            serviceClient
        );

        snapshotEventId = response.snapshotEventId;

        page++;

        let lastEvent: SubscriptionEvent | null = null;

        for (const eventData of response.events) {
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

interface StreamPageResponse {
    events: Event[];
    snapshotEventId: string;
}

const getStreamPage = async (
    topic: string,
    tenantId: string,
    stream: string,
    perPage: number,
    page: number,
    snapshotEventId: string | null,
    serviceClient: ServiceClient
) => {
    return retry(
        () =>
            new Promise<StreamPageResponse>((resolve, reject) => {
                serviceClient.paginateStream(
                    {
                        stream,
                        tenantId,
                        topic,
                        page: page.toString(),
                        perPage: perPage.toString(),
                        snapshotEventId: snapshotEventId ?? "",
                    },
                    async (error, data) => {
                        if (error) {
                            reject(error);
                            return;
                        }

                        resolve(data);
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
    let snapshotEventId: string | null = null;

    while (true) {
        const response = await getStreamPageAfterEvent(
            topic,
            tenantId,
            stream,
            eventId,
            perPage,
            page,
            snapshotEventId,
            serviceClient
        );

        snapshotEventId = response.snapshotEventId;

        page++;

        let lastEvent: SubscriptionEvent | null = null;

        for (const eventData of response.events) {
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
    snapshotEventId: string | null,
    serviceClient: ServiceClient
) => {
    return retry(
        () =>
            new Promise<StreamPageResponse>((resolve, reject) => {
                serviceClient.paginateStreamAfterEventId(
                    {
                        stream,
                        tenantId,
                        topic,
                        eventId,
                        page: page.toString(),
                        perPage: perPage.toString(),
                        snapshotEventId: snapshotEventId ?? "",
                    },
                    async (error, data) => {
                        if (error) {
                            reject(error);
                            return;
                        }

                        resolve(data);
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
