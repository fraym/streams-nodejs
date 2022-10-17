import { Request } from "@fraym/streams-proto/dist/request";
import { Response } from "@fraym/streams-proto/dist/response";
import { ClientConfig } from "./config";
import { Stream } from "./init";

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
            if (data.data?.$case === "subscribeNotAck") {
                clearTimeout(timeout);
                stream.off("data", fn);
                reject(
                    `did receive subscribe not ack message: ${data.data.subscribeNotAck.reason}`
                );
                return;
            }

            if (data.data?.$case === "subscribeAck") {
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
    return {
        payload: {
            $case: "subscribe",
            subscribe: {
                excludedTopics,
                includedTopics,
            },
        },
    };
};
