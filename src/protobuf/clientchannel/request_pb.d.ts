// package: clientchannel
// file: clientchannel/request.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";
import * as clientchannel_event_pb from "../clientchannel/event_pb";

export class Request extends jspb.Message { 

    hasInit(): boolean;
    clearInit(): void;
    getInit(): Request.InitAction | undefined;
    setInit(value?: Request.InitAction): Request;

    hasPublish(): boolean;
    clearPublish(): void;
    getPublish(): Request.PublishAction | undefined;
    setPublish(value?: Request.PublishAction): Request;

    hasSubscribe(): boolean;
    clearSubscribe(): void;
    getSubscribe(): Request.SubscribeAction | undefined;
    setSubscribe(value?: Request.SubscribeAction): Request;

    hasInvalidateGdpr(): boolean;
    clearInvalidateGdpr(): void;
    getInvalidateGdpr(): Request.InvalidateGdprAction | undefined;
    setInvalidateGdpr(value?: Request.InvalidateGdprAction): Request;

    hasSnapshot(): boolean;
    clearSnapshot(): void;
    getSnapshot(): Request.SnapshotAction | undefined;
    setSnapshot(value?: Request.SnapshotAction): Request;

    hasEventAck(): boolean;
    clearEventAck(): void;
    getEventAck(): Request.EventAck | undefined;
    setEventAck(value?: Request.EventAck): Request;

    hasEventNotAck(): boolean;
    clearEventNotAck(): void;
    getEventNotAck(): Request.EventNotAck | undefined;
    setEventNotAck(value?: Request.EventNotAck): Request;

    getPayloadCase(): Request.PayloadCase;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Request.AsObject;
    static toObject(includeInstance: boolean, msg: Request): Request.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Request, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Request;
    static deserializeBinaryFromReader(message: Request, reader: jspb.BinaryReader): Request;
}

export namespace Request {
    export type AsObject = {
        init?: Request.InitAction.AsObject,
        publish?: Request.PublishAction.AsObject,
        subscribe?: Request.SubscribeAction.AsObject,
        invalidateGdpr?: Request.InvalidateGdprAction.AsObject,
        snapshot?: Request.SnapshotAction.AsObject,
        eventAck?: Request.EventAck.AsObject,
        eventNotAck?: Request.EventNotAck.AsObject,
    }


    export class InitAction extends jspb.Message { 
        getGroupId(): string;
        setGroupId(value: string): InitAction;
        getSubscriberId(): string;
        setSubscriberId(value: string): InitAction;

        serializeBinary(): Uint8Array;
        toObject(includeInstance?: boolean): InitAction.AsObject;
        static toObject(includeInstance: boolean, msg: InitAction): InitAction.AsObject;
        static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
        static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
        static serializeBinaryToWriter(message: InitAction, writer: jspb.BinaryWriter): void;
        static deserializeBinary(bytes: Uint8Array): InitAction;
        static deserializeBinaryFromReader(message: InitAction, reader: jspb.BinaryReader): InitAction;
    }

    export namespace InitAction {
        export type AsObject = {
            groupId: string,
            subscriberId: string,
        }
    }

    export class PublishAction extends jspb.Message { 
        getTopic(): string;
        setTopic(value: string): PublishAction;
        getPublishActionId(): string;
        setPublishActionId(value: string): PublishAction;
        clearEventsList(): void;
        getEventsList(): Array<clientchannel_event_pb.EventEnvelope>;
        setEventsList(value: Array<clientchannel_event_pb.EventEnvelope>): PublishAction;
        addEvents(value?: clientchannel_event_pb.EventEnvelope, index?: number): clientchannel_event_pb.EventEnvelope;

        serializeBinary(): Uint8Array;
        toObject(includeInstance?: boolean): PublishAction.AsObject;
        static toObject(includeInstance: boolean, msg: PublishAction): PublishAction.AsObject;
        static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
        static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
        static serializeBinaryToWriter(message: PublishAction, writer: jspb.BinaryWriter): void;
        static deserializeBinary(bytes: Uint8Array): PublishAction;
        static deserializeBinaryFromReader(message: PublishAction, reader: jspb.BinaryReader): PublishAction;
    }

    export namespace PublishAction {
        export type AsObject = {
            topic: string,
            publishActionId: string,
            eventsList: Array<clientchannel_event_pb.EventEnvelope.AsObject>,
        }
    }

    export class SubscribeAction extends jspb.Message { 
        clearIncludedTopicsList(): void;
        getIncludedTopicsList(): Array<string>;
        setIncludedTopicsList(value: Array<string>): SubscribeAction;
        addIncludedTopics(value: string, index?: number): string;
        clearExcludedTopicsList(): void;
        getExcludedTopicsList(): Array<string>;
        setExcludedTopicsList(value: Array<string>): SubscribeAction;
        addExcludedTopics(value: string, index?: number): string;

        serializeBinary(): Uint8Array;
        toObject(includeInstance?: boolean): SubscribeAction.AsObject;
        static toObject(includeInstance: boolean, msg: SubscribeAction): SubscribeAction.AsObject;
        static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
        static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
        static serializeBinaryToWriter(message: SubscribeAction, writer: jspb.BinaryWriter): void;
        static deserializeBinary(bytes: Uint8Array): SubscribeAction;
        static deserializeBinaryFromReader(message: SubscribeAction, reader: jspb.BinaryReader): SubscribeAction;
    }

    export namespace SubscribeAction {
        export type AsObject = {
            includedTopicsList: Array<string>,
            excludedTopicsList: Array<string>,
        }
    }

    export class SnapshotAction extends jspb.Message { 
        getTopic(): string;
        setTopic(value: string): SnapshotAction;
        getToTime(): string;
        setToTime(value: string): SnapshotAction;

        serializeBinary(): Uint8Array;
        toObject(includeInstance?: boolean): SnapshotAction.AsObject;
        static toObject(includeInstance: boolean, msg: SnapshotAction): SnapshotAction.AsObject;
        static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
        static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
        static serializeBinaryToWriter(message: SnapshotAction, writer: jspb.BinaryWriter): void;
        static deserializeBinary(bytes: Uint8Array): SnapshotAction;
        static deserializeBinaryFromReader(message: SnapshotAction, reader: jspb.BinaryReader): SnapshotAction;
    }

    export namespace SnapshotAction {
        export type AsObject = {
            topic: string,
            toTime: string,
        }
    }

    export class InvalidateGdprAction extends jspb.Message { 
        getTenantId(): string;
        setTenantId(value: string): InvalidateGdprAction;
        getTopic(): string;
        setTopic(value: string): InvalidateGdprAction;
        getGdprId(): string;
        setGdprId(value: string): InvalidateGdprAction;

        serializeBinary(): Uint8Array;
        toObject(includeInstance?: boolean): InvalidateGdprAction.AsObject;
        static toObject(includeInstance: boolean, msg: InvalidateGdprAction): InvalidateGdprAction.AsObject;
        static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
        static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
        static serializeBinaryToWriter(message: InvalidateGdprAction, writer: jspb.BinaryWriter): void;
        static deserializeBinary(bytes: Uint8Array): InvalidateGdprAction;
        static deserializeBinaryFromReader(message: InvalidateGdprAction, reader: jspb.BinaryReader): InvalidateGdprAction;
    }

    export namespace InvalidateGdprAction {
        export type AsObject = {
            tenantId: string,
            topic: string,
            gdprId: string,
        }
    }

    export class EventAck extends jspb.Message { 
        getTenantId(): string;
        setTenantId(value: string): EventAck;
        getTopic(): string;
        setTopic(value: string): EventAck;
        getEventId(): string;
        setEventId(value: string): EventAck;

        serializeBinary(): Uint8Array;
        toObject(includeInstance?: boolean): EventAck.AsObject;
        static toObject(includeInstance: boolean, msg: EventAck): EventAck.AsObject;
        static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
        static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
        static serializeBinaryToWriter(message: EventAck, writer: jspb.BinaryWriter): void;
        static deserializeBinary(bytes: Uint8Array): EventAck;
        static deserializeBinaryFromReader(message: EventAck, reader: jspb.BinaryReader): EventAck;
    }

    export namespace EventAck {
        export type AsObject = {
            tenantId: string,
            topic: string,
            eventId: string,
        }
    }

    export class EventNotAck extends jspb.Message { 
        getTenantId(): string;
        setTenantId(value: string): EventNotAck;
        getTopic(): string;
        setTopic(value: string): EventNotAck;
        getEventId(): string;
        setEventId(value: string): EventNotAck;
        getReason(): string;
        setReason(value: string): EventNotAck;

        serializeBinary(): Uint8Array;
        toObject(includeInstance?: boolean): EventNotAck.AsObject;
        static toObject(includeInstance: boolean, msg: EventNotAck): EventNotAck.AsObject;
        static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
        static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
        static serializeBinaryToWriter(message: EventNotAck, writer: jspb.BinaryWriter): void;
        static deserializeBinary(bytes: Uint8Array): EventNotAck;
        static deserializeBinaryFromReader(message: EventNotAck, reader: jspb.BinaryReader): EventNotAck;
    }

    export namespace EventNotAck {
        export type AsObject = {
            tenantId: string,
            topic: string,
            eventId: string,
            reason: string,
        }
    }


    export enum PayloadCase {
        PAYLOAD_NOT_SET = 0,
        INIT = 1,
        PUBLISH = 2,
        SUBSCRIBE = 3,
        INVALIDATE_GDPR = 5,
        SNAPSHOT = 6,
        EVENT_ACK = 7,
        EVENT_NOT_ACK = 8,
    }

}
