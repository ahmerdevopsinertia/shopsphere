import * as Joi from 'joi';

export const validationSchema = Joi.object({
	PORT: Joi.number().default(3000),
	DATABASE_URL: Joi.string().required(),
	JWT_ACCESS_SECRET: Joi.string().required(),
	JWT_ACCESS_EXPIRES_IN: Joi.string().default('1h'),
	JWT_REFRESH_EXPIRES_IN: Joi.string().default('7d'),
	NODE_ENV: Joi.string()
		.valid(
			'development',
			'production',
			'test',
		)
		.default('development'),
	CORS_ORIGIN: Joi.string().default('*'),
	AWS_REGION: Joi.string().default('eu-west-2'),
	AWS_PROFILE: Joi.string().optional(),
	SNS_TOPIC_ARN: Joi.string().optional(),
	SQS_EMAIL_QUEUE_URL: Joi.string().optional(),
	SQS_SMS_QUEUE_URL: Joi.string().optional(),
});