import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {

	constructor(private readonly usersRepository: UsersRepository) { }

	async testCreateUser() {
		return this.usersRepository.create({
			email: 'test@example.com',
			password: 'test123',
			role: 'CUSTOMER',
		});
	}

	async testGetUsers() {
		return this.usersRepository.findByEmail('test@example.com');
	}
}
