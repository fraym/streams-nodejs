import { ClientConfig } from "./config";
import { ClientDuplexStream } from "@grpc/grpc-js";
import { v4 as uuid } from "uuid";
import {
    SubscribeRequest,
    SubscribeRequest_InitAction,
    ServiceClient,
    SubscribeResponse,
} from "@fraym/streams-proto";

export type Stream = ClientDuplexStream<SubscribeRequest, SubscribeResponse>;

export const initStream = async (
    config: ClientConfig,
    serviceClient: ServiceClient
): Promise<Stream> => {
    const stream = serviceClient.subscribe();
    stream.on("end", stream.end);

    return new Promise<Stream>((resolve, reject) => {
        stream.once("data", (data: SubscribeResponse) => {
            if (data.data?.$case !== "initAck") {
                reject("connection to streams service was not initialized correctly");
                return;
            }

            resolve(stream);
        });

        stream.write(newInitRequest(config));
    });
};

const newInitAction = (config: ClientConfig): SubscribeRequest_InitAction => {
    return {
        groupId: config.groupId,
        subscriberId: uuid(),
    };
};

const newInitRequest = (config: ClientConfig): SubscribeRequest => {
    return {
        payload: {
            $case: "init",
            init: newInitAction(config),
        },
    };
};
