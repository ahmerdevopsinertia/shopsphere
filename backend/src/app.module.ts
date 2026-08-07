import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './modules/auth/auth.controller';
import { UsersController } from './modules/users/users.controller';
import { UsersService } from './modules/users/users.service';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { ProductsService } from './modules/products/products.service';
import { AuthModule } from './modules/auth/auth.module';
import { OrdersModule } from './modules/orders/orders.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { PrismaModule } from './prisma/prisma.module';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { ProfileModule } from './modules/profile/profile.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { CartModule } from './modules/cart/cart.module';
import { CheckoutModule } from './modules/checkout/checkout.module';
import { PaymentModule } from './modules/payment/payment.module';

import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';

import { validationSchema } from './config/validation';

import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { LoggerModule } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenModule } from './modules/refresh-token/refresh-token.module';

@Module({
  imports: [
    LoggerModule.forRootAsync({
      imports: [ConfigModule],

      inject: [ConfigService],

      useFactory: (
        configService: ConfigService,
      ) => ({
        pinoHttp: {

          transport: {
            target: 'pino-pretty',
            options: {
              colorize: true,
              singleLine: true,
            },
          },

          level:
            configService.get<string>(
              'app.logLevel',
            ) || 'info',

          // 🔒 Hide sensitive headers
          redact: [
            'req.headers.authorization',
            'req.headers.cookie',
            'req.headers.x-gateway-apikey',
             'req.body.refreshToken',
          ],
        },
      }),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [
        appConfig,
        databaseConfig,
        jwtConfig,
      ],
      validationSchema
    }),
    ThrottlerModule.forRoot(
      [
        {
          ttl: 6000,
          limit: 100
        }
      ]),
    AuthModule,
    PrismaModule,
    UsersModule,
    ProductsModule,
    OrdersModule,
    CategoriesModule,
    ProfileModule,
    InventoryModule,
    CartModule,
    CheckoutModule,
    PaymentModule,
    RefreshTokenModule,
  ],
  controllers: [AppController, AuthController, UsersController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    AppService, UsersService, ProductsService, JwtService],
})
export class AppModule { }
