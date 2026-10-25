
import {
	Injectable,
	Logger,
	OnModuleDestroy,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
	DeleteMessageCommand,
	ReceiveMessageCommand,
	SQSClient,
} from '@aws-sdk/client-sqs';

type NotificationChannel = 'email' | 'sms';

interface NotificationRequestedEvent {
	eventId: string;
	eventType: 'notification.requested';
	eventVersion: number;
	occurredAt: string;
	source: string;
	data: {
		orderId: string;
		customerId: string;
		totalAmount: number;
		currency: string;
		items: Array<{
			productId: string;
			productName: string;
			quantity: number;
			unitPrice: number;
		}>;
	};
}

@Injectable()
export class SqsNotificationConsumerService
	implements OnModuleDestroy {
	private readonly logger = new Logger(
		SqsNotificationConsumerService.name,
	);

	private readonly sqsClient: SQSClient;
	private readonly activeLoops = new Set<NotificationChannel>();
	private shuttingDown = false;

	constructor(private readonly configService: ConfigService) {
		this.sqsClient = new SQSClient({
			region: this.configService.get<string>('aws.region', 'eu-west-2'),
		});
	}

	async pollQueue(
		queueUrl: string,
		channel: NotificationChannel,
	): Promise<void> {
		if (this.activeLoops.has(channel)) {
			throw new Error(
				`An SQS ${channel} consumer is already running.`,
			);
		}

		if (!queueUrl) {
			throw new Error(
				`SQS queue URL is not configured for ${channel}.`,
			);
		}

		this.activeLoops.add(channel);

		this.logger.log(
			`Starting ${channel.toUpperCase()} SQS consumer.`,
		);

		try {
			while (!this.shuttingDown) {
				try {
					const response = await this.sqsClient.send(
						new ReceiveMessageCommand({
							QueueUrl: queueUrl,
							MaxNumberOfMessages: 10,
							WaitTimeSeconds: 20,
							VisibilityTimeout: 30,
							MessageSystemAttributeNames: ['ApproximateReceiveCount'],
						}),
					);

					for (const message of response.Messages ?? []) {
						if (this.shuttingDown) {
							break;
						}

						if (!message.Body || !message.ReceiptHandle) {
							this.logger.warn(
								`Received an incomplete SQS message on ${channel}.`,
							);
							continue;
						}

						try {
							const event = this.parseNotification(message.Body);

							this.processNotification(event, channel);

							await this.sqsClient.send(
								new DeleteMessageCommand({
									QueueUrl: queueUrl,
									ReceiptHandle: message.ReceiptHandle,
								}),
							);

							this.logger.log(
								`Processed and deleted ${channel.toUpperCase()} ` +
								`notification for order ${event.data.orderId}.`,
							);
						} catch (error) {
							this.logger.error(
								`Failed to process ${channel.toUpperCase()} ` +
								`SQS message. It will remain available for retry.`,
								error instanceof Error ? error.stack : String(error),
							);
						}
					}
				} catch (error) {
					if (this.shuttingDown) {
						break;
					}

					this.logger.error(
						`Error polling ${channel.toUpperCase()} SQS queue.`,
						error instanceof Error ? error.stack : String(error),
					);

					// Avoid a tight retry loop during AWS/API failures.
					await new Promise((resolve) => setTimeout(resolve, 3000));
				}
			}
		} finally {
			this.activeLoops.delete(channel);
			this.logger.log(
				`Stopped ${channel.toUpperCase()} SQS consumer.`,
			);
		}
	}

	private parseNotification(
		body: string,
	): NotificationRequestedEvent {
		// SNS-to-SQS subscriptions normally wrap the event in an SNS envelope.
		const outer = JSON.parse(body) as Record<string, unknown>;

		const candidate =
			typeof outer.Message === 'string'
				? JSON.parse(outer.Message)
				: outer;

		if (
			!candidate ||
			candidate.eventType !== 'notification.requested' ||
			!candidate.data ||
			typeof candidate.data.orderId !== 'string' ||
			typeof candidate.data.customerId !== 'string' ||
			!Array.isArray(candidate.data.items)
		) {
			throw new Error('Invalid notification.requested event.');
		}

		return candidate as NotificationRequestedEvent;
	}

	private processNotification(
		event: NotificationRequestedEvent,
		channel: NotificationChannel,
	): void {
		const { orderId, customerId, totalAmount, currency } = event.data;

		if (channel === 'email') {
			this.logger.log(
				`[SIMULATED EMAIL] Order confirmation for order=${orderId}, ` +
				`customer=${customerId}, total=${totalAmount} ${currency}.`,
			);
			return;
		}

		this.logger.log(
			`[SIMULATED SMS] Order update for order=${orderId}, ` +
			`customer=${customerId}.`,
		);
	}

	async onModuleDestroy(): Promise<void> {
		this.shuttingDown = true;
		this.sqsClient.destroy();
	}
}
