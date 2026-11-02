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

 

## Additional Implementation Update — 26 October 2026

### 1. AWS Lambda Notification Consumers

Implemented two AWS Lambda functions to consume notification events from SQS queues:

- **Email Lambda:** `shopsphere-email-notification`
- **SMS Lambda:** `shopsphere-sms-notification`
- **Runtime:** Node.js 22
- **Memory:** 128 MB
- **Timeout:** 10 seconds

Both Lambda functions are deployed and active in the `eu-west-2` (London) AWS region.

### 2. Event Processing Architecture

The notification flow has been implemented as follows:

1. Checkout creates the order.
2. The checkout service publishes a `notification.requested` event to the SNS topic.
3. SNS distributes the event to the subscribed email and SMS SQS queues.
4. Each SQS queue triggers its corresponding Lambda function.
5. The Lambda function extracts the event from the SNS message envelope, processes it, and logs the simulated notification delivery.

**Resources:**

- SNS topic: `shopsphere-notification-events`
- Email queue: `shopsphere-notification-email`
- SMS queue: `shopsphere-notification-sms`
- Email consumer: `shopsphere-email-notification`
- SMS consumer: `shopsphere-sms-notification`

### 3. Event Contract

The notification event uses the following structure:

```json
{
  "eventId": "string",
  "eventType": "notification.requested",
  "eventVersion": 1,
  "occurredAt": "ISO-8601 timestamp",
  "source": "shopsphere-notification-service",
  "data": {
    "orderId": "string",
    "customerId": "string",
    "totalAmount": 0,
    "currency": "string",
    "items": [
      {
        "productId": "string",
        "productName": "string",
        "quantity": 1,
        "unitPrice": 0
      }
    ]
  }
}
```

SNS delivers the notification to SQS using an SNS envelope. The Lambda consumers extract the JSON event from the envelope's `Message` field.

### 4. Reliability and Error Handling

- Both Lambda functions are connected to their respective SQS queues through enabled event source mappings.
- The event source mappings use `ReportBatchItemFailures` to support reporting individual failed records.
- The Lambda execution role has CloudWatch logging permissions and the required SQS access policy.
- The SQS visibility timeout is configured to 60 seconds.
- Dead-letter queues have not yet been configured.

### 5. Integration Testing and Verification

The following checks have been completed:

- Built the Lambda bundles using esbuild for the Node.js 22 runtime.
- Created deployment ZIP files containing the respective Lambda handler files.
- Deployed both Lambda functions and verified their active status.
- Invoked both functions directly with an empty SQS records array and confirmed successful responses.
- Triggered the notification flow through a real checkout API request.
- Verified in CloudWatch Logs that both consumers processed the same order and notification event.
- Queried both SQS queues after processing and observed zero available and zero in-flight messages.

**Verified checkout result:**

- Order ID: `763c70e9-51db-487f-b72c-3aec5359222e`
- Order status: `PENDING`
- Payment status: `PENDING`
- Order total: AED 29

Both the email and SMS Lambda logs contained the same event ID and order ID for this test.

### 6. Current Limitations

- Email and SMS delivery is simulated through application logging. No external email or SMS provider is connected.
- Dead-letter queues and dedicated failure-recovery testing remain pending.
- Automated tests for the Lambda consumers and notification flow remain future work.
- The checkout service creates the order before publishing the notification event. If event publishing fails, an order may already exist even if the checkout request reports an error. A transactional outbox can be evaluated to improve reliability.
- Monitoring, alerting, and deployment automation for the Lambda functions can be enhanced in a future iteration.

### 7. Next Steps

1. Test malformed events and individual-record failure handling.
2. Configure dead-letter queues and validate retry and recovery behavior.
3. Add automated tests for event parsing, validation, and notification processing.
4. Evaluate a transactional outbox for reliable event publishing after order creation.
5. Integrate actual email and SMS providers when required.
6. Improve monitoring, alerting, and deployment automation.


-----

--- Create AWS policy command in created file

cat > ../infra/aws/iam/lambda-trust-policy.json <<'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF

output



--- Create AWS role command

aws iam create-role \
  --role-name ShopSphereNotificationLambdaRole \
  --assume-role-policy-document file://../infra/aws/iam/lambda-trust-policy.json \
  --description "Execution role for ShopSphere email and SMS notification Lambdas" \
  --profile AdministratorAccess-217422362981

--- Attach Role a Policy command (CloudWatch logging permissions policy)

aws iam attach-role-policy \
  --role-name ShopSphereNotificationLambdaRole \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole \
  --profile AdministratorAccess-217422362981

--- List Role Policies command
aws iam list-attached-role-policies \
  --role-name ShopSphereNotificationLambdaRole \
  --profile AdministratorAccess-217422362981 \
  --output table

--- Create AWS policy command

aws iam create-policy \
  --policy-name ShopSphereNotificationSQSAccess \
  --policy-document file://../infra/aws/iam/lambda-sqs-access-policy.json \
  --description "Allow ShopSphere notification Lambdas to consume email and SMS SQS queues" \
  --profile AdministratorAccess-21742236298

  output

  {
    "Policy": {
        "PolicyName": "ShopSphereNotificationSQSAccess",
        "PolicyId": "ANPATFH3B7FS7ZMJZP442",
        "Arn": "arn:aws:iam::217422362981:policy/ShopSphereNotificationSQSAccess",
        "Path": "/",
        "DefaultVersionId": "v1",
        "AttachmentCount": 0,
        "PermissionsBoundaryUsageCount": 0,
        "IsAttachable": true,
        "CreateDate": "2026-10-26T15:59:08+00:00",
        "UpdateDate": "2026-10-26T15:59:08+00:00"
    }
}

--- Command to create Lambda function

aws lambda create-function \
  --function-name shopsphere-sms-notification \
  --runtime nodejs22.x \
  --role arn:aws:iam::217422362981:role/ShopSphereNotificationLambdaRole \
  --handler sms-notification.handler.handler \
  --zip-file fileb://dist-lambda/packages/shopsphere-sms-notification.zip \
  --timeout 10 \
  --memory-size 128 \
  --region eu-west-2 \
  --profile AdministratorAccess-217422362981

  Output

  {
    "FunctionName": "shopsphere-sms-notification",
    "FunctionArn": "arn:aws:lambda:eu-west-2:217422362981:function:shopsphere-sms-notification",
    "Runtime": "nodejs22.x",
    "Role": "arn:aws:iam::217422362981:role/ShopSphereNotificationLambdaRole",
    "Handler": "sms-notification.handler.handler",
    "CodeSize": 1142,
    "Description": "",
    "Timeout": 10,
    "MemorySize": 128,
    "LastModified": "2026-10-26T17:45:30.770+0000",
    "CodeSha256": "PCmkyYn8B9mU7pKDCbN0Dlpahg6mgWxwCXxikZcmVzU=",
    "Version": "$LATEST",
    "TracingConfig": {
        "Mode": "PassThrough"
    },
    "RevisionId": "22867cd7-a0f9-4de0-b644-0bc09306150e",
    "State": "Pending",
    "StateReason": "The function is being created.",
    "StateReasonCode": "Creating",
    "PackageType": "Zip",
    "Architectures": [
        "x86_64"
    ],
    "EphemeralStorage": {
        "Size": 512
    },
    "SnapStart": {
        "ApplyOn": "None",
        "OptimizationStatus": "Off"
    },
    "RuntimeVersionConfig": {
        "RuntimeVersionArn": "arn:aws:lambda:eu-west-2::runtime:564bb908e71037c3cb0bf7362c5f4bcfeb80c4622ce5ed46e7265c4db411e47c"
    },
    "LoggingConfig": {
        "LogFormat": "Text",
        "LogGroup": "/aws/lambda/shopsphere-sms-notification"
    }
}

--- Command to update Lambda function
aws lambda update-function-code \
  --function-name shopsphere-sms-notification \
  --zip-file fileb://dist-lambda/packages/shopsphere-sms-notification.zip \
  --region eu-west-2 \
  --profile AdministratorAccess-217422362981
{
    "FunctionName": "shopsphere-sms-notification",
    "FunctionArn": "arn:aws:lambda:eu-west-2:217422362981:function:shopsphere-sms-notification",
    "Runtime": "nodejs22.x",
    "Role": "arn:aws:iam::217422362981:role/ShopSphereNotificationLambdaRole",
    "Handler": "sms-notification.handler",
    "CodeSize": 1126,
    "Description": "",
    "Timeout": 10,
    "MemorySize": 128,
    "LastModified": "2026-10-26T18:24:13.000+0000",
    "CodeSha256": "MoHhdFFgPpn/KRNnZWOlgLuUJeMgXeGhI5LvXnu3i9E=",
    "Version": "$LATEST",
    "TracingConfig": {
        "Mode": "PassThrough"
    },
    "RevisionId": "aa791eb1-3ca2-4a8e-8ab5-239500382388",
    "State": "Active",
    "LastUpdateStatus": "InProgress",
    "LastUpdateStatusReason": "The function is being created.",
    "LastUpdateStatusReasonCode": "Creating",
    "PackageType": "Zip",
    "Architectures": [
        "x86_64"
    ],
    "EphemeralStorage": {
        "Size": 512
    },
    "SnapStart": {
        "ApplyOn": "None",
        "OptimizationStatus": "Off"
    },
    "RuntimeVersionConfig": {
        "RuntimeVersionArn": "arn:aws:lambda:eu-west-2::runtime:564bb908e71037c3cb0bf7362c5f4bcfeb80c4622ce5ed46e7265c4db411e47c"
    },
    "LoggingConfig": {
        "LogFormat": "Text",
        "LogGroup": "/aws/lambda/shopsphere-sms-notification"
    }
}


--- Command to list Lambda created function

aws lambda list-functions \
  --region eu-west-2 \
  --profile AdministratorAccess-217422362981 \
  --query "Functions[?FunctionName=='shopsphere-email-notification' || FunctionName=='shopsphere-sms-notification'].[FunctionName,Runtime,Handler,State,LastUpdateStatus]" \
  --output table

--- Command to get Lambda function

aws lambda get-function-configuration \
  --function-name shopsphere-sms-notification \
  --region eu-west-2 \
  --profile AdministratorAccess-217422362981 \
  --query '{Handler:Handler,State:State,LastUpdateStatus:LastUpdateStatus}' \
  --output json
{
    "Handler": "sms-notification.handler",
    "State": "Active",
    "LastUpdateStatus": "Successful"
}


--- Command to invoke Lambda function

aws lambda invoke \
  --function-name shopsphere-sms-notification \
  --region eu-west-2 \
  --profile AdministratorAccess-217422362981 \
  --cli-binary-format raw-in-base64-out \
  --payload '{"Records":[]}' \
  /tmp/shopsphere-sms-response.json
{
    "StatusCode": 200,
    "ExecutedVersion": "$LATEST"
}
faryalahmer@Faryals-MacBook backend % cat /tmp/shopsphere-sms-response.json
{"batchItemFailures":[]}%          

--- Command to create source mapping

aws lambda create-event-source-mapping \
  --function-name shopsphere-email-notification \
  --event-source-arn arn:aws:sqs:eu-west-2:217422362981:shopsphere-notification-email \
  --batch-size 10 \
  --function-response-types ReportBatchItemFailures \
  --region eu-west-2 \
  --profile AdministratorAccess-217422362981
{
    "UUID": "2c98bb46-cd2c-49a7-abc1-77c8f4fea482",
    "BatchSize": 10,
    "MaximumBatchingWindowInSeconds": 0,
    "EventSourceArn": "arn:aws:sqs:eu-west-2:217422362981:shopsphere-notification-email",
    "FunctionArn": "arn:aws:lambda:eu-west-2:217422362981:function:shopsphere-email-notification",
    "LastModified": "2026-10-26T21:54:23.676000+04:00",
    "State": "Creating",
    "StateTransitionReason": "USER_INITIATED",
    "FunctionResponseTypes": [
        "ReportBatchItemFailures"
    ],
    "EventSourceMappingArn": "arn:aws:lambda:eu-west-2:217422362981:event-source-mapping:2c98bb46-cd2c-49a7-abc1-77c8f4fea482"
}

--- Command to Get Event source mapping

aws lambda get-event-source-mapping \
  --uuid 7ad03822-d91f-4014-a54d-b4f88752a39e \
  --region eu-west-2 \
  --profile AdministratorAccess-217422362981
{
    "UUID": "7ad03822-d91f-4014-a54d-b4f88752a39e",
    "BatchSize": 10,
    "MaximumBatchingWindowInSeconds": 0,
    "EventSourceArn": "arn:aws:sqs:eu-west-2:217422362981:shopsphere-notification-sms",
    "FunctionArn": "arn:aws:lambda:eu-west-2:217422362981:function:shopsphere-sms-notification",
    "LastModified": "2026-10-26T21:55:04.964000+04:00",
    "State": "Enabled",
    "StateTransitionReason": "USER_INITIATED",
    "FunctionResponseTypes": [
        "ReportBatchItemFailures"
    ],
    "EventSourceMappingArn": "arn:aws:lambda:eu-west-2:217422362981:event-source-mapping:7ad03822-d91f-4014-a54d-b4f88752a39e"
}

--- Command to test SNS 

mkdir -p ../infra/aws

cat > ../infra/aws/test-notification-event.json <<'EOF'
{
  "eventId": "test-notification-lambda-20261026-001",
  "eventType": "notification.requested",
  "eventVersion": 1,
  "occurredAt": "2026-10-26T18:00:00.000Z",
  "source": "shopsphere-notification-service",
  "data": {
    "orderId": "TEST-LAMBDA-001",
    "customerId": "TEST-CUSTOMER-001",
    "totalAmount": 39,
    "currency": "AED",
    "items": [
      {
        "productId": "TEST-PRODUCT-001",
        "productName": "ShopSphere Lambda Test Product",
        "quantity": 1,
        "unitPrice": 39
      }
    ]
  }
}
EOF

aws sns publish \
  --topic-arn arn:aws:sns:eu-west-2:217422362981:shopsphere-notification-events \
  --message file://../infra/aws/test-notification-event.json \
  --subject "ShopSphere Lambda Integration Test" \
  --region eu-west-2 \
  --profile AdministratorAccess-217422362981

Output
{
    "MessageId": "d5753502-59a2-5948-948b-565bce70277f"
}

--- Command to check CloudWatch logs
aws logs tail /aws/lambda/shopsphere-sms-notification \
  --since 5m \
  --region eu-west-2 \
  --profile AdministratorAccess-217422362981

  Output

  START RequestId: b626b50e-d193-5205-bca4-d6574c49ea42 Version: $LATEST
2026-10-26T18:27:52.449000+00:00 2026/10/26/[$LATEST]2c7f6d94fb8746c5b182094189d029bf 2026-10-26T18:27:52.449Z	b626b50e-d193-5205-bca4-d6574c49ea42	INFO	Simulated EMAIL notification delivery {
  eventId: 'test-notification-lambda-20261026-001',
  orderId: 'TEST-LAMBDA-001',
  customerId: 'TEST-CUSTOMER-001',
  totalAmount: 39,
  currency: 'AED'
}
2026-10-26T18:27:52.471000+00:00 2026/10/26/[$LATEST]2c7f6d94fb8746c5b182094189d029bf END RequestId: b626b50e-d193-5205-bca4-d6574c49ea42
2026-10-26T18:27:52.471000+00:00 2026/10/26/[$LATEST]2c7f6d94fb8746c5b182094189d029bf REPORT RequestId: b626b50e-d193-5205-bca4-d6574c49ea42	Duration: 36.63 ms	Billed Duration: 37 ms	Memory Size: 128 MB	Max Memory Used: 71 MB

and

aws logs tail /aws/lambda/shopsphere-sms-notification \
  --since 5m \
  --region eu-west-2 \
  --profile AdministratorAccess-217422362981
output

START RequestId: 13be553a-55b3-53a4-b7c0-3663f44820cb Version: $LATEST
2026-10-26T18:45:17.209000+00:00 2026/10/26/[$LATEST]16bc2177e00c4743b2b62f123feb9346 2026-10-26T18:45:17.209Z	13be553a-55b3-53a4-b7c0-3663f44820cb	INFO	Simulated EMAIL notification delivery {
  eventId: '44044279-c024-4a5c-b9a8-dc3985f261f7',
  orderId: '763c70e9-51db-487f-b72c-3aec5359222e',
  customerId: '3be55d74-7904-47ae-a98b-325f55ac2843',
  totalAmount: 29,
  currency: 'AED'
}
2026-10-26T18:45:17.231000+00:00 2026/10/26/[$LATEST]16bc2177e00c4743b2b62f123feb9346 END RequestId: 13be553a-55b3-53a4-b7c0-3663f44820cb
2026-10-26T18:45:17.231000+00:00 2026/10/26/[$LATEST]16bc2177e00c4743b2b62f123feb9346 REPORT RequestId: 13be553a-55b3-53a4-b7c0-3663f44820cb	Duration: 22.32 ms	Billed Duration: 23 ms	Memory Size: 128 MB	Max Memory Used: 71 MB

API response also confirms SNS -> SQS also working

  {
    "success": true,
    "data": {
        "id": "763c70e9-51db-487f-b72c-3aec5359222e",
        "status": "PENDING",
        "totalAmount": 29,
        "paymentStatus": "PENDING",
        "paymentReference": "PAY-4bdbe6bb-73cf-4d71-96be-9cf30a98a491",
        "items": [
            {
                "productId": "bf939da3-bb34-4032-ac0b-e58140f2124f",
                "productName": "Clear iPhone 17 Case",
                "quantity": 1,
                "unitPrice": 29
            }
        ]
    }
}

--- Command to rebuild Lambda bundles

npm run build:lambdas

