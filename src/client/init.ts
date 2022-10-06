import { ClientConfig } from "./config";
import { ServiceClient } from "../protobuf/clientchannel/service_grpc_pb";
import { ClientDuplexStream } from "@grpc/grpc-js";
import { Request } from "../protobuf/clientchannel/request_pb";
import { Response } from "../protobuf/clientchannel/response_pb";
import { v4 as uuid } from "uuid";

export type Stream = ClientDuplexStream<Request, Response>;

export const initStream = async (
    config: ClientConfig,
    serviceClient: ServiceClient
): Promise<Stream> => {
    const stream = serviceClient.connect();
    stream.on("end", stream.end);

    return new Promise<Stream>((resolve, reject) => {
        stream.once("data", (data: Response) => {
            if (!data.hasInitAck()) {
                reject("connection to streams service was not initialized correctly");
                return;
            }

            resolve(stream);
        });

        stream.write(newInitRequest(config));
    });
};

const newInitAction = (config: ClientConfig): Request.InitAction => {
    const action = new Request.InitAction();
    action.setGroupId(config.groupId);
    action.setSubscriberId(uuid());
    return action;
};

const newInitRequest = (config: ClientConfig): Request => {
    const request = new Request();
    request.setInit(newInitAction(config));
    return request;
};
