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
  aws: {
    region: process.env.AWS_REGION || 'eu-west-2',
    profile: process.env.AWS_PROFILE,
    snsTopicArn: process.env.SNS_TOPIC_ARN,
    sqsEmailQueueUrl: process.env.SQS_EMAIL_QUEUE_URL,
    sqsSmsQueueUrl: process.env.SQS_SMS_QUEUE_URL,
  }
});