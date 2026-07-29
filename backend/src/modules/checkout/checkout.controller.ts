import { Controller, Post, UseGuards } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JwtPayload } from '../profile/profile.service';

@Controller('checkout')
export class CheckoutController {
	constructor(private checkoutService: CheckoutService) { }

	@Post()
	@UseGuards(JwtAuthGuard)
	checkout(@CurrentUser() user: JwtPayload): Promise<any> {
		return this.checkoutService.checkout(user);
	}

}
