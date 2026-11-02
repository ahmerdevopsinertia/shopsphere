import { Decimal } from "@prisma/client/runtime/binary";

export interface OrderCreatedEventData {
  orderId: string;
  customerId: string;
  totalAmount: Decimal;
  currency: string;
  items: {
    productId: string;
    quantity: number;
  }[];
}

export interface OrderCreatedEvent {
  eventId: string;
  eventType: 'order.created';
  eventVersion: 1;
  occurredAt: string;
  source: 'shopsphere-order-service';
  data: OrderCreatedEventData;
}