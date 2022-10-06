import { ServiceClient } from "../protobuf/clientchannel/service_grpc_pb";
import { GetStreamRequest } from "../protobuf/clientchannel/get_stream_pb";
import { getSubscriptionEvent, SubscriptionEvent } from "./event";

export const getStream = async (
    tenantId: string,
    stream: string,
    serviceClient: ServiceClient
): Promise<SubscriptionEvent[]> => {
    return new Promise<SubscriptionEvent[]>((resolve, reject) => {
        serviceClient.getStream(newGetStreamRequest(tenantId, stream), (error, response) => {
            if (error) {
                reject(error.message);
                return;
            }

            resolve(
                response
                    .getEventsList()
                    .map(getSubscriptionEvent)
                    .filter(event => event !== null) as SubscriptionEvent[]
            );
        });
    });
};

const newGetStreamRequest = (tenantId: string, stream: string): GetStreamRequest => {
    const request = new GetStreamRequest();
    request.setStream(stream);
    request.setTenantId(tenantId);
    return request;
};
