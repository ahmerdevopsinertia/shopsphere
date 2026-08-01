export default () => ({
  app: {
    webOrigin: process.env.WEB_ORIGIN,
    httpMethods: process.env.HTTP_METHODS,
    port: parseInt(process.env.PORT ?? '3000', 10),
    nodeEnv: process.env.NODE_ENV ?? 'development',
    corsOrigin: process.env.CORS_ORIGIN ?? '*',
    logLevel: process.env.LOG_LEVEL || 'info',
  },
});