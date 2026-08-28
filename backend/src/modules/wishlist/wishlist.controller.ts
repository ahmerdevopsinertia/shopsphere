import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Req,
	UseGuards,
} from '@nestjs/common';

import { WishlistService } from './wishlist.service';
import { AddWishlistItemDto } from './dto/add-wishlist-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('wishlist')
@UseGuards(JwtAuthGuard)
export class WishlistController {
	constructor(
		private readonly wishlistService: WishlistService,
	) { }

	@Post()
	async add(
		@Req() req: any,
		@Body() dto: AddWishlistItemDto,
	) {
		return this.wishlistService.add(
			req.user.sub,
			dto.productId,
		);
	}

	@Get()
	async findAll(
		@Req() req: any,
	) {
		return this.wishlistService.findAll(
			req.user.sub,
		);
	}

	@Get(':productId')
	async check(
		@Req() req: any,
		@Param('productId') productId: string,
	) {
		return this.wishlistService.check(
			req.user.sub,
			productId,
		);
	}

	@Delete(':productId')
	async remove(
		@Req() req: any,
		@Param('productId') productId: string,
	) {
		return this.wishlistService.remove(
			req.user.sub,
			productId,
		);
	}
}