import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { RegisterResponseDto } from './dto/register-response.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) { }

	@Post('register')
	register(@Body() dto: RegisterDto): Promise<RegisterResponseDto> {
		return this.authService.register(dto);
	}

	@Post('login')
	login(@Body() dto: LoginDto): Promise<LoginResponseDto> {
		return this.authService.login(dto);
	}
}
