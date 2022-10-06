import { ClientConfig } from "./config";
import { Stream } from "./init";
import { Request } from "../protobuf/clientchannel/request_pb";
import { Response } from "../protobuf/clientchannel/response_pb";

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
            if (
                data.hasInvalidateGdprNotAck() &&
                data.getInvalidateGdprNotAck()?.getTenantId() === tenantId &&
                data.getInvalidateGdprNotAck()?.getTopic() === topic &&
                data.getInvalidateGdprNotAck()?.getGdprId() === gdprId
            ) {
                clearTimeout(timeout);
                stream.off("data", fn);
                reject(
                    `did receive invalidate gdpr not ack message, reason: ${data
                        .getInvalidateGdprNotAck()
                        ?.getReason()}`
                );
                return;
            }

            if (
                data.hasInvalidateGdprAck() &&
                data.getInvalidateGdprAck()?.getTenantId() === tenantId &&
                data.getInvalidateGdprAck()?.getTopic() === topic &&
                data.getInvalidateGdprAck()?.getGdprId() === gdprId
            ) {
                clearTimeout(timeout);
                stream.off("data", fn);
                resolve();
                return;
            }
        };

        stream.on("data", fn);
    });
};

const newInvalidateGdprRequest = (tenantId: string, topic: string, gdprId: string): Request => {
    const action = new Request.InvalidateGdprAction();
    action.setTenantId(tenantId);
    action.setTopic(topic);
    action.setGdprId(gdprId);

    const request = new Request();
    request.setInvalidateGdpr(action);
    return request;
};
