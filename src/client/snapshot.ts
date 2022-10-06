import { ClientConfig } from "./config";
import { Stream } from "./init";
import { Request } from "../protobuf/clientchannel/request_pb";
import { Response } from "../protobuf/clientchannel/response_pb";

export const sendSnapshot = async (
    topic: string,
    toTime: Date,
    config: ClientConfig,
    stream: Stream
) => {
    stream.write(newSnapshotRequest(topic, toTime));

    return new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
            stream.off("data", fn);
            reject("did not receive snapshot ack in configured timeout range");
        }, config.ackTimeout);

        const fn = (data: Response) => {
            if (data.hasSnapshotNotAck() && data.getSnapshotNotAck()?.getTopic() === topic) {
                clearTimeout(timeout);
                stream.off("data", fn);
                reject(
                    `did receive snapshot not ack message, reason: ${data
                        .getSnapshotNotAck()
                        ?.getReason()}`
                );
                return;
            }

            if (data.hasSubscribeAck() && data.getSnapshotAck()?.getTopic() === topic) {
                clearTimeout(timeout);
                stream.off("data", fn);
                resolve();
                return;
            }
        };

        stream.on("data", fn);
    });
};

const newSnapshotRequest = (topic: string, toTime: Date): Request => {
    const action = new Request.SnapshotAction();
    action.setTopic(topic);
    action.setToTime(toTime.toISOString());

    const request = new Request();
    request.setSnapshot(action);
    return request;
};
