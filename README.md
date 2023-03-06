# streams-nodejs

Client implementation in javascript for the event streaming service [streams](https://github.com/fraym/streams).

## Installation

```shell
npm i @fraym/streams
```

## Usage

### Create the client

```typescript
const client = await newClient({
    serverAddress: "127.0.0.1:9000",
    groupId: "your-services-group-identifier",
});
```

### Publish events

Events are published in a transactional manner:

-   you can publish a set of events in a transaction
-   if one event in your set cannot be published no event will be published
-   as soon as all events are published they appear in their streams

You can only publish events of one topic per transaction.
Most of the fields of an event are optional. You do not have to use or specify them, but you can use them if you want to.

```typescript
await client.publish("topic", [
    {
        id: uuid(),
        tenantId: "tenantId",
        payload: {
            key: "value",
			object: {
				key: "objectKeyValue"
			},
        },
        // set `broadcast` to true if you want all subscribers of a group to process the event.
        // set to false (or remove) if you want this event to be handled only once by a group of subscribers.
        broadcast: false,
        type: "event-type",
        stream: "stream-name",
        correlationId: uuid(),
        causationId: uuid(),
        reason: "the reason why this event was triggered",
    },
]);
```

### Get events of a stream

If you want to get all events that belong to a given stream you can do this by calling `getStream``:

```typescript
const streamEvents = await client.getStream("tenantId", "stream");
```

### Register event handlers for event subscriptions

```typescript
// this handler is called for events of all types
client.useEventHandlerForAllEventTypes(async (event: SubscriptionEvent) => {
    // @todo: handle the event in this callback
});

// this handler is only called for events of the given type "event-type"
client.useEventHandler("event-type", async (event: SubscriptionEvent) => {
    // @todo: handle the event in this callback
});
```

### Subscribe to events

You can subscribe to events of all topics by not providing any parameters to the subscribe function:

```typescript
await client.subscribe();
```

You can subscribe to events of a given set of topics by specifying the `includedTopics` list:

```typescript
await client.subscribe(["topic-1", "topic-2"]);
```

You can subscribe to all events except of a given set of topics by specifying the `excludedTopics` list:

```typescript
await client.subscribe([], ["topic-1", "topic-2"]);
```

One client instance is only able to subscribe once. If you try to subscribe twice you will get an error.

### Get all events for a given topic filter

The `getAllEvents` function uses the same topic filter parameters as described for the [subscribe](#subscribe-to-events) function

```typescript
await client.getAllEvents(async (event: SubscriptionEvent) => {
    // @todo: handle the event in this callback
});
```

### Invalidate gdpr data

You will not need to use this if you use our GDPR service.

```typescript
await client.invalidateGdprData("tenantId", "topic-1", "grprId");
```

### Create a snapshot of a topic

A snapshot moves events from the "fast access" database to a "long time storage".
The long time storage will have slower access time.
Use this if you have topics that have a lot of old events which are not queried regularly.

Creating a snapshot will only affect performance. You will not l lose any of your events.

Snapshots can be used to clean up your "fast access" event database and therefore increase performance on new events.

```typescript
await client.createSnapshot("topic-1", new Date());
```

The second parameter is a date. All events that are older than that date will be moved to the snapshot.

### Gracefully close the client

You won't lose any data if you don't. Use it for your peace of mind.

```typescript
client.close();
```
