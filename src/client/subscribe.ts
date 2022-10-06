import { ClientConfig } from "./config";
import { Stream } from "./init";
import { Request } from "../protobuf/clientchannel/request_pb";
import { Response } from "../protobuf/clientchannel/response_pb";

export const sendSubscribe = async (
    includedTopics: string[],
    excludedTopics: string[],
    config: ClientConfig,
    stream: Stream
) => {
    stream.write(newSubscribeRequest(includedTopics, excludedTopics));

    return new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
            stream.off("data", fn);
            reject("did not receive subscribe ack in configured timeout range");
        }, config.ackTimeout);

        const fn = (data: Response) => {
            if (data.hasSubscribeNotAck()) {
                clearTimeout(timeout);
                stream.off("data", fn);
                reject("did receive subscribe not ack message");
                return;
            }

            if (data.hasSubscribeAck()) {
                clearTimeout(timeout);
                stream.off("data", fn);
                resolve();
                return;
            }
        };

        stream.on("data", fn);
    });
};

const newSubscribeRequest = (includedTopics: string[], excludedTopics: string[]): Request => {
    const action = new Request.SubscribeAction();
    action.setIncludedTopicsList(includedTopics);
    action.setExcludedTopicsList(excludedTopics);

    const request = new Request();
    request.setSubscribe(action);
    return request;
};
