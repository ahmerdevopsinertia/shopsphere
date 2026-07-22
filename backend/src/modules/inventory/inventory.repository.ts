import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class InventoryRepository {
  constructor(private readonly prisma: PrismaService) { }

  async findByProductId(productId: string) {
    return this.prisma.inventory.findUnique({
      where: {
        productId,
      },
    });
  }

  async create(data: any) {
    return this.prisma.inventory.create({
      data,
    });
  }

  async update(
    productId: string,
    change: number,
  ) {
    return this.prisma.inventory.update({
      where: {
        productId,
      },
      data: {
        quantity: { increment: change },
      },
    });
  }
}