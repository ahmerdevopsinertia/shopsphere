import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AddCartItemDto } from "./dto/add-cart-item.dto";
import { CartItemsDto, ReplaceCartItemsDto } from "./dto/replace-cart-item.dto";
import { Prisma } from "@prisma/client";

@Injectable()
export class CartRepository {
	constructor(private readonly prisma: PrismaService) { }

	async findByUserId(userId: string) {
		return this.prisma.cart.findUnique(
			{
				where: {
					userId,
				},
				include: {
					items: {
						include: {
							product: true,
						}
					}
				}
			}
		)
	}

	async createCart(userId: string) {
		return this.prisma.cart.create({
			data: {
				userId,
			},
			include: {
				items: {
					include: {
						product: true,
					}
				}
			}
		});
	}

	async findCartItem(cartId: string, productId: string) {
		return this.prisma.cartItem.findUnique(
			{
				where: {
					cartId_productId: {
						cartId,
						productId
					},
				}
			}
		)
	}

	async increaseQuantity(itemId: string, quantity: number) {
		return this.prisma.cartItem.update({
			where: {
				id: itemId
			},
			data: {
				quantity: {
					increment: quantity
				}
			}
		});
	}

	async createCartItem(cartId: string, dto: AddCartItemDto) {
		return this.prisma.cartItem.create({
			data: {
				cartId,
				productId: dto.productId,
				quantity: dto.quantity
			}
		});
	}

	async updateQuantity(
		itemId: string,
		quantity: number,
	) {
		return this.prisma.cartItem.update({
			where: {
				id: itemId,
			},
			data: {
				quantity,
			},
		});
	}

	async deleteCartItem(itemId: string) {
		return this.prisma.cartItem.delete({
			where: {
				id: itemId,
			},
		});
	}

	async replaceItems(
		cartId: string,
		existingItems: any[],
		incomingItems: CartItemsDto[],
	) {
		return this.prisma.$transaction(
			async (tx: Prisma.TransactionClient) => {

				// Convert arrays to Maps for O(1) lookup
				const existingMap = new Map(
					existingItems.map(item => [item.productId, item]),
				);

				const incomingMap = new Map(
					incomingItems.map(item => [item.productId, item]),
				);

				// Delete removed items
				for (const existing of existingItems) {
					if (!incomingMap.has(existing.productId)) {
						await tx.cartItem.delete({
							where: {
								id: existing.id,
							},
						});
					}
				}

				// Update existing / Create new
				for (const incoming of incomingItems) {
					const existing = existingMap.get(incoming.productId);

					if (existing) {
						await tx.cartItem.update({
							where: {
								id: existing.id,
							},
							data: {
								quantity: incoming.quantity,
							},
						});
					} else {
						await tx.cartItem.create({
							data: {
								cartId,
								productId: incoming.productId,
								quantity: incoming.quantity,
							},
						});
					}
				}
			},
		);
	}

	async clearCart(cartId: string): Promise<void> {
		await this.prisma.cartItem.deleteMany({
			where: {
				cartId,
			},
		});
	}
}