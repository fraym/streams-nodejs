import { ClientConfig } from "./config";
import { ClientDuplexStream } from "@grpc/grpc-js";
import { v4 as uuid } from "uuid";
import { Request, Request_InitAction, ServiceClient, Response } from "@fraym/streams-proto";

export type Stream = ClientDuplexStream<Request, Response>;

export const initStream = async (
    config: ClientConfig,
    serviceClient: ServiceClient
): Promise<Stream> => {
    const stream = serviceClient.connect();
    stream.on("end", stream.end);

    return new Promise<Stream>((resolve, reject) => {
        stream.once("data", (data: Response) => {
            if (data.data?.$case !== "initAck") {
                reject("connection to streams service was not initialized correctly");
                return;
            }

            resolve(stream);
        });

        stream.write(newInitRequest(config));
    });
};

const newInitAction = (config: ClientConfig): Request_InitAction => {
    return {
        groupId: config.groupId,
        subscriberId: uuid(),
    };
};

const newInitRequest = (config: ClientConfig): Request => {
    return {
        payload: {
            $case: "init",
            init: newInitAction(config),
        },
    };
};
