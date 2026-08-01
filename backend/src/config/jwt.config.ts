export default () => ({
	jwt: {
		secret: process.env.JWT_SECRET as string,
		expiresIn: process.env.JWT_EXPIRES_IN ?? '1h' as any,
		refreshExpiresIn:
			process.env.JWT_REFRESH_EXPIRES_IN ?? '7d' as any,
	},
});