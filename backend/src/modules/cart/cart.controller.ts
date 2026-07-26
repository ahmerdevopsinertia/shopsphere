import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JwtPayload } from '../profile/profile.service';
import { CartResponseDto } from './dto/cart-response.dto';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartQuantityDto } from './dto/update-cart-quantity.dto';
import { ReplaceCartItemsDto } from './dto/replace-cart-item.dto';

@Controller('cart')
export class CartController {
	constructor(private readonly cartService: CartService) { }

	@Post()
	@UseGuards(JwtAuthGuard)
	addToCart(@CurrentUser() user: JwtPayload, @Body() dto: AddCartItemDto): Promise<CartResponseDto> {
		return this.cartService.createCart(user, dto);
	}

	@Get()
	@UseGuards(JwtAuthGuard)
	getCart(@CurrentUser() user: JwtPayload): Promise<CartResponseDto> {
		return this.cartService.getCart(user);
	}

	@Patch('items/:productId')
	@UseGuards(JwtAuthGuard)
	updateQuantity(
		@CurrentUser() user: JwtPayload,
		@Param('productId') productId: string,
		@Body() dto: UpdateCartQuantityDto): Promise<CartResponseDto> {
		return this.cartService.updateQuantity(user, productId, dto);
	}

	@Delete('items/:productId')
	@UseGuards(JwtAuthGuard)
	removeItem(
		@CurrentUser() user: JwtPayload,
		@Param('productId') productId: string): Promise<CartResponseDto> {
		return this.cartService.removeItem(user, productId);
	}

	@Put('items')
	@UseGuards(JwtAuthGuard)
	async replaceItems(
		@CurrentUser() user: JwtPayload,
		@Body() dto: ReplaceCartItemsDto
	): Promise<CartResponseDto> {
		return this.cartService.replaceItems(user, dto);
	}
}
