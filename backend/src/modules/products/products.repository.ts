import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ProductsRepository {
	constructor(private readonly prisma: PrismaService) { }

	async findBySku(sku: string) {
		return this.prisma.product.findUnique({
			where: { sku },
		});
	}

	async create(data: any) {
		return this.prisma.product.create({
			data,
			include: {
				category: true
			}
		});
	}

	async findById(id: string) {
		return this.prisma.product.findUnique({
			where: {
				id,
			},
			include: {
				category: true,
				inventory: true,
			},
		});
	}

	async findAll(
		skip: number,
		take: number,
		search?: string,
		categoryId?: string,
	) {
		const where: Prisma.ProductWhereInput = {};

		if (search?.trim()) {
			const searchValue =
				search.trim();

			where.OR = [
				{
					name: {
						contains: searchValue,
						mode: 'insensitive',
					},
				},
				{
					sku: {
						contains: searchValue,
						mode: 'insensitive',
					},
				},
			];
		}

		if (categoryId) {
			where.categoryId = categoryId;
		}

		return this.prisma.product.findMany({
			where,

			skip,
			take,

			include: {
				category: true,
				inventory: true,
			},

			orderBy: {
				createdAt: 'desc',
			},
		});
	}

	async count(
		search?: string,
		categoryId?: string,
	) {
		const where: Prisma.ProductWhereInput = {};

		if (search?.trim()) {
			const searchValue = search.trim();

			where.OR = [
				{
					name: {
						contains: searchValue,
						mode: 'insensitive',
					},
				},
				{
					sku: {
						contains: searchValue,
						mode: 'insensitive',
					},
				},
			];
		}

		if (categoryId) {
			where.categoryId = categoryId;
		}

		return this.prisma.product.count({
			where,
		});
	}
}