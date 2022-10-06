// package:
// file: clientchannel/event.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";

export class PublishEventEnvelope extends jspb.Message {
    getTenantId(): string;
    setTenantId(value: string): PublishEventEnvelope;
    getTopic(): string;
    setTopic(value: string): PublishEventEnvelope;

    hasEvent(): boolean;
    clearEvent(): void;
    getEvent(): Event | undefined;
    setEvent(value?: Event): PublishEventEnvelope;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): PublishEventEnvelope.AsObject;
    static toObject(
        includeInstance: boolean,
        msg: PublishEventEnvelope
    ): PublishEventEnvelope.AsObject;
    static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
    static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
    static serializeBinaryToWriter(message: PublishEventEnvelope, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): PublishEventEnvelope;
    static deserializeBinaryFromReader(
        message: PublishEventEnvelope,
        reader: jspb.BinaryReader
    ): PublishEventEnvelope;
}

export namespace PublishEventEnvelope {
    export type AsObject = {
        tenantId: string;
        topic: string;
        event?: Event.AsObject;
    };
}

export class EventEnvelope extends jspb.Message {
    getTenantId(): string;
    setTenantId(value: string): EventEnvelope;
    getBroadcast(): boolean;
    setBroadcast(value: boolean): EventEnvelope;

    hasEvent(): boolean;
    clearEvent(): void;
    getEvent(): Event | undefined;
    setEvent(value?: Event): EventEnvelope;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): EventEnvelope.AsObject;
    static toObject(includeInstance: boolean, msg: EventEnvelope): EventEnvelope.AsObject;
    static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
    static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
    static serializeBinaryToWriter(message: EventEnvelope, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): EventEnvelope;
    static deserializeBinaryFromReader(
        message: EventEnvelope,
        reader: jspb.BinaryReader
    ): EventEnvelope;
}

export namespace EventEnvelope {
    export type AsObject = {
        tenantId: string;
        broadcast: boolean;
        event?: Event.AsObject;
    };
}

export class Event extends jspb.Message {
    getId(): string;
    setId(value: string): Event;
    getType(): string;
    setType(value: string): Event;
    getStream(): string;
    setStream(value: string): Event;
    getCorrelationId(): string;
    setCorrelationId(value: string): Event;
    getCausationId(): string;
    setCausationId(value: string): Event;
    getRaisedAt(): string;
    setRaisedAt(value: string): Event;

    getPayloadMap(): jspb.Map<string, Data>;
    clearPayloadMap(): void;
    getReason(): string;
    setReason(value: string): Event;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Event.AsObject;
    static toObject(includeInstance: boolean, msg: Event): Event.AsObject;
    static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
    static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
    static serializeBinaryToWriter(message: Event, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Event;
    static deserializeBinaryFromReader(message: Event, reader: jspb.BinaryReader): Event;
}

export namespace Event {
    export type AsObject = {
        id: string;
        type: string;
        stream: string;
        correlationId: string;
        causationId: string;
        raisedAt: string;

        payloadMap: Array<[string, Data.AsObject]>;
        reason: string;
    };
}

export class Data extends jspb.Message {
    hasGdpr(): boolean;
    clearGdpr(): void;
    getGdpr(): Data.GdprMetadata | undefined;
    setGdpr(value?: Data.GdprMetadata): Data;
    getValue(): string;
    setValue(value: string): Data;

    getMetadataCase(): Data.MetadataCase;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Data.AsObject;
    static toObject(includeInstance: boolean, msg: Data): Data.AsObject;
    static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
    static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
    static serializeBinaryToWriter(message: Data, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Data;
    static deserializeBinaryFromReader(message: Data, reader: jspb.BinaryReader): Data;
}

export namespace Data {
    export type AsObject = {
        gdpr?: Data.GdprMetadata.AsObject;
        value: string;
    };

    export class GdprMetadata extends jspb.Message {
        getDefault(): string;
        setDefault(value: string): GdprMetadata;

        serializeBinary(): Uint8Array;
        toObject(includeInstance?: boolean): GdprMetadata.AsObject;
        static toObject(includeInstance: boolean, msg: GdprMetadata): GdprMetadata.AsObject;
        static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
        static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
        static serializeBinaryToWriter(message: GdprMetadata, writer: jspb.BinaryWriter): void;
        static deserializeBinary(bytes: Uint8Array): GdprMetadata;
        static deserializeBinaryFromReader(
            message: GdprMetadata,
            reader: jspb.BinaryReader
        ): GdprMetadata;
    }

    export namespace GdprMetadata {
        export type AsObject = {
            pb_default: string;
        };
    }

    export enum MetadataCase {
        METADATA_NOT_SET = 0,
        GDPR = 4,
    }
}
