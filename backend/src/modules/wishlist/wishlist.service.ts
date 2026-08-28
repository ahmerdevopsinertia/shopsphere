import {
	Injectable,
	NotFoundException,
} from '@nestjs/common';

import { WishlistRepository } from './wishlist.repository';

@Injectable()
export class WishlistService {
	constructor(
		private readonly wishlistRepository: WishlistRepository,
	) { }

	async add(
		userId: string,
		productId: string,
	) {
		return this.wishlistRepository.add(
			userId,
			productId,
		);
	}

	async findAll(
		userId: string,
	) {
		const items =
			await this.wishlistRepository.findByUserId(
				userId,
			);

		return items.map((item) => ({
			productId: item.productId,
			name: item.product.name,
			price: Number(item.product.price),
			// imageUrl: item.product.imageUrl,
		}));
	}

	async check(
		userId: string,
		productId: string,
	) {
		const item =
			await this.wishlistRepository.findByUserAndProduct(
				userId,
				productId,
			);

		return {
			isFavorite: !!item,
		};
	}

	async remove(
		userId: string,
		productId: string,
	) {
		const item =
			await this.wishlistRepository.findByUserAndProduct(
				userId,
				productId,
			);

		if (!item) {
			throw new NotFoundException(
				'Wishlist item not found.',
			);
		}

		await this.wishlistRepository.remove(
			userId,
			productId,
		);

		return {
			productId,
		};
	}
}