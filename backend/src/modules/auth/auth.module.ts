import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Module({
	imports: [
		UsersModule,

		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],

			useFactory: (configService: ConfigService) => {
				return {
					secret: configService.get<string>('JWT_SECRET'),
					signOptions: {
						expiresIn: '15m',
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