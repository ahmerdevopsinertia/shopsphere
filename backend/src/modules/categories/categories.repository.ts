import { Injectable, UseGuards } from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorators';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Injectable()
export class CategoriesRepository {

	constructor(
		private readonly prisma: PrismaService,
	) { }

	@UseGuards(
		JwtAuthGuard,
		RolesGuard,
	)
	@Roles('ADMIN')
	async create(data: any) {
		return this.prisma.category.create({ data });
	}

	async findById(id: string) {
		return this.prisma.category.findUnique({
			where: {
				id,
			},
		});
	}

	async findAll() {
		return this.prisma.category.findMany({
			orderBy: {
				createdAt: 'desc',
			},
		});
	}

	async findBySlug(slug: string) {
		return this.prisma.category.findUnique({
			where: {
				slug,
			},
		});
	}
}