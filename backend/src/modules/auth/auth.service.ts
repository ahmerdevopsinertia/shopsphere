import { ConflictException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from '../users/users.repository';
import { RegisterDto } from './dto/register.dto'
import { RegisterResponseDto } from './dto/register-response.dto';
import { LoginResponseDto } from './dto/login-response.dto'
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenService } from '../refresh-token/refresh-token.service';
import { LogoutDto } from './dto/logout-dto';

@Injectable()
export class AuthService {
	prisma: any;
	constructor(
		private readonly usersRepository: UsersRepository,
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
		private readonly refreshTokenService: RefreshTokenService) { }

	private readonly logger = new Logger(AuthService.name);

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

		// 3. JWT Payload
		const accessPayload = {
			sub: user.id,
			email: user.email,
			role: user.role,
		};

		// 4. Generate Access Token
		const accessToken =
			await this.jwtService.signAsync(
				accessPayload,
				{
					secret:
						this.configService.getOrThrow<string>(
							'jwt.accessSecret'
						),
					expiresIn: this.configService.getOrThrow<any>(
						'jwt.accessExpiresIn'
					)
				}
			);

		// 5. Generate Refresh Token
		const refreshTokenId =
			crypto.randomUUID();

		const refreshPayload = {
			sub: user.id,
			jti: refreshTokenId
		};

		const refreshToken =
			await this.jwtService.signAsync(
				refreshPayload,
				{
					secret:
						this.configService.getOrThrow<string>(
							'jwt.refreshSecret'
						),
					expiresIn: this.configService.getOrThrow<any>(
						'jwt.refreshExpiresIn'
					)
				}
			);


		// 6. Hash Refresh Token
		const refreshTokenHash =
			await bcrypt.hash(
				refreshTokenId,
				10
			);

		await this.refreshTokenService.create({
			tokenHash: refreshTokenHash,
			userId: user.id,
			expiresAt:
				new Date(
					Date.now()
					+
					30 * 24 * 60 * 60 * 1000
				)
		});

		return {
			user: {
				id: user.id,
				email: user.email,
				role: user.role
			},
			accessToken,
			refreshToken
		};
	}

	async refresh(
		dto: RefreshTokenDto
	) {

		this.logger.debug(
			'Refresh token validation started'
		);

		let payload: any;


		// 1. Verify refresh token
		try {

			payload =
				await this.jwtService.verifyAsync(
					dto.refreshToken,
					{
						secret:
							this.configService.get(
								'jwt.refreshSecret'
							)
					}
				);

			this.logger.debug({
				userId: payload.sub,
				jti: payload.jti
			},
				'Refresh token verified'
			);

		}
		catch (error) {

			throw new UnauthorizedException(
				'Invalid refresh token.'
			);

		}



		// 2. Get user's active refresh tokens

		const tokens =
			await this.refreshTokenService
				.findActiveTokensByUserId(
					payload.sub
				);



		// 3. Find matching token

		let storedToken:
			typeof tokens[number] | null = null;


		for (const token of tokens) {

			const isValid =
				await bcrypt.compare(
					payload.jti,
					token.tokenHash
				);


			if (isValid) {

				storedToken = token;
				break;

			}

		}



		if (!storedToken) {

			throw new UnauthorizedException(
				'Refresh token revoked or expired.'
			);

		}


		// 4. Revoke old refresh token

		await this.refreshTokenService.revoke(
			storedToken.id
		);

		this.logger.log({
			userId: payload.sub,
			oldTokenId: storedToken.id,
		},
			'Refresh token revoked');


		// 5. Generate new tokens

		const user =
			await this.usersRepository.findById(
				payload.sub
			);


		if (!user) {

			throw new UnauthorizedException(
				'User not found.'
			);

		}

		const accessToken =
			await this.jwtService.signAsync(
				{
					sub: user.id,
					email: user.email,
					role: user.role
				},
				{
					secret:
						this.configService.get(
							'jwt.accessSecret'
						),
					expiresIn:
						this.configService.get(
							'jwt.accessExpiresIn'
						)
				}
			);

		const refreshTokenId =
			crypto.randomUUID();

		const refreshToken =
			await this.jwtService.signAsync(
				{
					sub: user.id,
					jti: refreshTokenId
				},
				{
					secret:
						this.configService.get(
							'jwt.refreshSecret'
						),
					expiresIn:
						this.configService.get(
							'jwt.refreshExpiresIn'
						)
				}
			);


		const refreshTokenHash =
			await bcrypt.hash(
				refreshTokenId,
				10
			);


		await this.refreshTokenService.create({
			userId: user.id,
			tokenHash: refreshTokenHash,
			expiresAt:
				new Date(
					Date.now()
					+
					30 * 24 * 60 * 60 * 1000
				)
		});


		this.logger.log({
			userId: user.id,
		},
			'Refresh token rotated');

		return {
			accessToken,
			refreshToken
		};

	}

	async logout(
		dto: LogoutDto
	) {

		this.logger.debug(
			'Refresh token validation started'
		);

		let payload: any;


		// 1. Verify refresh token
		try {

			payload =
				await this.jwtService.verifyAsync(
					dto.refreshToken,
					{
						secret:
							this.configService.get(
								'jwt.refreshSecret'
							)
					}
				);

			this.logger.debug({
				userId: payload.sub,
				jti: payload.jti
			},
				'Refresh token verified'
			);

		}
		catch (error) {

			throw new UnauthorizedException(
				'Invalid refresh token.'
			);

		}

		// 2. Get user's active refresh tokens

		const tokens =
			await this.refreshTokenService
				.findActiveTokensByUserId(
					payload.sub
				);

		// 3. Find matching token

		let storedToken:
			typeof tokens[number] | null = null;


		for (const token of tokens) {

			const isValid =
				await bcrypt.compare(
					payload.jti,
					token.tokenHash
				);


			if (isValid) {

				storedToken = token;
				break;

			}

		}



		if (!storedToken) {

			throw new UnauthorizedException(
				'Refresh token revoked or expired.'
			);

		}


		// 4. Revoke old refresh token

		await this.refreshTokenService.revoke(
			storedToken.id
		);

		this.logger.log({
			userId: payload.sub,
			tokenId: storedToken.id,
		},
			'User logged out');

		return {
			message:
				'Logged out successfully.',
		};
	}
}
