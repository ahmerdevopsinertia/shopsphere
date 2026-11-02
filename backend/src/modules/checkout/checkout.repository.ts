import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { ValidatedOrderItem } from 'validated-order-item.interface';
import { Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';
import { PaymentStatus } from '@prisma/client';

@Injectable()
export class CheckoutRepository {
	constructor(private readonly prisma: PrismaService) { }

	async checkout(
		userId: string,
		cartId: string,
		validatedItems: ValidatedOrderItem[],
		totalAmount: number,
	) {
		const paymentReference = `PAY-${randomUUID()}`;
		const eventId = randomUUID();

		return this.prisma.$transaction(
			async (tx) => {
				// 1. Create Order
				const order = await tx.order.create({
					data: {
						userId,
						totalAmount,
						paymentStatus: PaymentStatus.PENDING,
						paymentReference,
					},
				});

				// 2. Create Order Items and reserve inventory atomically
				for (const item of validatedItems) {
					const inventoryUpdate = await tx.inventory.updateMany({
						where: {
							productId: item.product.id,
							quantity: {
								gte: item.quantity,
							},
							reserved: {
								lte: item.inventory.quantity - item.quantity,
							},
						},
						data: {
							reserved: {
								increment: item.quantity,
							},
						},
					});

					if (inventoryUpdate.count !== 1) {
						throw new Error(
							`Insufficient inventory for product ${item.product.id}`,
						);
					}

					await tx.orderItem.create({
						data: {
							orderId: order.id,
							productId: item.product.id,
							quantity: item.quantity,
							unitPrice: item.unitPrice,
						},
					});
				}

				// 3. Clear Cart
				await tx.cartItem.deleteMany({
					where: {
						cartId,
					},
				});

				// 4. Load the completed order
				const completedOrder = await tx.order.findUniqueOrThrow({
					where: {
						id: order.id,
					},
					include: {
						items: {
							include: {
								product: {
									select: {
										id: true,
										name: true,
									},
								},
							},
						},
					},
				});

				// 5. Persist notification event in the same transaction
				const notificationEvent = {
					eventId,
					eventType: 'notification.requested',
					eventVersion: 1,
					occurredAt: new Date().toISOString(),
					source: 'shopsphere-notification-service',
					data: {
						orderId: completedOrder.id,
						customerId: completedOrder.userId,
						totalAmount: Number(completedOrder.totalAmount),
						currency: 'AED',
						items: completedOrder.items.map((item) => ({
							productId: item.productId,
							productName: item.product.name,
							quantity: item.quantity,
							unitPrice: Number(item.unitPrice),
						})),
					},
				};

				await tx.notificationOutbox.create({
					data: {
						eventId,
						eventType: notificationEvent.eventType,
						payload: notificationEvent,
					},
				});

				return completedOrder;
			},
			{
				isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
			},
		);
	}

}