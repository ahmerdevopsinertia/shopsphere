var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/infrastructure/aws-lambda/email-notification.handler.ts
var email_notification_handler_exports = {};
__export(email_notification_handler_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(email_notification_handler_exports);

// src/infrastructure/aws-lambda/shared/notification-event.ts
function parseNotificationEvent(body) {
  const envelope = JSON.parse(body);
  if (envelope.Type !== "Notification" || !envelope.Message) {
    throw new Error("Invalid SNS notification envelope");
  }
  const event = JSON.parse(
    envelope.Message
  );
  if (event.eventType !== "notification.requested" || !event.eventId || !event.data?.orderId || !event.data?.customerId) {
    throw new Error("Invalid notification event");
  }
  return event;
}

// src/infrastructure/aws-lambda/email-notification.handler.ts
async function handler(event) {
  const batchItemFailures = [];
  for (const record of event.Records ?? []) {
    try {
      const notification = parseNotificationEvent(record.body);
      console.log("Simulated EMAIL notification delivery", {
        eventId: notification.eventId,
        orderId: notification.data.orderId,
        customerId: notification.data.customerId,
        totalAmount: notification.data.totalAmount,
        currency: notification.data.currency
      });
    } catch (error) {
      console.error("Email notification processing failed", {
        messageId: record.messageId,
        error: error instanceof Error ? error.message : String(error)
      });
      batchItemFailures.push({
        itemIdentifier: record.messageId
      });
    }
  }
  return { batchItemFailures };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
