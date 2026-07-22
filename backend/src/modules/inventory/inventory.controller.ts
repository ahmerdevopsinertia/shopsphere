import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorators';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { InventoryResponseDto } from './dto/inventory-response.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';

@Controller('inventory')
export class InventoryController {
	constructor(private readonly inventoryService: InventoryService) { }

	@Post()
	@UseGuards(
		JwtAuthGuard,
		RolesGuard,
	)
	@Roles('ADMIN')
	create(@Body() dto: CreateInventoryDto): Promise<InventoryResponseDto> {
		return this.inventoryService.create(dto);
	}

	@Roles('ADMIN')
	@Get(':productId')
	get(@Param('productId', new ParseUUIDPipe()) productId: string): Promise<InventoryResponseDto> {
		return this.inventoryService.getByProductId(productId);
	}

	@Patch(':productId')
	update(
		@Param(
			'productId',
			new ParseUUIDPipe(),
		)
		productId: string,

		@Body()
		dto: UpdateInventoryDto,
	) {
		return this.inventoryService.update(
			productId,
			dto,
		);
	}
}
