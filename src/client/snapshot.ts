import { Request } from "@fraym/streams-proto/dist/request";
import { Response } from "@fraym/streams-proto/dist/response";
import { ClientConfig } from "./config";
import { Stream } from "./init";

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
            if (data.data?.$case === "snapshotNotAck" && data.data.snapshotNotAck.topic === topic) {
                clearTimeout(timeout);
                stream.off("data", fn);
                reject(
                    `did receive snapshot not ack message, reason: ${data.data.snapshotNotAck.reason}`
                );
                return;
            }

            if (data.data?.$case === "snapshotAck" && data.data.snapshotAck.topic === topic) {
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
    return {
        payload: {
            $case: "snapshot",
            snapshot: {
                topic,
                toTime: toTime.toISOString(),
            },
        },
    };
};
