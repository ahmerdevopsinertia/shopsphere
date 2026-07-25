import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../profile/profile.service';
import { OrderResponseDto } from './dto/order-response.dto';
import { OrderQueryDto } from './dto/order-query-dto';
import { OrderListResponseDto } from './dto/order-list-response.dto';
import { Roles } from 'src/common/decorators/roles.decorators';
import { Role } from '@prisma/client';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('orders')
export class OrdersController {
	constructor(private readonly orderService: OrdersService) { }

	@Post()
	@UseGuards(JwtAuthGuard)
	createOrder(@CurrentUser() user: JwtPayload, @Body() dto: CreateOrderDto): Promise<OrderResponseDto> {
		return this.orderService.create(user, dto);
	}

	@Get(':id')
	@UseGuards(JwtAuthGuard)
	findById(
		@CurrentUser() user: JwtPayload,
		@Param('id') id: string,
	): Promise<OrderResponseDto> {
		return this.orderService.findOne(
			user,
			id,
		);
	}

	@Get()
	@UseGuards(JwtAuthGuard)
	findAll(@CurrentUser() user: JwtPayload, @Query() query: OrderQueryDto): Promise<OrderListResponseDto> {
		return this.orderService.findAll(user, query.page ?? 1, query.limit ?? 10, query.search ?? '');
	}

	@Patch(':id/status')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Role.ADMIN)
	updateStatus(
		@Param('id')
		orderId: string,
		@Body()
		dto: UpdateOrderStatusDto,
	): Promise<OrderResponseDto> {
		return this.orderService.updateStatus(
			orderId,
			dto,
		);
	}
}


