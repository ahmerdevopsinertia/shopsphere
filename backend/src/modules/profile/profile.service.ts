import { Injectable, NotFoundException } from '@nestjs/common';
import { ProfileRepository } from './profile.repository';
import { CreateProfileDto } from './dto/create-profile.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ProfileResponseDto } from './dto/profile-response.dto';

export interface JwtPayload {
	sub: string;
	email: string;
	role: string;
}

@Injectable()
export class ProfileService {
	constructor(private readonly profileRepository: ProfileRepository) { }

	async create(user: JwtPayload, dto: CreateProfileDto): Promise<ProfileResponseDto> {
		const profile = await this.profileRepository.create({
			userId: user.sub,
			firstName: dto.firstName,
			lastName: dto.lastName,
			phone: dto.phone,
		});

		return {
			id: profile.id,
			firstName: profile.firstName,
			lastName: profile.lastName,
			phone: profile.phone ?? undefined,
		};
	}

	async get(user: JwtPayload): Promise<ProfileResponseDto> {
		const profile = await this.profileRepository.findByUserId(user.sub);

		if (!profile) {
			throw new NotFoundException(
				'Profile not found.',
			);
		}

		return {
			id: profile.id,
			firstName: profile.firstName,
			lastName: profile.lastName,
			phone: profile.phone ?? undefined,
		};
	}
}
