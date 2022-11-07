import { Request, Response } from "@fraym/streams-proto";
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
            reject("did not receive snapshot started in configured timeout range");
        }, config.ackTimeout);

        const fn = (data: Response) => {
            if (
                data.data?.$case === "snapshotNotStarted" &&
                data.data.snapshotNotStarted.topic === topic
            ) {
                clearTimeout(timeout);
                stream.off("data", fn);
                reject(
                    `did receive snapshot not started message, reason: ${data.data.snapshotNotStarted.reason}`
                );
                return;
            }

            if (
                data.data?.$case === "snapshotNotFinished" &&
                data.data.snapshotNotFinished.topic === topic
            ) {
                clearTimeout(timeout);
                stream.off("data", fn);
                reject(
                    `did receive snapshot not finished message, reason: ${data.data.snapshotNotFinished.reason}`
                );
                return;
            }

            if (
                data.data?.$case === "snapshotStarted" &&
                data.data.snapshotStarted.topic === topic
            ) {
                clearTimeout(timeout);
                return;
            }

            if (
                data.data?.$case === "snapshotFinished" &&
                data.data.snapshotFinished.topic === topic
            ) {
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
