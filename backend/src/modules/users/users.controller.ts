import { Controller, Get, Post, Body, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterDto } from '../auth/dto/register.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('users')
export class UsersController {

	constructor(private readonly usersService: UsersService) { }

	@Get('test-create')
	testCreate() {
		return this.usersService.testCreateUser();
	}

	@Get('test-get')
	testGet() {
		return this.usersService.testGetUsers();
	}

	@Post('test-validationpipe')
	test(
		@Body() dto: RegisterDto
	) {
		return dto;
	}

	@UseGuards(JwtAuthGuard)
	@Get('profile')
	profile(@CurrentUser() user) {
		return user;
	}
}
