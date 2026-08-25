import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { OrderStatus, Prisma } from '@prisma/client';
import { ValidatedOrderItem } from "validated-order-item.interface";

@Injectable()
export class OrdersRepository {
	constructor(private readonly prisma: PrismaService) { }

	async createOrder(
		userId: string,
		validatedItems: ValidatedOrderItem[],
		totalAmount: number,
	) {
		return this.prisma.$transaction(async (tx: any) => {
			const order = await tx.order.create({
				data: {
					userId,
					totalAmount,
				}
			})

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

			return tx.order.findUnique({
				where: {
					id: order.id,
				},
				include: {
					items: true,
				},
			});
		});
	}

	async findById(orderId: string, userId: string) {
		return this.prisma.order.findFirst({
			where: {
				id: orderId,
				userId
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
			}
		});
	}

	async findByUserId(userId: string, skip: number, take: number, search?: string) {
		const where: Prisma.OrderWhereInput = {
			userId,
		};

		if (search?.trim()) {
			const searchValue = search.trim();

			const orConditions: Prisma.OrderWhereInput[] = [
				{
					id: {
						contains: searchValue,
						mode: 'insensitive',
					},
				},
			];

			const matchingStatuses = Object.values(OrderStatus).filter(
				(status) =>
					status.toLowerCase().includes(
						searchValue.toLowerCase(),
					),
			);

			if (matchingStatuses.length > 0) {
				orConditions.push({
					status: {
						in: matchingStatuses,
					},
				});
			}
			where.OR = orConditions;
		}

		const [orders, total] = await this.prisma.$transaction([
			this.prisma.order.findMany({
				where,
				skip,
				take,
				orderBy: {
					createdAt: 'desc'
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
				}
			}),

			this.prisma.order.count({
				where
			}),
		]);

		return {
			data: orders,
			meta: {
				total,
			}
		}
	}

	async findByIdForUpdate(orderId: string) {
		return this.prisma.order.findUnique({
			where: {
				id: orderId,
			},
			include: {
				items: true
			}
		});
	}

	async updateOrder(
		orderId: string,
		newStatus: OrderStatus
	) {

		const shouldReleaseReservation = newStatus === OrderStatus.CANCELLED;
		const shouldDeductInventory = newStatus === OrderStatus.PAID;

		return this.prisma.$transaction(async (tx: any) => {
			const updatedOrder = await tx.order.update({
				where: {
					id: orderId,
				},
				data: {
					status: newStatus,
				},
				include: {
					items: true,
				},
			})

			for (const item of updatedOrder.items) {
				if (shouldDeductInventory) {
					await tx.inventory.update({
						where: {
							productId: item.productId,
						},
						data: {
							quantity: {
								decrement: item.quantity,
							},
							reserved: {
								decrement: item.quantity,
							},
						},
					});
				}

				if (shouldReleaseReservation) {
					await tx.inventory.update({
						where: {
							productId: item.productId,
						},
						data: {
							reserved: {
								decrement: item.quantity,
							},
						},
					});
				}
			}

			return updatedOrder;
		});
	}
}