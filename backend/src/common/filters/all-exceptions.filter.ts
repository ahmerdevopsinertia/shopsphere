import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpException,
	Logger,
} from '@nestjs/common';


@Catch()
export class AllExceptionsFilter
	implements ExceptionFilter {


	private readonly logger = new Logger(
		'GlobalException'
	);


	catch(exception: unknown, host: ArgumentsHost) {


		const ctx = host.switchToHttp();

		const response = ctx.getResponse();

		const request = ctx.getRequest();


		const status =
			exception instanceof HttpException
				? exception.getStatus()
				: 500;



		const message =
			exception instanceof HttpException
				? exception.message
				: 'Internal server error';



		this.logger.error({

			method: request.method,

			url: request.url,

			statusCode: status,

			message,

			stack:
				exception instanceof Error
					? exception.stack
					: undefined,

		});



		response.status(status).json({

			success: false,

			statusCode: status,

			message,

			timestamp: new Date().toISOString(),

			path: request.url,

		});


	}

}