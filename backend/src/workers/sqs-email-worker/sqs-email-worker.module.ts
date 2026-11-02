
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import appConfig from '../../config/app.config';
import { AwsSqsModule } from '../../infrastructure/aws-sqs/aws-sqs.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
    AwsSqsModule,
  ],
})
export class SqsEmailWorkerModule {}
