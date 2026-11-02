# Sprint 11 — Kafka Event-Driven Architecture

## 1. Sprint Overview

**Sprint:** 11
**Feature:** Kafka Event-Driven Architecture
**Status:** Completed
**Release:** `v0.11.0`

### Objective

Introduce Apache Kafka into ShopSphere to understand and implement event-driven architecture.

The primary use case is:

> When an order is successfully created, ShopSphere publishes an `order.created` event. Independent downstream consumers react to that event asynchronously.

This allows the Order API to remain decoupled from downstream operations such as notifications and inventory processing.

---

# 2. Business Requirement

When a customer successfully creates an order:

1. The order must be persisted in PostgreSQL.
2. ShopSphere must publish an `order.created` event.
3. Notification processing should react independently.
4. Inventory processing should react independently.
5. The Order API should not directly call these downstream components.

### Business Goal

Reduce coupling between order creation and downstream processing.

Instead of:

```text
Order API
   │
   ├── Notification Service
   │
   └── Inventory Service
```

we introduced:

```text
                    ┌── Notification Worker
                    │
Order API → Kafka ──┤
                    │
                    └── Inventory Worker
```

This establishes the foundation for future event-driven and microservice architecture.

---

# 3. Technical Design

## 3.1 Architecture

```text
                         PostgreSQL
                             ▲
                             │
Customer
   │
   ▼
Order Controller
   │
   ▼
Orders Service
   │
   ├── Orders Repository
   │       │
   │       ▼
   │    PostgreSQL
   │
   └── OrderEventsPublisher
             │
             ▼
        Kafka Producer
             │
             ▼
   shopsphere.order.events
             │
       ┌─────┴─────┐
       │           │
       ▼           ▼
Notification    Inventory
   Worker          Worker
       │           │
       ▼           ▼
 Notification    Inventory
 Processing      Processing
```

---

# 4. Kafka Topic

## Topic

```text
shopsphere.order.events
```

## Current Local Configuration

```text
Partitions: 2
Replication Factor: 1
```

The topic was initially created with one partition and later increased to two partitions for consumer-group experimentation.

### Why two partitions?

Two partitions allowed us to demonstrate how Kafka distributes partitions between consumers belonging to the same consumer group.

---

# 5. Event Contract

The first event implemented is:

```text
order.created
```

### Event structure

```json
{
  "eventId": "uuid",
  "eventType": "order.created",
  "eventVersion": 1,
  "occurredAt": "2026-09-14T19:30:00.000Z",
  "source": "shopsphere-order-service",
  "data": {
    "orderId": "order-uuid",
    "customerId": "customer-uuid",
    "totalAmount": 249.99,
    "currency": "AED",
    "items": [
      {
        "productId": "product-123",
        "quantity": 2
      }
    ]
  }
}
```

## Event Design Principles

The event contains only information required by downstream consumers.

It does **not** contain:

* Passwords
* Customer addresses
* Card information
* Sensitive authentication data
* Complete database records
* Unrelated internal database fields

---

# 6. Message Key

The Kafka message key is:

```text
orderId
```

Example:

```typescript
await this.kafkaProducer.publish(
  'shopsphere.order.events',
  event,
  data.orderId,
);
```

### Reason

Using `orderId` as the key causes events for the same order to be routed to the same Kafka partition.

This becomes important when future events are introduced, for example:

```text
order.created
order.paid
order.shipped
order.cancelled
```

Keeping events for the same order in the same partition helps preserve their ordering.

---

# 7. Producer Implementation

The Kafka producer is encapsulated inside:

```text
KafkaProducerService
```

The business-level publisher is:

```text
OrderEventsPublisher
```

This keeps Kafka-specific implementation separate from the Order domain logic.

### Responsibility separation

```text
OrdersService
     │
     ▼
OrderEventsPublisher
     │
     ▼
KafkaProducerService
     │
     ▼
Kafka
```

The `OrdersService` does not need to know Kafka client implementation details.

---

# 8. Order Creation Flow

The current flow is:

```text
POST /orders
      │
      ▼
OrdersController
      │
      ▼
OrdersService
      │
      ├── Validate order
      │
      ├── Validate products
      │
      ├── Check inventory
      │
      ├── Create order
      │
      └── Publish order.created
               │
               ▼
             Kafka
```

The database order is created before publishing the event.

---

# 9. Consumers

Two independent Kafka consumers were introduced.

## 9.1 Notification Worker

```text
OrderNotificationConsumer
```

Consumer group:

```text
shopsphere-order-notification
```

Its current responsibility is to demonstrate notification processing.

For an `order.created` event it logs:

```text
Notification: Order <orderId> created successfully
```

Future implementation could send:

* Email
* Push notification
* SMS
* Customer notification

---

## 9.2 Inventory Worker

```text
OrderInventoryConsumer
```

Consumer group:

```text
shopsphere-order-inventory
```

Its current responsibility is to demonstrate independent inventory processing.

For an `order.created` event it logs:

```text
Inventory: Processing order <orderId> for inventory reservation
```

Future implementation could:

* Reserve inventory
* Reduce stock
* Detect insufficient inventory
* Publish inventory events

---

# 10. Dedicated Worker Architecture

Instead of running all Kafka consumers inside the HTTP API process, dedicated worker entry points were introduced.

```text
backend/src/workers/
```

### Notification

```text
notification.worker.ts
```

### Inventory

```text
inventory.worker.ts
```

This results in separate processes:

```text
HTTP API
   │
   └── Orders API

Notification Worker
   │
   └── Notification Consumer

Inventory Worker
   │
   └── Inventory Consumer
```

### Why?

This provides a cleaner foundation for eventually extracting these workers into independent microservices.

It also prevents unrelated consumers from being unintentionally registered multiple times in the same NestJS application.

---

# 11. Consumer Groups

Two different consumer groups were deliberately used:

```text
shopsphere-order-notification
shopsphere-order-inventory
```

This creates fan-out behavior.

```text
                 Kafka Topic
                     │
             order.created
                     │
          ┌──────────┴──────────┐
          │                     │
          ▼                     ▼
 Notification Group       Inventory Group
          │                     │
          ▼                     ▼
 Notification Worker      Inventory Worker
```

Because they belong to different consumer groups, both groups receive the event.

---

# 12. Kafka Consumer Experiment

A controlled experiment was performed to understand Kafka partitions and consumer groups.

## Experiment 1 — One Partition, Two Consumers

The topic initially had:

```text
Partitions = 1
```

Two notification workers were started using the same consumer group.

```text
Notification Worker #1 ──┐
                         ├── shopsphere-order-notification
Notification Worker #2 ──┘
```

Result:

```text
Partition 0
     │
     ▼
One consumer receives the partition
```

Only one consumer processed the event.

### Learning

Kafka distributes partitions between consumers in the same consumer group.

With one partition, only one consumer can actively consume that partition at a time.

---

# 13. Experiment 2 — Two Partitions, Two Consumers

The topic was changed to:

```text
Partitions = 2
```

Two notification workers remained in the same consumer group.

Kafka assigned the partitions approximately as:

```text
Notification Worker #1 → Partition 0
Notification Worker #2 → Partition 1
```

Orders were then created and distributed across the partitions.

Observed processing included:

```text
Partition 0 → Order 12deaabe...
Partition 1 → Order 3ede5ba7...
Partition 1 → Order fb268cfc...
Partition 1 → Order 1b176421...
```

### Learning

Kafka distributes **partitions**, not individual messages, between consumers in the same group.

Therefore, two consumers do not necessarily receive an equal number of messages.

---

# 14. Important Kafka Concepts Learned

## Different consumer groups

Each group receives the event.

```text
Event
 │
 ├── Notification Group
 │
 └── Inventory Group
```

This provides fan-out.

---

## Same consumer group

Consumers share the work.

```text
Partition 0 ── Consumer A
Partition 1 ── Consumer B
```

This provides horizontal consumption/scaling.

---

## Consumer scalability

For a topic with:

```text
2 partitions
```

a consumer group can effectively use up to:

```text
2 active consumers
```

for that topic.

Additional consumers can exist, but if there are no additional partitions available, some consumers remain idle.

---

# 15. Kafka Offsets

Each Kafka message has an offset within its partition.

Example:

```text
Partition 0
offset 5

Partition 1
offset 0
offset 1
offset 2
```

Offsets are partition-specific.

Therefore:

```text
Partition 1 offset 2
```

does not mean it globally occurred after:

```text
Partition 0 offset 5
```

Kafka does not provide one global offset across all partitions.

---

# 16. Database Design

## Database Changes

No new database tables were required for Sprint 11.

The existing order schema remains responsible for persistent order state.

Kafka is used for asynchronous event distribution, not as the primary source of order data.

### Principle

```text
PostgreSQL → System of record
Kafka      → Event distribution
```

---

# 17. API Contract

The existing order API remains the entry point for order creation.

Conceptually:

```http
POST /orders
```

Successful order creation results in:

```text
1. Order persisted
2. order.created event generated
3. Event published to Kafka
4. Consumers process event asynchronously
```

No new public API endpoint is required for consumers.

---

# 18. Testing

## Producer Test

A Kafka test endpoint was created:

```http
GET /kafka/test
```

Expected response:

```json
{
  "message": "Kafka event published successfully"
}
```

This verified that the NestJS API could successfully publish an event to Kafka.

---

## End-to-End Order Test

A real order was created through the Order API.

Expected behavior:

```text
Order API
   │
   ├── PostgreSQL insert
   │
   └── Kafka order.created
            │
            ├── Notification Worker
            │
            └── Inventory Worker
```

Both workers successfully received and processed the event.

---

## Consumer Group Test

Two notification consumers were run in the same consumer group.

The partition-count experiment demonstrated:

```text
1 partition + 2 consumers
→ one active consumer

2 partitions + 2 consumers
→ both consumers can receive partitions
```

---

# 19. Architecture Decision Record

## ADR-007 — Introduce Kafka for Event-Driven Order Processing

### Context

Order processing will eventually require multiple downstream operations such as:

* Notifications
* Inventory
* Payments
* Shipping
* Analytics

Directly calling each downstream component from `OrdersService` would create tight coupling.

### Decision

Introduce Apache Kafka as an event backbone for asynchronous order events.

The initial event is:

```text
order.created
```

The initial consumers are:

```text
Notification Worker
Inventory Worker
```

### Reasoning

Kafka allows the Order service to publish an event without knowing which downstream systems consume it.

This provides:

* Loose coupling
* Independent consumers
* Asynchronous processing
* Consumer-group based scaling
* Event replay potential
* A foundation for future microservices

### Trade-off

Kafka introduces operational complexity and eventual consistency.

The initial implementation also uses:

```text
Database write
      ↓
Kafka publish
```

These are two separate operations.

If the database succeeds but Kafka publishing fails, the database contains the order while the event may not exist.

This is a known reliability gap.

### Future Decision

Introduce the **Transactional Outbox Pattern** when production-grade event reliability becomes the next requirement.

---

# 20. Reliability Consideration — Dual Write Problem

Current implementation:

```text
BEGIN
   Create Order in PostgreSQL
END

Publish order.created to Kafka
```

Possible failure:

```text
PostgreSQL
   │
   └── Order successfully created

Kafka
   │
   └── Publish fails
```

Result:

```text
Order exists
BUT
Downstream consumers never receive order.created
```

This is intentionally accepted for the learning implementation.

The next reliability evolution can be:

```text
Order Transaction
      │
      ├── Order
      │
      └── Outbox Event
             │
             ▼
        Outbox Publisher
             │
             ▼
           Kafka
```

This will be addressed later rather than adding complexity prematurely.

---

# 21. Kafka Warnings

During local development, KafkaJS/NestJS produced warnings related to:

* KafkaJS partitioner behavior
* Timeout configuration

These did not prevent event publishing or consumption.

They are considered development-environment warnings and are deferred for Kafka hardening.

---

# 22. Files Added / Updated

Major Kafka-related components include:

```text
backend/src/infrastructure/kafka/
├── kafka-producer.service.ts
├── kafka-test.controller.ts
├── order-events.publisher.ts
├── order-created.event.ts
├── order-notification.consumer.ts
└── order-inventory.consumer.ts

backend/src/workers/
├── notification-worker.module.ts
├── notification.worker.ts
├── inventory-worker.module.ts
└── inventory.worker.ts
```

Kafka infrastructure:

```text
infra/kafka/
└── docker-compose.yml
```

---

# 23. Definition of Done

Sprint 11 is considered complete because:

* [x] Kafka running locally using Docker
* [x] Kafka producer implemented
* [x] `order.created` event contract defined
* [x] Order creation integrated with Kafka publishing
* [x] `orderId` used as Kafka message key
* [x] Notification consumer implemented
* [x] Inventory consumer implemented
* [x] Consumers separated into dedicated worker processes
* [x] Different consumer groups demonstrated
* [x] Same consumer group behavior demonstrated
* [x] Kafka partition behavior demonstrated
* [x] Topic increased from 1 to 2 partitions for experimentation
* [x] End-to-end order event tested
* [x] Database remains source of truth
* [x] Dual-write reliability limitation documented
* [x] Transactional Outbox identified as future improvement
* [x] Experimental duplicate worker removed
* [x] Release tagged as `v0.11.0`

---

# 24. Key Takeaways

Sprint 11 established the fundamental Kafka concepts required for ShopSphere:

```text
Topic
  ↓
Partitions
  ↓
Consumer Groups
  ↓
Consumers
  ↓
Offsets
  ↓
Message Keys
  ↓
Event-Driven Architecture
```

The most important distinction learned is:

```text
Different consumer groups
        =
Fan-out

Same consumer group
        =
Load balancing
```

And:

```text
Partitions determine consumer parallelism.
```

---

# 25. Next Sprint

## Sprint 12 — AWS SQS & SNS

The next step is to learn AWS-native messaging using:

```text
SNS → Pub/Sub and Fan-out

SQS → Durable Queue and Background Processing
```

The target architecture will explore:

```text
ShopSphere
    │
    ▼
   SNS
    │
    ├──────────────┐
    ▼              ▼
 SQS Queue       SQS Queue
    │              │
    ▼              ▼
Worker A         Worker B
```

This will allow us to compare the concepts learned from Kafka with AWS-managed messaging.

### Initial learning objectives

* Create an SNS topic
* Create SQS queues
* Subscribe SQS queues to SNS
* Publish messages to SNS
* Consume messages from SQS
* Understand fan-out
* Understand at-least-once delivery
* Understand visibility timeout
* Understand dead-letter queues
* Compare Kafka vs SNS/SQS
* Integrate the pattern into ShopSphere

---

## Sprint 11 Release

```text
Version: v0.11.0
Feature: Kafka Event-Driven Architecture
Status: Completed
Next: Sprint 12 — AWS SQS/SNS
```
