
import { Module } from '@nestjs/common';
import { SnsPublisherService } from './sns-publisher.service';

@Module({
  providers: [SnsPublisherService],
  exports: [SnsPublisherService],
})
export class AwsSnsModule { }
