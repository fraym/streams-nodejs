import { getSubscriptionEvent, HandlerFunc } from "./event";
import { ServiceClient } from "@fraym/proto/freym/streams/clientchannel";

export const getStream = async (
    tenantId: string,
    stream: string,
    perPage: number,
    handler: HandlerFunc,
    serviceClient: ServiceClient
): Promise<void> => {
    let page = 0;
    let finished = false;

    while (!finished) {
        await serviceClient.paginateStream(
            {
                tenantId,
                stream,
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
