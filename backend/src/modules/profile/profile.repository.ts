import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ProfileRepository {
	constructor(private readonly prisma: PrismaService) { }

	async create(data: any) {
		return this.prisma.userProfile.create({
			data,
		});
	}
	
	async findByUserId(userId: string) {
		return this.prisma.userProfile.findUnique({
			where: { userId },
		});
	}
}