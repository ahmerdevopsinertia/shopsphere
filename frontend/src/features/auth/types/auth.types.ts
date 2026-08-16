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
}

export interface RefreshTokenRequest {

	refreshToken: string;
}

export interface RefreshTokenResponse {
	accessToken: string;
}

export interface RegisterRequest {
	email: string;
	password: string;
}

