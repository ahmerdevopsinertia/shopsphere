import { Injectable } from '@nestjs/common';
import { RefreshTokenRepository } from './refresh-token.repository';

@Injectable()
export class RefreshTokenService {

	constructor(
		private readonly repository: RefreshTokenRepository
	) { }

	async create(data: {
		userId: string;
		tokenHash: string;
		expiresAt: Date;
	}) {
		return this.repository.create(data);
	}


	async findActiveTokensByUserId(
		userId: string
	) {
		return this.repository
			.findActiveTokensByUserId(userId);
	}


	async revoke(id: string) {
		return this.repository.revoke(id);
	}

}