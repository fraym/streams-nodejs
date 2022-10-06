export interface ClientConfig {
    // serverAddress: address of the streams service
    serverAddress: string;
    // groupId: your services group identifier
    groupId: string;
    // ackTimeout: timeout in milliseconds
    ackTimeout?: number;
    // keepaliveInterval: grpc connection keepalive ping interval in milliseconds
    keepaliveInterval?: number;
    // keepaliveTimeout: grpc connection keepalive ping timeout in milliseconds
    keepaliveTimeout?: number;
}

export const useConfigDefaults = (config: ClientConfig): Required<ClientConfig> => {
    return {
        serverAddress: config.serverAddress,
        groupId: config.groupId,
        ackTimeout: config.ackTimeout ?? 1000,
        keepaliveTimeout: config.keepaliveTimeout ?? 3 * 1000,
        keepaliveInterval: config.keepaliveInterval ?? 40 * 1000,
    };
};
