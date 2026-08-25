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
		const paymentReference =
			`PAY-${randomUUID()}`;

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


				// 2. Create Order Items + Reserve Inventory
				for (const item of validatedItems) {

					await tx.orderItem.create({
						data: {
							orderId: order.id,
							productId: item.product.id,
							quantity: item.quantity,
							unitPrice: item.unitPrice,
						},
					});


					await tx.inventory.update({
						where: {
							productId: item.product.id,
						},
						data: {
							reserved: {
								increment: item.quantity,
							},
						},
					});
				}


				// 3. Clear Cart
				await tx.cartItem.deleteMany({
					where: {
						cartId,
					},
				});


				// 4. Return Order
				return tx.order.findUniqueOrThrow({
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
						}
					},
				});
			},
			{
				isolationLevel:
					Prisma.TransactionIsolationLevel.Serializable,
			},
		);
	}
}