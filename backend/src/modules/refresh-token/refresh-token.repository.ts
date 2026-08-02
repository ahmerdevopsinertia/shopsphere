import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class RefreshTokenRepository {

  constructor(
    private readonly prisma: PrismaService,
  ) { }


  async create(data: {
    userId: string;
    tokenHash: string;
    expiresAt: Date;
  }) {

    return this.prisma.refreshToken.create({
      data,
    });

  }


  async findActiveTokensByUserId(
    userId: string
  ) {

    return this.prisma.refreshToken.findMany({
      where: {
        userId,
        revoked: false,
        expiresAt: {
          gt: new Date()
        }
      }
    });

  }


  async revoke(id: string) {

    return this.prisma.refreshToken.update({
      where: {
        id
      },
      data: {
        revoked: true
      }
    });

  }
}