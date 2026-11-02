export interface NotificationRequestedEvent {
  eventId: string;
  eventType: 'notification.requested';
  eventVersion: 1;
  occurredAt: string;
  source: 'shopsphere-notification-service';
  data: {
    orderId: string;
    customerId: string;
    totalAmount: number;
    currency: string;
    items: Array<{
      productId: string;
      productName: string;
      quantity: number;
      unitPrice: number;
    }>;
  };
}

interface SnsEnvelope {
  Type: string;
  Message: string;
}

export function parseNotificationEvent(
  body: string,
): NotificationRequestedEvent {
  const envelope = JSON.parse(body) as SnsEnvelope;

  if (envelope.Type !== 'Notification' || !envelope.Message) {
    throw new Error('Invalid SNS notification envelope');
  }

  const event = JSON.parse(
    envelope.Message,
  ) as NotificationRequestedEvent;

  if (
    event.eventType !== 'notification.requested' ||
    !event.eventId ||
    !event.data?.orderId ||
    !event.data?.customerId
  ) {
    throw new Error('Invalid notification event');
  }

  return event;
}