// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var clientchannel_request_pb = require('../clientchannel/request_pb.js');
var clientchannel_response_pb = require('../clientchannel/response_pb.js');
var clientchannel_get_events_from_start_pb = require('../clientchannel/get_events_from_start_pb.js');
var clientchannel_get_stream_pb = require('../clientchannel/get_stream_pb.js');
var clientchannel_event_pb = require('../clientchannel/event_pb.js');

function serialize_PublishEventEnvelope(arg) {
  if (!(arg instanceof clientchannel_event_pb.PublishEventEnvelope)) {
    throw new Error('Expected argument of type PublishEventEnvelope');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_PublishEventEnvelope(buffer_arg) {
  return clientchannel_event_pb.PublishEventEnvelope.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_clientchannel_GetEventsFromStartRequest(arg) {
  if (!(arg instanceof clientchannel_get_events_from_start_pb.GetEventsFromStartRequest)) {
    throw new Error('Expected argument of type clientchannel.GetEventsFromStartRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_clientchannel_GetEventsFromStartRequest(buffer_arg) {
  return clientchannel_get_events_from_start_pb.GetEventsFromStartRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_clientchannel_GetStreamRequest(arg) {
  if (!(arg instanceof clientchannel_get_stream_pb.GetStreamRequest)) {
    throw new Error('Expected argument of type clientchannel.GetStreamRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_clientchannel_GetStreamRequest(buffer_arg) {
  return clientchannel_get_stream_pb.GetStreamRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_clientchannel_GetStreamResponse(arg) {
  if (!(arg instanceof clientchannel_get_stream_pb.GetStreamResponse)) {
    throw new Error('Expected argument of type clientchannel.GetStreamResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_clientchannel_GetStreamResponse(buffer_arg) {
  return clientchannel_get_stream_pb.GetStreamResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_clientchannel_Request(arg) {
  if (!(arg instanceof clientchannel_request_pb.Request)) {
    throw new Error('Expected argument of type clientchannel.Request');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_clientchannel_Request(buffer_arg) {
  return clientchannel_request_pb.Request.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_clientchannel_Response(arg) {
  if (!(arg instanceof clientchannel_response_pb.Response)) {
    throw new Error('Expected argument of type clientchannel.Response');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_clientchannel_Response(buffer_arg) {
  return clientchannel_response_pb.Response.deserializeBinary(new Uint8Array(buffer_arg));
}


var ServiceService = exports.ServiceService = {
  connect: {
    path: '/clientchannel.Service/Connect',
    requestStream: true,
    responseStream: true,
    requestType: clientchannel_request_pb.Request,
    responseType: clientchannel_response_pb.Response,
    requestSerialize: serialize_clientchannel_Request,
    requestDeserialize: deserialize_clientchannel_Request,
    responseSerialize: serialize_clientchannel_Response,
    responseDeserialize: deserialize_clientchannel_Response,
  },
  getEventsFromStart: {
    path: '/clientchannel.Service/GetEventsFromStart',
    requestStream: false,
    responseStream: true,
    requestType: clientchannel_get_events_from_start_pb.GetEventsFromStartRequest,
    responseType: clientchannel_event_pb.PublishEventEnvelope,
    requestSerialize: serialize_clientchannel_GetEventsFromStartRequest,
    requestDeserialize: deserialize_clientchannel_GetEventsFromStartRequest,
    responseSerialize: serialize_PublishEventEnvelope,
    responseDeserialize: deserialize_PublishEventEnvelope,
  },
  getStream: {
    path: '/clientchannel.Service/GetStream',
    requestStream: false,
    responseStream: false,
    requestType: clientchannel_get_stream_pb.GetStreamRequest,
    responseType: clientchannel_get_stream_pb.GetStreamResponse,
    requestSerialize: serialize_clientchannel_GetStreamRequest,
    requestDeserialize: deserialize_clientchannel_GetStreamRequest,
    responseSerialize: serialize_clientchannel_GetStreamResponse,
    responseDeserialize: deserialize_clientchannel_GetStreamResponse,
  },
};

exports.ServiceClient = grpc.makeGenericClientConstructor(ServiceService);
