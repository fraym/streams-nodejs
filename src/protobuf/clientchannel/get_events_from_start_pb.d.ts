// package: clientchannel
// file: clientchannel/get_events_from_start.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";

export class GetEventsFromStartRequest extends jspb.Message {
    clearIncludedTopicsList(): void;
    getIncludedTopicsList(): Array<string>;
    setIncludedTopicsList(value: Array<string>): GetEventsFromStartRequest;
    addIncludedTopics(value: string, index?: number): string;
    clearExcludedTopicsList(): void;
    getExcludedTopicsList(): Array<string>;
    setExcludedTopicsList(value: Array<string>): GetEventsFromStartRequest;
    addExcludedTopics(value: string, index?: number): string;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetEventsFromStartRequest.AsObject;
    static toObject(
        includeInstance: boolean,
        msg: GetEventsFromStartRequest
    ): GetEventsFromStartRequest.AsObject;
    static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
    static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
    static serializeBinaryToWriter(
        message: GetEventsFromStartRequest,
        writer: jspb.BinaryWriter
    ): void;
    static deserializeBinary(bytes: Uint8Array): GetEventsFromStartRequest;
    static deserializeBinaryFromReader(
        message: GetEventsFromStartRequest,
        reader: jspb.BinaryReader
    ): GetEventsFromStartRequest;
}

export namespace GetEventsFromStartRequest {
    export type AsObject = {
        includedTopicsList: Array<string>;
        excludedTopicsList: Array<string>;
    };
}
