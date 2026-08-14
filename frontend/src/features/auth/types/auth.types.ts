export interface AuthUser {
	id: string;
	email: string;
	role: string;
}

export interface LoginRequest {
	email: string;
	password: string;
}

export interface LoginResponse {
	user: AuthUser;
	accessToken: string;
	refreshToken: string;
}

export interface RefreshTokenRequest {

	refreshToken: string;
}

export interface RefreshTokenResponse {
	accessToken: string;
	refreshToken: string;
}

export interface RegisterRequest {
	email: string;
	password: string;
}

