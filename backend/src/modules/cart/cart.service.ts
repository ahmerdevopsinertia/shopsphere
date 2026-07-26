import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CartRepository } from './cart.repository';
import { ProductsRepository } from '../products/products.repository';
import { ProductStatus } from '@prisma/client';
import { JwtPayload } from '../profile/profile.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { CartResponseDto } from './dto/cart-response.dto';
import { UpdateCartQuantityDto } from './dto/update-cart-quantity.dto';
import { InventoryRepository } from '../inventory/inventory.repository';
import { ReplaceCartItemsDto } from './dto/replace-cart-item.dto';

@Injectable()
export class CartService {
	constructor(private readonly cartRepository: CartRepository,
		private readonly productRepository: ProductsRepository,
		private readonly inventoryRepository: InventoryRepository
	) { }

	async createCart(user: JwtPayload, dto: AddCartItemDto): Promise<CartResponseDto> {
		// Find or create user's cart
		const cart = await this.getOrCreateCart(user.sub);

		// Check existing cart item
		const existingItem =
			await this.cartRepository.findCartItem(
				cart.id,
				dto.productId,
			);


		// Calculate final quantity after this operation
		let finalQuantity = dto.quantity;

		if (existingItem) {
			finalQuantity += existingItem.quantity;
		}


		// Validate product, status and inventory
		await this.validateProductForCart(
			dto.productId,
			finalQuantity,
		);


		// Update or create cart item
		if (existingItem) {

			await this.cartRepository.increaseQuantity(
				existingItem.id,
				dto.quantity,
			);

		} else {

			await this.cartRepository.createCartItem(
				cart.id,
				dto,
			);
		}


		// Reload updated cart
		const updatedCart =
			await this.cartRepository.findByUserId(
				user.sub,
			);

		if (!updatedCart) {
			throw new NotFoundException(
				'Cart not found.',
			);
		}

		return this.toCartResponse(
			updatedCart,
		);
	}

	async getCart(user: JwtPayload): Promise<CartResponseDto> {
		const cart = await this.cartRepository.findByUserId(user.sub);

		if (!cart) {
			throw new NotFoundException('Cart not found.');
		}

		return this.toCartResponse(cart);
	}

	async replaceItems(user: JwtPayload, dto: ReplaceCartItemsDto): Promise<CartResponseDto> {
		// Find or create user's cart
		let cart = await this.getOrCreateCart(user.sub);

		// Prevent duplicate products
		const productIds = dto.items.map(i => i.productId);

		if (new Set(productIds).size !== productIds.length) {
			throw new BadRequestException('Duplicate products are not allowed');
		}

		// Validate product, status and inventory
		for (const item of dto.items) {
			await this.validateProductForCart(
				item.productId,
				item.quantity,
			);
		}

		// Check existing cart item
		const existingItems = cart.items;

		await this.cartRepository.replaceItems(
			cart.id,
			existingItems,
			dto.items,
		);

		// Reload updated cart
		const updatedCart =
			await this.cartRepository.findByUserId(
				user.sub,
			);

		if (!updatedCart) {
			throw new NotFoundException(
				'Cart not found.',
			);
		}

		return this.toCartResponse(
			updatedCart,
		);
	}

	async updateQuantity(
		user: JwtPayload,
		productId: string,
		dto: UpdateCartQuantityDto): Promise<CartResponseDto> {

		// Find user's cart
		const cart = await this.cartRepository.findByUserId(user.sub);

		if (!cart) {
			throw new NotFoundException('Cart not found.');
		}

		// Find carts item
		const cartItem = await this.cartRepository.findCartItem(cart.id, productId);

		if (!cartItem) {
			throw new NotFoundException('Cart item not found.');
		}

		// Validate product
		const product = await this.productRepository.findById(productId);

		if (!product) {
			throw new NotFoundException('Product not found.');
		}

		if (product.status !== ProductStatus.ACTIVE) {
			throw new BadRequestException('Product is not active.');
		}

		// Validate inventory 
		const inventory = await this.inventoryRepository.findByProductId(productId);

		if (!inventory) {
			throw new NotFoundException('Inventory not found.');
		}

		const available = inventory.quantity - inventory.reserved;

		if (dto.quantity > available) {
			throw new BadRequestException('Insufficient stock.');
		}

		// Update quantity
		await this.cartRepository.updateQuantity(cartItem.id, dto.quantity);

		const updatedCart = await this.cartRepository.findByUserId(user.sub);

		if (!updatedCart) {
			throw new NotFoundException('Cart not found.');
		}

		return this.toCartResponse(updatedCart);
	}

	async removeItem(
		user: JwtPayload,
		productId: string): Promise<CartResponseDto> {

		// Find user's cart
		const cart = await this.cartRepository.findByUserId(user.sub);

		if (!cart) {
			throw new NotFoundException('Cart not found.');
		}

		// Find carts item
		const cartItem = await this.cartRepository.findCartItem(cart.id, productId);

		if (!cartItem) {
			throw new NotFoundException('Cart item not found.');
		}

		// Delete item
		await this.cartRepository.deleteCartItem(cartItem.id);

		const updatedCart = await this.cartRepository.findByUserId(user.sub);

		if (!updatedCart) {
			throw new NotFoundException('Cart not found.');
		}

		return this.toCartResponse(updatedCart);
	}

	private toCartResponse(cart: any): CartResponseDto {
		return {
			id: cart.id,
			totalAmount: cart.items.reduce(
				(sum: number, item: any) =>
					sum + Number(item.product.price) * item.quantity,
				0,
			),
			items: cart.items.map((item: any) => {
				return {
					productId: item.productId,
					name: item.product.name,
					unitPrice: Number(item.product.price),
					quantity: item.quantity,
					subtotal: Number(item.product.price) * item.quantity
				}
			})
		}
	}

	private async validateProductForCart(
		productId: string,
		requestedQuantity: number,
	) {

		const product =
			await this.productRepository.findById(productId);

		if (!product) {
			throw new NotFoundException(
				'Product not found.',
			);
		}

		if (product.status !== ProductStatus.ACTIVE) {
			throw new BadRequestException(
				'Product is not active.',
			);
		}

		const inventory =
			await this.inventoryRepository.findByProductId(productId);

		if (!inventory) {
			throw new NotFoundException(
				'Inventory not found.',
			);
		}

		const available =
			inventory.quantity - inventory.reserved;

		if (requestedQuantity > available) {
			throw new BadRequestException(
				'Insufficient stock.',
			);
		}

		return { product, inventory, available };
	}

	private async getOrCreateCart(userId: string) {
		let cart = await this.cartRepository.findByUserId(userId);

		if (!cart) {
			await this.cartRepository.createCart(userId);

			cart = await this.cartRepository.findByUserId(userId);
		}

		if (!cart) {
			throw new NotFoundException('Cart not found.');
		}

		return cart;
	}

}
