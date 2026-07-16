import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { ProfileResponseDto } from './dto/profile-response.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('profile')
export class ProfileController {
	constructor(private readonly profileService: ProfileService) { }

	@Post()
	createProfile(@CurrentUser() user, @Body() dto: CreateProfileDto): Promise<ProfileResponseDto> {
		return this.profileService.create(user, dto);
	}

	@Get()
	getProfile(@CurrentUser() user): Promise<ProfileResponseDto> {
		return this.profileService.get(user);
	}
}
