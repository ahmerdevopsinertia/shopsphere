import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class KafkaProducerService {
  constructor(
    @Inject('KAFKA_SERVICE')
    private readonly kafkaClient: ClientKafka,
  ) { }

  async publish<T>(topic: string, message: T, key?: string): Promise<void> {
    await this.kafkaClient.emit(topic, { key, value: message }).toPromise();
  }
}