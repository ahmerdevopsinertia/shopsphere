import { Injectable } from "@nestjs/common";
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
			},
		});
	}

	async findAll(skip: number, take: number) {

		return this.prisma.product.findMany({
			skip,
			take,
			include: {
				category: true
			},
			orderBy: {
				createdAt: 'desc'
			}
		});
	}

	async count() {
		return this.prisma.product.count();
	}
}