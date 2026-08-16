export default () => ({
  app: {
    webOrigin: process.env.WEB_ORIGIN,
    httpMethods: [
      'GET',
      'HEAD',
      'PUT',
      'PATCH',
      'POST',
      'DELETE',
      'OPTIONS',
    ],
    port: parseInt(process.env.PORT ?? '3000', 10),
    nodeEnv: process.env.NODE_ENV ?? 'development',
    corsOrigin: process.env.CORS_ORIGIN ?? '*',
    logLevel: process.env.LOG_LEVEL || 'info',
    refreshCookieName:
      process.env.REFRESH_COOKIE_NAME ??
      'shopsphere_refresh_token',

    refreshCookieSecure:
      process.env.NODE_ENV ===
      'production',

    refreshCookieSameSite:
      process.env.NODE_ENV ===
        'production'
        ? 'strict'
        : 'lax',
  },
});