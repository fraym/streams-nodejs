import { ServiceClient } from "@fraym/proto/freym/streams/clientchannel";
import { getSubscriptionEvent, HandlerFunc } from "./event";

export const getAllEvents = async (
    tenantId: string,
    topic: string,
    includedEventTypes: string[],
    perPage: number,
    handler: HandlerFunc,
    serviceClient: ServiceClient
): Promise<void> => {
    let page = 0;
    let finished = false;

    while (!finished) {
        await serviceClient.paginateEvents(
            {
                tenantId,
                topic,
                includedEventTypes,
                page: page.toString(),
                perPage: perPage.toString(),
            },
            async (error, data) => {
                if (error) {
                    throw error;
                }

                if (data.events.length === 0) {
                    finished = true;
                    return;
                }

                for (const eventData of data.events) {
                    const event = getSubscriptionEvent(eventData);
                    if (event) {
                        await handler(event);
                    }
                }
            }
        );

        page++;
    }
};
