// package: clientchannel
// file: clientchannel/response.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";
import * as clientchannel_event_pb from "../clientchannel/event_pb";

export class Response extends jspb.Message { 

    hasEvent(): boolean;
    clearEvent(): void;
    getEvent(): clientchannel_event_pb.PublishEventEnvelope | undefined;
    setEvent(value?: clientchannel_event_pb.PublishEventEnvelope): Response;

    hasInitAck(): boolean;
    clearInitAck(): void;
    getInitAck(): Response.InitAck | undefined;
    setInitAck(value?: Response.InitAck): Response;

    hasInitNotAck(): boolean;
    clearInitNotAck(): void;
    getInitNotAck(): Response.InitNotAck | undefined;
    setInitNotAck(value?: Response.InitNotAck): Response;

    hasPublishAck(): boolean;
    clearPublishAck(): void;
    getPublishAck(): Response.PublishAck | undefined;
    setPublishAck(value?: Response.PublishAck): Response;

    hasPublishNotAck(): boolean;
    clearPublishNotAck(): void;
    getPublishNotAck(): Response.PublishNotAck | undefined;
    setPublishNotAck(value?: Response.PublishNotAck): Response;

    hasSubscribeAck(): boolean;
    clearSubscribeAck(): void;
    getSubscribeAck(): Response.SubscribeAck | undefined;
    setSubscribeAck(value?: Response.SubscribeAck): Response;

    hasSubscribeNotAck(): boolean;
    clearSubscribeNotAck(): void;
    getSubscribeNotAck(): Response.SubscribeNotAck | undefined;
    setSubscribeNotAck(value?: Response.SubscribeNotAck): Response;

    hasSnapshotAck(): boolean;
    clearSnapshotAck(): void;
    getSnapshotAck(): Response.SnapshotAck | undefined;
    setSnapshotAck(value?: Response.SnapshotAck): Response;

    hasSnapshotNotAck(): boolean;
    clearSnapshotNotAck(): void;
    getSnapshotNotAck(): Response.SnapshotNotAck | undefined;
    setSnapshotNotAck(value?: Response.SnapshotNotAck): Response;

    hasInvalidateGdprAck(): boolean;
    clearInvalidateGdprAck(): void;
    getInvalidateGdprAck(): Response.InvalidateGdprAck | undefined;
    setInvalidateGdprAck(value?: Response.InvalidateGdprAck): Response;

    hasInvalidateGdprNotAck(): boolean;
    clearInvalidateGdprNotAck(): void;
    getInvalidateGdprNotAck(): Response.InvalidateGdprNotAck | undefined;
    setInvalidateGdprNotAck(value?: Response.InvalidateGdprNotAck): Response;

    getDataCase(): Response.DataCase;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Response.AsObject;
    static toObject(includeInstance: boolean, msg: Response): Response.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Response, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Response;
    static deserializeBinaryFromReader(message: Response, reader: jspb.BinaryReader): Response;
}

export namespace Response {
    export type AsObject = {
        event?: clientchannel_event_pb.PublishEventEnvelope.AsObject,
        initAck?: Response.InitAck.AsObject,
        initNotAck?: Response.InitNotAck.AsObject,
        publishAck?: Response.PublishAck.AsObject,
        publishNotAck?: Response.PublishNotAck.AsObject,
        subscribeAck?: Response.SubscribeAck.AsObject,
        subscribeNotAck?: Response.SubscribeNotAck.AsObject,
        snapshotAck?: Response.SnapshotAck.AsObject,
        snapshotNotAck?: Response.SnapshotNotAck.AsObject,
        invalidateGdprAck?: Response.InvalidateGdprAck.AsObject,
        invalidateGdprNotAck?: Response.InvalidateGdprNotAck.AsObject,
    }


    export class InitAck extends jspb.Message { 

        serializeBinary(): Uint8Array;
        toObject(includeInstance?: boolean): InitAck.AsObject;
        static toObject(includeInstance: boolean, msg: InitAck): InitAck.AsObject;
        static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
        static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
        static serializeBinaryToWriter(message: InitAck, writer: jspb.BinaryWriter): void;
        static deserializeBinary(bytes: Uint8Array): InitAck;
        static deserializeBinaryFromReader(message: InitAck, reader: jspb.BinaryReader): InitAck;
    }

    export namespace InitAck {
        export type AsObject = {
        }
    }

    export class InitNotAck extends jspb.Message { 
        getReason(): string;
        setReason(value: string): InitNotAck;

        serializeBinary(): Uint8Array;
        toObject(includeInstance?: boolean): InitNotAck.AsObject;
        static toObject(includeInstance: boolean, msg: InitNotAck): InitNotAck.AsObject;
        static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
        static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
        static serializeBinaryToWriter(message: InitNotAck, writer: jspb.BinaryWriter): void;
        static deserializeBinary(bytes: Uint8Array): InitNotAck;
        static deserializeBinaryFromReader(message: InitNotAck, reader: jspb.BinaryReader): InitNotAck;
    }

    export namespace InitNotAck {
        export type AsObject = {
            reason: string,
        }
    }

    export class PublishAck extends jspb.Message { 
        getPublishActionId(): string;
        setPublishActionId(value: string): PublishAck;

        serializeBinary(): Uint8Array;
        toObject(includeInstance?: boolean): PublishAck.AsObject;
        static toObject(includeInstance: boolean, msg: PublishAck): PublishAck.AsObject;
        static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
        static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
        static serializeBinaryToWriter(message: PublishAck, writer: jspb.BinaryWriter): void;
        static deserializeBinary(bytes: Uint8Array): PublishAck;
        static deserializeBinaryFromReader(message: PublishAck, reader: jspb.BinaryReader): PublishAck;
    }

    export namespace PublishAck {
        export type AsObject = {
            publishActionId: string,
        }
    }

    export class PublishNotAck extends jspb.Message { 
        getPublishActionId(): string;
        setPublishActionId(value: string): PublishNotAck;
        getReason(): string;
        setReason(value: string): PublishNotAck;

        serializeBinary(): Uint8Array;
        toObject(includeInstance?: boolean): PublishNotAck.AsObject;
        static toObject(includeInstance: boolean, msg: PublishNotAck): PublishNotAck.AsObject;
        static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
        static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
        static serializeBinaryToWriter(message: PublishNotAck, writer: jspb.BinaryWriter): void;
        static deserializeBinary(bytes: Uint8Array): PublishNotAck;
        static deserializeBinaryFromReader(message: PublishNotAck, reader: jspb.BinaryReader): PublishNotAck;
    }

    export namespace PublishNotAck {
        export type AsObject = {
            publishActionId: string,
            reason: string,
        }
    }

    export class SubscribeAck extends jspb.Message { 

        serializeBinary(): Uint8Array;
        toObject(includeInstance?: boolean): SubscribeAck.AsObject;
        static toObject(includeInstance: boolean, msg: SubscribeAck): SubscribeAck.AsObject;
        static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
        static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
        static serializeBinaryToWriter(message: SubscribeAck, writer: jspb.BinaryWriter): void;
        static deserializeBinary(bytes: Uint8Array): SubscribeAck;
        static deserializeBinaryFromReader(message: SubscribeAck, reader: jspb.BinaryReader): SubscribeAck;
    }

    export namespace SubscribeAck {
        export type AsObject = {
        }
    }

    export class SubscribeNotAck extends jspb.Message { 
        getReason(): string;
        setReason(value: string): SubscribeNotAck;

        serializeBinary(): Uint8Array;
        toObject(includeInstance?: boolean): SubscribeNotAck.AsObject;
        static toObject(includeInstance: boolean, msg: SubscribeNotAck): SubscribeNotAck.AsObject;
        static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
        static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
        static serializeBinaryToWriter(message: SubscribeNotAck, writer: jspb.BinaryWriter): void;
        static deserializeBinary(bytes: Uint8Array): SubscribeNotAck;
        static deserializeBinaryFromReader(message: SubscribeNotAck, reader: jspb.BinaryReader): SubscribeNotAck;
    }

    export namespace SubscribeNotAck {
        export type AsObject = {
            reason: string,
        }
    }

    export class SnapshotAck extends jspb.Message { 
        getTopic(): string;
        setTopic(value: string): SnapshotAck;
        getSnapshotId(): string;
        setSnapshotId(value: string): SnapshotAck;
        getFromTime(): string;
        setFromTime(value: string): SnapshotAck;
        getToTime(): string;
        setToTime(value: string): SnapshotAck;

        serializeBinary(): Uint8Array;
        toObject(includeInstance?: boolean): SnapshotAck.AsObject;
        static toObject(includeInstance: boolean, msg: SnapshotAck): SnapshotAck.AsObject;
        static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
        static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
        static serializeBinaryToWriter(message: SnapshotAck, writer: jspb.BinaryWriter): void;
        static deserializeBinary(bytes: Uint8Array): SnapshotAck;
        static deserializeBinaryFromReader(message: SnapshotAck, reader: jspb.BinaryReader): SnapshotAck;
    }

    export namespace SnapshotAck {
        export type AsObject = {
            topic: string,
            snapshotId: string,
            fromTime: string,
            toTime: string,
        }
    }

    export class SnapshotNotAck extends jspb.Message { 
        getTopic(): string;
        setTopic(value: string): SnapshotNotAck;
        getReason(): string;
        setReason(value: string): SnapshotNotAck;

        serializeBinary(): Uint8Array;
        toObject(includeInstance?: boolean): SnapshotNotAck.AsObject;
        static toObject(includeInstance: boolean, msg: SnapshotNotAck): SnapshotNotAck.AsObject;
        static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
        static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
        static serializeBinaryToWriter(message: SnapshotNotAck, writer: jspb.BinaryWriter): void;
        static deserializeBinary(bytes: Uint8Array): SnapshotNotAck;
        static deserializeBinaryFromReader(message: SnapshotNotAck, reader: jspb.BinaryReader): SnapshotNotAck;
    }

    export namespace SnapshotNotAck {
        export type AsObject = {
            topic: string,
            reason: string,
        }
    }

    export class InvalidateGdprAck extends jspb.Message { 
        getTenantId(): string;
        setTenantId(value: string): InvalidateGdprAck;
        getTopic(): string;
        setTopic(value: string): InvalidateGdprAck;
        getGdprId(): string;
        setGdprId(value: string): InvalidateGdprAck;

        serializeBinary(): Uint8Array;
        toObject(includeInstance?: boolean): InvalidateGdprAck.AsObject;
        static toObject(includeInstance: boolean, msg: InvalidateGdprAck): InvalidateGdprAck.AsObject;
        static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
        static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
        static serializeBinaryToWriter(message: InvalidateGdprAck, writer: jspb.BinaryWriter): void;
        static deserializeBinary(bytes: Uint8Array): InvalidateGdprAck;
        static deserializeBinaryFromReader(message: InvalidateGdprAck, reader: jspb.BinaryReader): InvalidateGdprAck;
    }

    export namespace InvalidateGdprAck {
        export type AsObject = {
            tenantId: string,
            topic: string,
            gdprId: string,
        }
    }

    export class InvalidateGdprNotAck extends jspb.Message { 
        getTenantId(): string;
        setTenantId(value: string): InvalidateGdprNotAck;
        getTopic(): string;
        setTopic(value: string): InvalidateGdprNotAck;
        getGdprId(): string;
        setGdprId(value: string): InvalidateGdprNotAck;
        getReason(): string;
        setReason(value: string): InvalidateGdprNotAck;

        serializeBinary(): Uint8Array;
        toObject(includeInstance?: boolean): InvalidateGdprNotAck.AsObject;
        static toObject(includeInstance: boolean, msg: InvalidateGdprNotAck): InvalidateGdprNotAck.AsObject;
        static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
        static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
        static serializeBinaryToWriter(message: InvalidateGdprNotAck, writer: jspb.BinaryWriter): void;
        static deserializeBinary(bytes: Uint8Array): InvalidateGdprNotAck;
        static deserializeBinaryFromReader(message: InvalidateGdprNotAck, reader: jspb.BinaryReader): InvalidateGdprNotAck;
    }

    export namespace InvalidateGdprNotAck {
        export type AsObject = {
            tenantId: string,
            topic: string,
            gdprId: string,
            reason: string,
        }
    }


    export enum DataCase {
        DATA_NOT_SET = 0,
        EVENT = 1,
        INIT_ACK = 2,
        INIT_NOT_ACK = 3,
        PUBLISH_ACK = 4,
        PUBLISH_NOT_ACK = 5,
        SUBSCRIBE_ACK = 6,
        SUBSCRIBE_NOT_ACK = 7,
        SNAPSHOT_ACK = 8,
        SNAPSHOT_NOT_ACK = 9,
        INVALIDATE_GDPR_ACK = 10,
        INVALIDATE_GDPR_NOT_ACK = 11,
    }

}
