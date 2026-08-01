import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpException,
	HttpStatus,
	Logger,
} from '@nestjs/common';

import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {

	private readonly logger = new Logger(GlobalExceptionFilter.name);

	catch(exception: unknown, host: ArgumentsHost): void {

		const ctx = host.switchToHttp();

		const request = ctx.getRequest<Request>();
		const response = ctx.getResponse<Response>();

		let status = HttpStatus.INTERNAL_SERVER_ERROR;
		let message = 'Internal server error.';


		if (exception instanceof HttpException) {

			status = exception.getStatus();

			const exceptionResponse = exception.getResponse();

			if (typeof exceptionResponse === 'string') {

				message = exceptionResponse;

			} else if (
				typeof exceptionResponse === 'object' &&
				exceptionResponse !== null
			) {

				const errorResponse = exceptionResponse as {
					message?: string | string[];
				};

				if (Array.isArray(errorResponse.message)) {

					message = errorResponse.message.join(', ');

				} else if (errorResponse.message) {

					message = errorResponse.message;

				}
			}
		}


		// Centralized error logging
		this.logger.error(
			`
🔥 Exception Occurred
Method: ${request.method}
URL: ${request.url}
Status: ${status}
Message: ${message}
Exception: ${exception instanceof Error ? exception.message : exception}
Stack:
${exception instanceof Error ? exception.stack : 'N/A'}
			`,
		);


		response.status(status).json({
			success: false,
			statusCode: status,
			message,
			timestamp: new Date().toISOString(),
			path: request.url,
		});
	}
}