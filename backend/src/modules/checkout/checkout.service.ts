import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CartRepository } from '../cart/cart.repository';
import { InventoryRepository } from '../inventory/inventory.repository';
import { ProductsRepository } from '../products/products.repository';
import { JwtPayload } from '../profile/profile.service';
import { OrderResponseDto } from '../orders/dto/order-response.dto';
import { ProductStatus } from '@prisma/client';
import { ValidatedOrderItem } from 'validated-order-item.interface';
import { CheckoutRepository } from './checkout.repository';

@Injectable()
export class CheckoutService {
	constructor(
		private readonly cartRepository: CartRepository,
		private readonly productRepository: ProductsRepository,
		private readonly inventoryRepository: InventoryRepository,
		private readonly checkoutRepository: CheckoutRepository
	) { }

	async checkout(user: JwtPayload): Promise<OrderResponseDto> {
		// Load User Cart
		const cart = await this.cartRepository.findByUserId(user.sub);

		if (!cart) {
			throw new NotFoundException('Cart not found.');
		}

		// Validate Cart Is Not Empty
		if (cart.items.length === 0) {
			throw new BadRequestException('Cart is empty.');
		}

		let totalAmount = 0;

		const validatedItems: ValidatedOrderItem[] = [];

		// Validate Every Cart Item
		for (const item of cart.items) {
			// Product exists
			const product =
				await this.productRepository.findById(
					item.productId,
				);

			if (!product) {
				throw new NotFoundException(
					'Product not found.',
				);
			}

			// Product ACTIVE
			if (product.status !== ProductStatus.ACTIVE) {
				throw new BadRequestException(
					'Product is not active.',
				);
			}

			// Inventory exists
			const inventory =
				await this.inventoryRepository.findByProductId(
					item.productId,
				);

			if (!inventory) {
				throw new NotFoundException(
					'Inventory not found.',
				);
			}

			// Inventory availability
			const available =
				inventory.quantity - inventory.reserved;

			if (item.quantity > available) {
				throw new BadRequestException(
					'Insufficient stock.',
				);
			}

			// Calculate total
			const unitPrice = Number(product.price);

			totalAmount +=
				unitPrice * item.quantity;

			validatedItems.push({
				product,
				inventory,
				quantity: item.quantity,
				unitPrice,
			});
		}

		const order = await this.checkoutRepository.checkout(
			user.sub,
			cart.id,
			validatedItems,
			totalAmount,
		);

		return {
			id: order!.id,
			status: order!.status,
			totalAmount: Number(order!.totalAmount),
			paymentStatus: order.paymentStatus,
			paymentReference: order.paymentReference,
			items: order!.items.map(item => ({
				productId: item.productId,
				quantity: item.quantity,
				unitPrice: Number(item.unitPrice),
			})),
		};
	}
}
