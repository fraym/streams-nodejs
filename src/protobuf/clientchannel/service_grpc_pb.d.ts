// package: clientchannel
// file: clientchannel/service.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import * as clientchannel_service_pb from "../clientchannel/service_pb";
import * as clientchannel_request_pb from "../clientchannel/request_pb";
import * as clientchannel_response_pb from "../clientchannel/response_pb";
import * as clientchannel_get_events_from_start_pb from "../clientchannel/get_events_from_start_pb";
import * as clientchannel_get_stream_pb from "../clientchannel/get_stream_pb";
import * as clientchannel_event_pb from "../clientchannel/event_pb";

interface IServiceService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    connect: IServiceService_IConnect;
    getEventsFromStart: IServiceService_IGetEventsFromStart;
    getStream: IServiceService_IGetStream;
}

interface IServiceService_IConnect
    extends grpc.MethodDefinition<
        clientchannel_request_pb.Request,
        clientchannel_response_pb.Response
    > {
    path: "/clientchannel.Service/Connect";
    requestStream: true;
    responseStream: true;
    requestSerialize: grpc.serialize<clientchannel_request_pb.Request>;
    requestDeserialize: grpc.deserialize<clientchannel_request_pb.Request>;
    responseSerialize: grpc.serialize<clientchannel_response_pb.Response>;
    responseDeserialize: grpc.deserialize<clientchannel_response_pb.Response>;
}
interface IServiceService_IGetEventsFromStart
    extends grpc.MethodDefinition<
        clientchannel_get_events_from_start_pb.GetEventsFromStartRequest,
        clientchannel_event_pb.PublishEventEnvelope
    > {
    path: "/clientchannel.Service/GetEventsFromStart";
    requestStream: false;
    responseStream: true;
    requestSerialize: grpc.serialize<clientchannel_get_events_from_start_pb.GetEventsFromStartRequest>;
    requestDeserialize: grpc.deserialize<clientchannel_get_events_from_start_pb.GetEventsFromStartRequest>;
    responseSerialize: grpc.serialize<clientchannel_event_pb.PublishEventEnvelope>;
    responseDeserialize: grpc.deserialize<clientchannel_event_pb.PublishEventEnvelope>;
}
interface IServiceService_IGetStream
    extends grpc.MethodDefinition<
        clientchannel_get_stream_pb.GetStreamRequest,
        clientchannel_get_stream_pb.GetStreamResponse
    > {
    path: "/clientchannel.Service/GetStream";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<clientchannel_get_stream_pb.GetStreamRequest>;
    requestDeserialize: grpc.deserialize<clientchannel_get_stream_pb.GetStreamRequest>;
    responseSerialize: grpc.serialize<clientchannel_get_stream_pb.GetStreamResponse>;
    responseDeserialize: grpc.deserialize<clientchannel_get_stream_pb.GetStreamResponse>;
}

export const ServiceService: IServiceService;

export interface IServiceServer extends grpc.UntypedServiceImplementation {
    connect: grpc.handleBidiStreamingCall<
        clientchannel_request_pb.Request,
        clientchannel_response_pb.Response
    >;
    getEventsFromStart: grpc.handleServerStreamingCall<
        clientchannel_get_events_from_start_pb.GetEventsFromStartRequest,
        clientchannel_event_pb.PublishEventEnvelope
    >;
    getStream: grpc.handleUnaryCall<
        clientchannel_get_stream_pb.GetStreamRequest,
        clientchannel_get_stream_pb.GetStreamResponse
    >;
}

export interface IServiceClient {
    connect(): grpc.ClientDuplexStream<
        clientchannel_request_pb.Request,
        clientchannel_response_pb.Response
    >;
    connect(
        options: Partial<grpc.CallOptions>
    ): grpc.ClientDuplexStream<
        clientchannel_request_pb.Request,
        clientchannel_response_pb.Response
    >;
    connect(
        metadata: grpc.Metadata,
        options?: Partial<grpc.CallOptions>
    ): grpc.ClientDuplexStream<
        clientchannel_request_pb.Request,
        clientchannel_response_pb.Response
    >;
    getEventsFromStart(
        request: clientchannel_get_events_from_start_pb.GetEventsFromStartRequest,
        options?: Partial<grpc.CallOptions>
    ): grpc.ClientReadableStream<clientchannel_event_pb.PublishEventEnvelope>;
    getEventsFromStart(
        request: clientchannel_get_events_from_start_pb.GetEventsFromStartRequest,
        metadata?: grpc.Metadata,
        options?: Partial<grpc.CallOptions>
    ): grpc.ClientReadableStream<clientchannel_event_pb.PublishEventEnvelope>;
    getStream(
        request: clientchannel_get_stream_pb.GetStreamRequest,
        callback: (
            error: grpc.ServiceError | null,
            response: clientchannel_get_stream_pb.GetStreamResponse
        ) => void
    ): grpc.ClientUnaryCall;
    getStream(
        request: clientchannel_get_stream_pb.GetStreamRequest,
        metadata: grpc.Metadata,
        callback: (
            error: grpc.ServiceError | null,
            response: clientchannel_get_stream_pb.GetStreamResponse
        ) => void
    ): grpc.ClientUnaryCall;
    getStream(
        request: clientchannel_get_stream_pb.GetStreamRequest,
        metadata: grpc.Metadata,
        options: Partial<grpc.CallOptions>,
        callback: (
            error: grpc.ServiceError | null,
            response: clientchannel_get_stream_pb.GetStreamResponse
        ) => void
    ): grpc.ClientUnaryCall;
}

export class ServiceClient extends grpc.Client implements IServiceClient {
    constructor(
        address: string,
        credentials: grpc.ChannelCredentials,
        options?: Partial<grpc.ClientOptions>
    );
    public connect(
        options?: Partial<grpc.CallOptions>
    ): grpc.ClientDuplexStream<
        clientchannel_request_pb.Request,
        clientchannel_response_pb.Response
    >;
    public connect(
        metadata?: grpc.Metadata,
        options?: Partial<grpc.CallOptions>
    ): grpc.ClientDuplexStream<
        clientchannel_request_pb.Request,
        clientchannel_response_pb.Response
    >;
    public getEventsFromStart(
        request: clientchannel_get_events_from_start_pb.GetEventsFromStartRequest,
        options?: Partial<grpc.CallOptions>
    ): grpc.ClientReadableStream<clientchannel_event_pb.PublishEventEnvelope>;
    public getEventsFromStart(
        request: clientchannel_get_events_from_start_pb.GetEventsFromStartRequest,
        metadata?: grpc.Metadata,
        options?: Partial<grpc.CallOptions>
    ): grpc.ClientReadableStream<clientchannel_event_pb.PublishEventEnvelope>;
    public getStream(
        request: clientchannel_get_stream_pb.GetStreamRequest,
        callback: (
            error: grpc.ServiceError | null,
            response: clientchannel_get_stream_pb.GetStreamResponse
        ) => void
    ): grpc.ClientUnaryCall;
    public getStream(
        request: clientchannel_get_stream_pb.GetStreamRequest,
        metadata: grpc.Metadata,
        callback: (
            error: grpc.ServiceError | null,
            response: clientchannel_get_stream_pb.GetStreamResponse
        ) => void
    ): grpc.ClientUnaryCall;
    public getStream(
        request: clientchannel_get_stream_pb.GetStreamRequest,
        metadata: grpc.Metadata,
        options: Partial<grpc.CallOptions>,
        callback: (
            error: grpc.ServiceError | null,
            response: clientchannel_get_stream_pb.GetStreamResponse
        ) => void
    ): grpc.ClientUnaryCall;
}
