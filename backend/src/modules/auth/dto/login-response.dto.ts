export class LoginResponseDto {
	user: {
		id: string,
		email: string,
		role: string,
	}
	accessToken: string;
}