// package: clientchannel
// file: clientchannel/get_stream.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";
import * as clientchannel_event_pb from "../clientchannel/event_pb";

export class GetStreamRequest extends jspb.Message { 
    getTenantId(): string;
    setTenantId(value: string): GetStreamRequest;
    getStream(): string;
    setStream(value: string): GetStreamRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetStreamRequest.AsObject;
    static toObject(includeInstance: boolean, msg: GetStreamRequest): GetStreamRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetStreamRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetStreamRequest;
    static deserializeBinaryFromReader(message: GetStreamRequest, reader: jspb.BinaryReader): GetStreamRequest;
}

export namespace GetStreamRequest {
    export type AsObject = {
        tenantId: string,
        stream: string,
    }
}

export class GetStreamResponse extends jspb.Message { 
    clearEventsList(): void;
    getEventsList(): Array<clientchannel_event_pb.PublishEventEnvelope>;
    setEventsList(value: Array<clientchannel_event_pb.PublishEventEnvelope>): GetStreamResponse;
    addEvents(value?: clientchannel_event_pb.PublishEventEnvelope, index?: number): clientchannel_event_pb.PublishEventEnvelope;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetStreamResponse.AsObject;
    static toObject(includeInstance: boolean, msg: GetStreamResponse): GetStreamResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetStreamResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetStreamResponse;
    static deserializeBinaryFromReader(message: GetStreamResponse, reader: jspb.BinaryReader): GetStreamResponse;
}

export namespace GetStreamResponse {
    export type AsObject = {
        eventsList: Array<clientchannel_event_pb.PublishEventEnvelope.AsObject>,
    }
}
