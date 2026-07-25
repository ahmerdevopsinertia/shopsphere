import { BadRequestException, Injectable, NotFoundException, Search } from '@nestjs/common';
import { OrdersRepository } from './orders.repository';
import { CreateOrderDto } from './dto/create-order.dto';
import { ProductsRepository } from '../products/products.repository';
import { InventoryRepository } from '../inventory/inventory.repository';
import { OrderResponseDto } from './dto/order-response.dto';
import { JwtPayload } from '../profile/profile.service';
import { OrderListResponseDto } from './dto/order-list-response.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
	constructor(private readonly orderRepository: OrdersRepository,
		private readonly productRepository: ProductsRepository,
		private readonly inventoryRepository: InventoryRepository
	) { }

	async create(user: any, dto: CreateOrderDto): Promise<OrderResponseDto> {
		let totalAmount = 0;
		const validatedItems: {
			product: any;
			inventory: any;
			quantity: number;
			unitPrice: number;
		}[] = [];

		// Checking duplicate products

		const productIds = dto.items.map(item => item.productId);

		if (new Set(productIds).size !== productIds.length) {
			throw new BadRequestException('Duplicate products are not allowed in an order.');
		}

		for (const item of dto.items) {

			//  Checking product exist
			const product = await this.productRepository.findById(item.productId);

			if (!product) {
				throw new NotFoundException('Product not found.');
			}

			//  Checking product status
			if (product.status !== 'ACTIVE') {
				throw new BadRequestException(
					'Product is not active.',
				);
			}

			// Checking inventory
			const inventory = await this.inventoryRepository.findByProductId(product.id);

			if (!inventory) {
				throw new NotFoundException('Inventory not found.');
			}

			// Calculating available stock
			const available = inventory.quantity - inventory.reserved;

			if (item.quantity > available) {
				throw new BadRequestException(
					'Insufficient stock.',
				);
			}

			const unitPrice = Number(product.price);

			totalAmount += unitPrice * item.quantity;

			validatedItems.push({
				product,
				inventory,
				quantity: item.quantity,
				unitPrice,
			});
		}

		const order = await this.orderRepository.createOrder(user.sub, validatedItems, totalAmount);

		return {
			id: order.id,
			status: order.status,
			totalAmount: Number(order.totalAmount),
			items: validatedItems.map(item => ({
				productId: item.product.id,
				quantity: item.quantity,
				unitPrice: Number(item.unitPrice)
			})),
		};
	}

	async findOne(user: JwtPayload, orderId: string): Promise<any> {
		const order = await this.orderRepository.findById(orderId, user.sub);

		if (!order) {
			throw new NotFoundException('Order not found.')
		}

		return order;
	}

	async findAll(user: JwtPayload, page: number, limit: number, search: string): Promise<OrderListResponseDto> {
		const skip = (page - 1) * limit;
		const orders: any = await this.orderRepository.findByUserId(user.sub, skip, limit, search);
		const { data, meta } = orders;

		return {
			data: data.map((order: any) => ({
				id: order.id,
				status: order.status,
				totalAmount: Number(order.totalAmount),
				items: order.items.map((item) => ({
					productId: item.productId,
					quantity: item.quantity,
					unitPrice: Number(item.unitPrice),
				})),
			})),
			meta: {
				page,
				limit,
				total: meta.total,
				totalPages: Math.ceil(meta.total / limit),
			},
		};
	}

	private isValidTransition(
		current: string,
		next: OrderStatus,
	): boolean {
		const transitions = {
			PENDING: ['CONFIRMED', 'CANCELLED'],
			CONFIRMED: ['PAID'],
			PAID: ['SHIPPED'],
			SHIPPED: ['DELIVERED'],
			DELIVERED: [],
			CANCELLED: [],
		};
		return transitions[current].includes(next);
	}

	async updateStatus(orderId: string, dto: UpdateOrderStatusDto): Promise<OrderResponseDto> {
		const order = await this.orderRepository.findByIdForUpdate(orderId);

		if (!order) {
			throw new NotFoundException('Order not found.')
		}

		if (
			!this.isValidTransition(
				order.status,
				dto.status,
			)
		) {
			throw new BadRequestException(
				'Invalid status transition.',
			);
		}

		const updatedOrder = await this.orderRepository.updateOrder(order.id, dto.status)

		return {
			id: updatedOrder.id,
			status: updatedOrder.status,
			totalAmount: Number(updatedOrder.totalAmount),
			items: updatedOrder.items.map((item: any) => ({
				productId: item.productId,
				quantity: item.quantity,
				unitPrice: Number(item.unitPrice),
			})),
		};
	}
}
