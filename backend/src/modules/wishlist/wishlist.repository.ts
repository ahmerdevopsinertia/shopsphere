import { Injectable } from '@nestjs/common';
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class WishlistRepository {
	constructor(
		private readonly prisma: PrismaService,
	) { }

	async add(
		userId: string,
		productId: string,
	) {
		return this.prisma.wishlistItem.upsert({
			where: {
				userId_productId: {
					userId,
					productId,
				},
			},
			create: {
				userId,
				productId,
			},
			update: {},
		});
	}

	async findByUserId(
		userId: string,
	) {
		return this.prisma.wishlistItem.findMany({
			where: {
				userId,
			},
			include: {
				product: true,
			},
			orderBy: {
				createdAt: 'desc',
			},
		});
	}

	async findByUserAndProduct(
		userId: string,
		productId: string,
	) {
		return this.prisma.wishlistItem.findUnique({
			where: {
				userId_productId: {
					userId,
					productId,
				},
			},
		});
	}

	async remove(
		userId: string,
		productId: string,
	) {
		return this.prisma.wishlistItem.delete({
			where: {
				userId_productId: {
					userId,
					productId,
				},
			},
		});
	}
}