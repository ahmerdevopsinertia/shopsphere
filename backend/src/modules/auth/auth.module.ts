import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RefreshTokenModule } from '../refresh-token/refresh-token.module';

@Module({
	imports: [
		UsersModule,
		RefreshTokenModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],

			useFactory: (configService: ConfigService) => {
				return {
					secret: configService.getOrThrow<string>('jwt.accessSecret'),
					signOptions: {
						expiresIn: configService.getOrThrow<any>('jwt.accessExpiresIn'),
					},
				};
			},
		}),
	],
	providers: [
		AuthService,
		JwtStrategy,
		JwtAuthGuard
	],
	exports: [
		AuthService
	]
})
export class AuthModule { }