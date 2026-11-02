import { parseNotificationEvent } from './shared/notification-event';

interface SqsRecord {
  messageId: string;
  body: string;
}

interface SqsEvent {
  Records: SqsRecord[];
}

export async function handler(event: SqsEvent) {
  const batchItemFailures: Array<{ itemIdentifier: string }> = [];

  for (const record of event.Records ?? []) {
    try {
      const notification = parseNotificationEvent(record.body);

      console.log('Simulated SMS notification delivery', {
        eventId: notification.eventId,
        orderId: notification.data.orderId,
        customerId: notification.data.customerId,
        totalAmount: notification.data.totalAmount,
        currency: notification.data.currency,
      });
    } catch (error) {
      console.error('Email notification processing failed', {
        messageId: record.messageId,
        error: error instanceof Error ? error.message : String(error),
      });

      batchItemFailures.push({
        itemIdentifier: record.messageId,
      });
    }
  }

  return { batchItemFailures };
}