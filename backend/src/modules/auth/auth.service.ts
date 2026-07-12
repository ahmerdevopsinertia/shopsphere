import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from '../users/users.repository';
import { RegisterDto } from './dto/register.dto'
import { RegisterResponseDto } from './dto/register-response.dto';
import { LoginResponseDto } from './dto/login-response.dto'
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
	constructor(
		private readonly usersRepository: UsersRepository,
		private readonly jwtService: JwtService) { }

	async register(registerDto: RegisterDto): Promise<RegisterResponseDto> {
		// 1. Check existing user
		const existingUser = await this.usersRepository.findByEmail(
			registerDto.email,
		);

		if (existingUser) {
			throw new ConflictException(
				'Email is already registered.',
			);
		}

		// 2. Hash password
		const passwordHash = await bcrypt.hash(registerDto.password, 12);

		// 3. Create user through repository
		const user = await this.usersRepository.create({
			email: registerDto.email,
			passwordHash
		});

		// 4. Return safe user data
		return {
			id: user.id,
			email: user.email,
			role: user.role,
			createdAt: user.createdAt,
		};
	}

	async login(loginDto: LoginDto): Promise<LoginResponseDto> {
		// 1. Check existing user
		const user = await this.usersRepository.findByEmail(
			loginDto.email,
		);

		if (!user) {
			throw new UnauthorizedException(
				'Invalid email or password.',
			);
		}

		// 2. Compare password
		const isPasswordValid = await bcrypt.compare(loginDto.password, user.passwordHash);

		if (!isPasswordValid) {
			throw new UnauthorizedException(
				'Invalid email or password.',
			);
		}

		// 3. Signing JWT
		const accessToken = this.jwtService.sign(({
			sub: user.id,
			email: user.email,
			role: user.role
		}));

		// 4. Return user object
		return {
			user: {
				id: user.id,
				email: user.email,
				role: user.role
			},
			accessToken,
		};
	}
}
