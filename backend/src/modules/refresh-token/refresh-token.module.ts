import { Module } from '@nestjs/common';
import { RefreshTokenService } from './refresh-token.service';
import { RefreshTokenRepository } from './refresh-token.repository';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
	imports: [
		PrismaModule
	],
	providers: [
		RefreshTokenService,
		RefreshTokenRepository
	],
	exports: [
		RefreshTokenService
	]
})
export class RefreshTokenModule {}