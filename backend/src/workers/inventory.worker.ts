import { NestFactory } from '@nestjs/core';
import {
	MicroserviceOptions,
	Transport,
} from '@nestjs/microservices';
import { InventoryWorkerModule } from './inventory-worker.module';

async function bootstrap() {
	const app =
		await NestFactory.createMicroservice<MicroserviceOptions>(
			InventoryWorkerModule,
			{
				transport: Transport.KAFKA,
				options: {
					client: {
						clientId: 'shopsphere-inventory-consumer',
						brokers: ['localhost:9092'],
					},
					consumer: {
						groupId: 'shopsphere-order-inventory',
					},
				},
			},
		);

	await app.listen();
}

bootstrap();