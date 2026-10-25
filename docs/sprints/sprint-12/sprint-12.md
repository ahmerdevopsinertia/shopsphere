Sprint 12 — AWS SQS/SNS

Order Post-Processing Notifications

We'll use SNS + SQS for customer notification processing, but importantly, we will not connect it to the existing Kafka order.created flow.

We'll introduce a separate event:
order.notification.requested

For example, after some business action requires a customer notification:

ShopSphere API
     │
     ▼
 SNS
 "shopsphere.notification.events"
     │
     ├───────────────┐
     ▼               ▼
SQS Email          SQS SMS
Queue              Queue
     │               │
     ▼               ▼
Email Worker       SMS Worker

We don't need an Admin Portal or image upload.
But how will we trigger it?

We can create a small internal/test API endpoint specifically for our Sprint 12 learning:

POST /notifications/test

Request:

{
  "customerId": "customer-123",
  "type": "ORDER_CONFIRMED",
  "message": "Your order has been confirmed."
}

Then:

POST /notifications/test
        │
        ▼
       SNS
        │
        ├─────────────┐
        ▼             ▼
    Email SQS      SMS SQS
        │             │
        ▼             ▼
 Email Worker     SMS Worker

The workers will initially log the notification instead of actually sending an email/SMS.

That is enough to learn the complete AWS architecture.
Why I prefer this for Sprint 12

We already have:

    Customers

    Orders

    Authentication

    Order processing

    Kafka

    NestJS workers

So this fits naturally into ShopSphere without inventing a new business module.

More importantly, it lets us demonstrate the real reason SNS + SQS is useful:
SNS

One notification event can be delivered to multiple downstream systems.
SQS

Each system gets its own independent queue.

For example, if the SMS worker is down:

SNS
 │
 ├── Email SQS ──► Email Worker ✓
 │
 └── SMS SQS ────► message waits

The email processing doesn't have to stop because SMS processing is unavailable.
Sprint 12 Architecture

Our final learning architecture will be:

                       ShopSphere API
                             │
                             ▼
                           SNS
                 shopsphere.notification.events
                             │
                    ┌────────┴────────┐
                    │                 │
                    ▼                 ▼
              Email SQS            SMS SQS
                    │                 │
                    ▼                 ▼
              Email Worker        SMS Worker
                    │                 │
                    ▼                 ▼
              Email Provider       SMS Provider
              (simulated)          (simulated)

And later:

             ┌─────────────────────┐
             │ Dead Letter Queues  │
             └─────────────────────┘

One important architectural lesson

This will also help us understand why SNS alone isn't enough for this scenario.

If we did:

API → SNS → Workers

the workers don't get their own durable queue semantics.

With:

API → SNS → SQS → Worker

each consumer gets its own queue, retry behavior, visibility timeout and DLQ capability.

That's the core SNS + SQS fan-out pattern we want to learn.
So Sprint 12 is now:

Business Requirement: Asynchronous customer notification processing

Event: notification.requested

SNS: shopsphere.notification.events

Queues:

shopsphere.notification.email
shopsphere.notification.sms

Workers:

Email Notification Worker
SMS Notification Worker

Trigger: POST /notifications/test

External providers: Not required; workers will initially simulate delivery with logs.

This is a much cleaner fit for our current ShopSphere project.

===

10-Oct-2026

Our implementation sequence is:
1. Verify your new AWS identity and region.
2. Create the SNS topic.
3. Create email and SMS SQS queues.
4. Configure SNS subscriptions and permissions.
5. Implement the NestJS publisher and workers.
6. Test retries, visibility timeout, and dead-letter queues.
7. Document Sprint 12, commit, and tag v0.12.0.

====

Command to create SNS Topics

aws sns create-topic \
  --name shopsphere-notification-events \
  --region eu-west-2

Command to create SQL Topics

aws sqs create-queue \
  --queue-name shopsphere-notification-email \
  --region eu-west-2

SNS Topic ARN
arn:aws:sns:eu-west-2:217422362981:shopsphere-notification-events

Queue URL create
faryalahmer@Faryals-MacBook backend % aws sqs create-queue \
  --queue-name shopsphere-notification-email \
  --region eu-west-2
{
    "QueueUrl": "https://sqs.eu-west-2.amazonaws.com/217422362981/shopsphere-notification-email"
}
faryalahmer@Faryals-MacBook backend % aws sqs create-queue \
  --queue-name shopsphere-notification-sms \
  --region eu-west-2
{
    "QueueUrl": "https://sqs.eu-west-2.amazonaws.com/217422362981/shopsphere-notification-sms"
}

Command to get Queue Attributes

aws sqs get-queue-attributes \
  --queue-url "$EMAIL_QUEUE_URL" \
  --attribute-names QueueArn \
  --region "$AWS_REGION"


Email Queue Attributes
{
    "Attributes": {
        "QueueArn": "arn:aws:sqs:eu-west-2:217422362981:shopsphere-notification-email"
    }
}

SMS Queue Attributes

{
    "Attributes": {
        "QueueArn": "arn:aws:sqs:eu-west-2:217422362981:shopsphere-notification-sms"
    }
}

Command to create SQS to SNS subscription

aws sns subscribe \
  --topic-arn "$SNS_TOPIC_ARN" \
  --protocol sqs \
  --notification-endpoint "arn:aws:sqs:eu-west-2:217422362981:shopsphere-notification-email" \
  --region "$AWS_REGION"

  output
  {
    "SubscriptionArn": "arn:aws:sns:eu-west-2:217422362981:shopsphere-notification-events:f2ddda92-3f43-4444-aae9-5defbe360041"
    }

    output 2
{
    "SubscriptionArn": "arn:aws:sns:eu-west-2:217422362981:shopsphere-notification-events:1a28ef57-4186-4f33-a48f-5cc4023a67cb"
}

Command to list the SNS topic subscriptions 

aws sns list-subscriptions-by-topic \
  --topic-arn "$SNS_TOPIC_ARN" \
  --region "$AWS_REGION"

  Output

  {
    "Subscriptions": [
        {
            "SubscriptionArn": "arn:aws:sns:eu-west-2:217422362981:shopsphere-notification-events:1a28ef57-4186-4f33-a48f-5cc4023a67cb",
            "Owner": "217422362981",
            "Protocol": "sqs",
            "Endpoint": "arn:aws:sqs:eu-west-2:217422362981:shopsphere-notification-sms",
            "TopicArn": "arn:aws:sns:eu-west-2:217422362981:shopsphere-notification-events"
        },
        {
            "SubscriptionArn": "arn:aws:sns:eu-west-2:217422362981:shopsphere-notification-events:f2ddda92-3f43-4444-aae9-5defbe360041",
            "Owner": "217422362981",
            "Protocol": "sqs",
            "Endpoint": "arn:aws:sqs:eu-west-2:217422362981:shopsphere-notification-email",
            "TopicArn": "arn:aws:sns:eu-west-2:217422362981:shopsphere-notification-events"
        }
    ]
}

Command to publish the SNS Event

aws sns publish \
  --topic-arn "$SNS_TOPIC_ARN" \
  --subject "ShopSphere Test Notification" \
  --message '{"eventId":"test-001","eventType":"notification.requested","eventVersion":1,"source":"shopsphere-notification-service","data":{"customerId":"test-customer","type":"ORDER_CONFIRMED","message":"Your order has been confirmed."}}' \
  --region "$AWS_REGION"

  Command to check the receive SQS

  aws sqs receive-message \
  --queue-url "$EMAIL_QUEUE_URL" \
  --max-number-of-messages 1 \
  --wait-time-seconds 10 \
  --region "$AWS_REGION"

  output 

  {
    "Messages": [
        {
            "MessageId": "da98d6f2-8743-4dbc-aebf-55aca24477ca",
            "ReceiptHandle": "AQEBxCTxopyKFEOytTdvHCCsdCUPuL7O9YJyqWwnWyd6Bv3zkLJt0FnC3uUb78LD2YlNDiffaENCpOQv/Uf7313GFS5vF0BcIsanPTONOACi2FBXsxIX61/y446eVp2H3YsZEw02WVO5vgcpRycBtQocmrHm5aKkhxIPULg1ryoBQ8LZ/6fXoQ5/us5r62VIRa11lidKR2eJglpP6ouIjSE4ETWOh1LPoSO+tFh3JqSjdIQjaV7BLYQ9kU7qyvFSHH8WMBp5YxFUuW1LKqHCmtiQLhURyeQNJNcO60E5iNZpAkw0qu8gae+0uSGBdtnnK7wafUef1+Vu6rNleEVipb63Wm1Pamv0dOt7+O7162qyr8zlafM+mjtS9h+myimOYWikSOI8endVFkxCCTmHVVgHpocXcX/Nast30gQd0gdWQgs=",
            "MD5OfBody": "9e0cb8c0749527695bd9795e739dda81",
            "Body": "{\n  \"Type\" : \"Notification\",\n  \"MessageId\" : \"6478718b-e894-5daf-83c4-12cf75e8cf4b\",\n  \"TopicArn\" : \"arn:aws:sns:eu-west-2:217422362981:shopsphere-notification-events\",\n  \"Subject\" : \"ShopSphere Test Notification\",\n  \"Message\" : \"{\\\"eventId\\\":\\\"test-001\\\",\\\"eventType\\\":\\\"notification.requested\\\",\\\"eventVersion\\\":1,\\\"source\\\":\\\"shopsphere-notification-service\\\",\\\"data\\\":{\\\"customerId\\\":\\\"test-customer\\\",\\\"type\\\":\\\"ORDER_CONFIRMED\\\",\\\"message\\\":\\\"Your order has been confirmed.\\\"}}\",\n  \"Timestamp\" : \"2026-10-10T20:08:28.524Z\",\n  \"SignatureVersion\" : \"1\",\n  \"Signature\" : \"iha+dELbH4TV/7XXPHPuoQzOzbxAx8ThdfKs205Jvh2rP33PNs+/v1ELUFABU7+omj42n+FCjKuDIU/pPv4JxF7nfLrXfLnxbDjwW4y/Q6c5cs6uLHJ4NuqGHJj7dQJR0eoN7dQYV1/55uFtgaNKecbPbVjrgt8t0h2sgmktcLvKWz8fGWI5fsAAIRD/WwmSjaPvIbNcsVfVza/1zo71ENW3vEtI2BgNE8+L3tI4tVnVRz/8IjxSNNzHnvcIxQidEiTf3FBYTTbXPnSQd/s5BzjpC0e1cpyW+wZTBdjMunkXc5c+x5i+hZPJEyMr/uDUe0ZGOUiVR+yWepqkJ8WZCA==\",\n  \"SigningCertURL\" : \"https://sns.eu-west-2.amazonaws.com/SimpleNotificationService-1e59c4574facfe41babdb2d652f8ebef.pem\",\n  \"UnsubscribeURL\" : \"https://sns.eu-west-2.amazonaws.com/?Action=Unsubscribe&SubscriptionArn=arn:aws:sns:eu-west-2:217422362981:shopsphere-notification-events:f2ddda92-3f43-4444-aae9-5defbe360041\"\n}"
        }
    ]
}

second

{
    "Messages": [
        {
            "MessageId": "34c159b0-0218-4179-ad8c-a5b7cdc5c569",
            "ReceiptHandle": "AQEBJoUhGqvb50d3jMSNVw7XU1PfI6kI/GJ9oLlSluT57UhzfGqerMxlopTKIEDsFvz0QmsgPigI47S/sIZp9JIpBaf3SnovgGzAJpuxrJz23/5Cwh87QqSf5TLaArhQXwveOF6H8WiKU9F2cFzkmy3hm18TCfVtTVtaemraFMqJ81qNOWC0HAZK4XGT9SDk3NcutKsgGgTQxdZm2SuaY3FaZ0qAG5hZDLDxYSDMYq1pQkUmiQH8VWG4qwbVqg2jcAmCt6uSgfmqdYDseFg97DdGCeEjFUaSq6VxzMHl1XQHt8mLvWHwfK8HWxLzqWoesZzBRkUlRSC2L3j19C/oEoX1b7G9xESgQPSF+XjXXO6JjOME4HmFqsZcdgaZFXk+VUkn7SUmCTENeW6ccfUINDS0dzizJySW3BCGg4XvoDqf/HU=",
            "MD5OfBody": "213ae6ebeb914e313cca3b02f8cbbe09",
            "Body": "{\n  \"Type\" : \"Notification\",\n  \"MessageId\" : \"6478718b-e894-5daf-83c4-12cf75e8cf4b\",\n  \"TopicArn\" : \"arn:aws:sns:eu-west-2:217422362981:shopsphere-notification-events\",\n  \"Subject\" : \"ShopSphere Test Notification\",\n  \"Message\" : \"{\\\"eventId\\\":\\\"test-001\\\",\\\"eventType\\\":\\\"notification.requested\\\",\\\"eventVersion\\\":1,\\\"source\\\":\\\"shopsphere-notification-service\\\",\\\"data\\\":{\\\"customerId\\\":\\\"test-customer\\\",\\\"type\\\":\\\"ORDER_CONFIRMED\\\",\\\"message\\\":\\\"Your order has been confirmed.\\\"}}\",\n  \"Timestamp\" : \"2026-10-10T20:08:28.524Z\",\n  \"SignatureVersion\" : \"1\",\n  \"Signature\" : \"iha+dELbH4TV/7XXPHPuoQzOzbxAx8ThdfKs205Jvh2rP33PNs+/v1ELUFABU7+omj42n+FCjKuDIU/pPv4JxF7nfLrXfLnxbDjwW4y/Q6c5cs6uLHJ4NuqGHJj7dQJR0eoN7dQYV1/55uFtgaNKecbPbVjrgt8t0h2sgmktcLvKWz8fGWI5fsAAIRD/WwmSjaPvIbNcsVfVza/1zo71ENW3vEtI2BgNE8+L3tI4tVnVRz/8IjxSNNzHnvcIxQidEiTf3FBYTTbXPnSQd/s5BzjpC0e1cpyW+wZTBdjMunkXc5c+x5i+hZPJEyMr/uDUe0ZGOUiVR+yWepqkJ8WZCA==\",\n  \"SigningCertURL\" : \"https://sns.eu-west-2.amazonaws.com/SimpleNotificationService-1e59c4574facfe41babdb2d652f8ebef.pem\",\n  \"UnsubscribeURL\" : \"https://sns.eu-west-2.amazonaws.com/?Action=Unsubscribe&SubscriptionArn=arn:aws:sns:eu-west-2:217422362981:shopsphere-notification-events:1a28ef57-4186-4f33-a48f-5cc4023a67cb\"\n}"
        }
    ]
}

---

## Implementation Status — 25 October 2026

### Implemented Architecture

The notification flow is integrated with the existing checkout process.
A separate `POST /notifications/test` endpoint was not implemented.

Successful checkout processing publishes the existing Kafka `order.created`
event and a separate SNS `notification.requested` event.

The notification flow is:

Checkout Service
    |
    v
SNS: shopsphere-notification-events
    |
    +------------------------+
    |                        |
    v                        v
Email SQS                 SMS SQS
    |                        |
    v                        v
NestJS Email Worker       NestJS SMS Worker
    |                        |
    v                        v
Simulated email           Simulated SMS

Kafka order processing remains in place and is not replaced by SNS/SQS.

### AWS Resources

Region: `eu-west-2`

SNS topic:
`shopsphere-notification-events`

Email queue:
`shopsphere-notification-email`

SMS queue:
`shopsphere-notification-sms`

Both SQS queues have SNS subscriptions and queue policies that allow
messages from the configured SNS topic.

### Event Contract

The checkout service publishes a `notification.requested` event with
the following structure:

- `eventId`
- `eventType`
- `eventVersion`
- `occurredAt`
- `source`
- `data.orderId`
- `data.customerId`
- `data.totalAmount`
- `data.currency`
- `data.items`

Each item includes its product ID, product name, quantity, and unit price.

SNS wraps the published event in an SNS notification envelope when
delivering it to SQS. The NestJS consumer parses the envelope and then
parses the event contained in its `Message` field.

### Worker Implementation

Two independent command-line workers have been implemented:

- `npm run sqs:email-worker`
- `npm run sqs:sms-worker`

The shared SQS consumer service polls the configured queue, parses the
SNS envelope and notification event, logs a simulated notification,
and deletes the SQS message after successful processing.

The email and SMS integrations are simulations. No external email or
SMS provider has been connected.

### Verification Performed

- Checkout successfully published a notification event to SNS.
- The SNS topic delivered messages to both subscribed SQS queues.
- The email worker processed and deleted its queue message.
- The SMS worker processed and deleted its queue message.
- Queue metrics were checked after processing; both queues reported
  zero visible messages and zero messages not visible.

### Limitations and Deferred Work

- Actual email and SMS delivery is not implemented.
- Dead-letter queues are deferred.
- Lambda functions and SQS event source mappings have not yet been
  implemented.
- The local NestJS workers must remain stopped when Lambda begins
  consuming the same queues, to avoid competing consumers during
  migration testing.

### Next Milestone — AWS Lambda

The next milestone is to replace the custom SQS polling workers with
two Lambda functions:

- `shopsphere-email-notification`
- `shopsphere-sms-notification`

Each Lambda function will consume its existing SQS queue through an
SQS event source mapping. The existing SNS topic, subscriptions,
queues, and checkout publishing flow will be preserved.

The Lambda implementation will include partial batch failure handling
and CloudWatch log verification. Dead-letter queues remain deferred
unless the scope is explicitly changed.