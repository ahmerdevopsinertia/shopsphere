import { Body, Controller, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { RegisterResponseDto } from './dto/register-response.dto';
import { LoginDto } from './dto/login.dto';
import { Throttle } from '@nestjs/throttler';
import { LogoutDto } from './dto/logout-dto';
import type { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) { }
	// This is a test comment to check the CI/CD workflow
	@Post('register')
	@Throttle({
		default: {
			limit: 5,
			ttl: 60000,
		},
	})
	register(@Body() dto: RegisterDto): Promise<RegisterResponseDto> {
		return this.authService.register(dto);
	}

	@Post('login')
	@Throttle({
		default: {
			limit: 5,
			ttl: 60000,
		},
	})
	async login(@Body() dto: LoginDto, @Res({ passthrough: true }) response: Response) {
		const result: any = await this.authService.login(dto);

		this.setRefreshTokenCookie(
			response,
			result.refreshToken,
		);

		return {
			user: result.user,
			accessToken: result.accessToken
		}
	}

	@Post('refresh')
	async refresh(
		@Req() request: Request,
		@Res({ passthrough: true })
		response: Response,
	) {

		const refreshToken = request.cookies['shopsphere_refresh_token'];

		if (!refreshToken) {
			throw new UnauthorizedException(
				'Refresh token not found.',
			);
		}

		const result: any = await this.authService.refresh(refreshToken);

		this.setRefreshTokenCookie(response, result.refreshToken);

		return {
			user: result.user,
			accessToken:
				result.accessToken,
		};

	}

	@Post('logout')
	async logout(
		@Req() request: Request,
		@Res({ passthrough: true })
		response: Response,
	) {

		const refreshToken = request.cookies['shopsphere_refresh_token'];

		if (refreshToken) {
			await this.authService.logout(refreshToken);
		}

		this.clearRefreshTokenCookie(
			response,
		);

		return {
			message: 'Logged out successfully.'
		}
	}

	private setRefreshTokenCookie(
		response: Response,
		refreshToken: string,
	) {

		response.cookie(
			'shopsphere_refresh_token',
			refreshToken,
			{
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite:
					process.env.NODE_ENV === 'production'
						? 'strict'
						: 'lax',

				maxAge:
					30 *
					24 *
					60 *
					60 *
					1000,

				path: '/auth',
			},
		);
	}

	private clearRefreshTokenCookie(
		response: Response,
	) {
		response.clearCookie(
			'shopsphere_refresh_token',
			{
				httpOnly: true,
				secure:
					process.env.NODE_ENV ===
					'production',

				sameSite:
					process.env.NODE_ENV ===
						'production'
						? 'strict'
						: 'lax',

				path: '/auth',
			},
		);
	}
}
