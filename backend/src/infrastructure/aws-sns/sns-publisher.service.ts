
import {
	Injectable,
	InternalServerErrorException,
	Logger,
	ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';

export interface NotificationRequestedEvent {
  eventId: string;
  eventType: 'notification.requested';
  eventVersion: 1;
  occurredAt: string;
  source: 'shopsphere-notification-service';
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
export class SnsPublisherService {
	private readonly logger = new Logger(SnsPublisherService.name);
	private readonly snsClient: SNSClient;

	constructor(private readonly configService: ConfigService) {
		this.snsClient = new SNSClient({
			region:
				this.configService.get<string>('aws.region') ?? 'eu-west-2',
		});
	}

	async publishNotification(
		event: NotificationRequestedEvent,
	): Promise<{ messageId: string }> {
		const topicArn = this.configService.get<string>('aws.snsTopicArn');

		if (!topicArn) {
			throw new ServiceUnavailableException(
				'SNS_TOPIC_ARN is not configured',
			);
		}

		try {
			const result = await this.snsClient.send(
				new PublishCommand({
					TopicArn: topicArn,
					Subject: 'ShopSphere Notification',
					Message: JSON.stringify(event),
					MessageAttributes: {
						eventType: {
							DataType: 'String',
							StringValue: event.eventType,
						},
					},
				}),
			);

			if (!result.MessageId) {
				throw new Error('SNS did not return a message ID');
			}

			this.logger.log(
				`Notification event published successfully: ${result.MessageId}`,
			);

			return { messageId: result.MessageId };
		} catch (error) {
			if (error instanceof ServiceUnavailableException) {
				throw error;
			}

			this.logger.error(
				'Failed to publish notification event to SNS',
				error instanceof Error ? error.stack : undefined,
			);

			throw new InternalServerErrorException(
				'Failed to publish notification event',
			);
		}
	}
}
