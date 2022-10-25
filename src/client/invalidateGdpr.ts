import { Request, Response } from "@fraym/streams-proto";
import { ClientConfig } from "./config";
import { Stream } from "./init";

export const sendInvalidateGdpr = async (
    tenantId: string,
    topic: string,
    gdprId: string,
    config: ClientConfig,
    stream: Stream
) => {
    stream.write(newInvalidateGdprRequest(tenantId, topic, gdprId));

    return new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
            stream.off("data", fn);
            reject("did not receive invalidate gdpr ack in configured timeout range");
        }, config.ackTimeout);

        const fn = (data: Response) => {
            if (data.data?.$case === "invalidateGdprNotAck") {
                const notAck = data.data.invalidateGdprNotAck;

                if (
                    notAck.tenantId === tenantId &&
                    notAck.topic === topic &&
                    notAck.gdprId === gdprId
                ) {
                    clearTimeout(timeout);
                    stream.off("data", fn);
                    reject(`did receive invalidate gdpr not ack message, reason: ${notAck.reason}`);
                    return;
                }
            }

            if (data.data?.$case === "invalidateGdprAck") {
                const ack = data.data.invalidateGdprAck;

                if (ack.tenantId === tenantId && ack.topic === topic && ack.gdprId === gdprId) {
                    clearTimeout(timeout);
                    stream.off("data", fn);
                    resolve();
                    return;
                }
            }
        };

        stream.on("data", fn);
    });
};

const newInvalidateGdprRequest = (tenantId: string, topic: string, gdprId: string): Request => {
    return {
        payload: {
            $case: "invalidateGdpr",
            invalidateGdpr: {
                tenantId,
                topic,
                gdprId,
            },
        },
    };
};
