import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import {
  HealthAwsS3PrivateBucketIndicator,
  HealthAwsS3PublicBucketIndicator,
} from './indicators/health.aws-s3.indicator';
import { AwsModule } from '../aws/aws.module';

@Module({
  providers: [
    HealthAwsS3PublicBucketIndicator,
    HealthAwsS3PrivateBucketIndicator,
  ],
  exports: [
    HealthAwsS3PublicBucketIndicator,
    HealthAwsS3PrivateBucketIndicator,
    TerminusModule,
  ],
  imports: [
    AwsModule,
    TerminusModule.forRoot({
      gracefulShutdownTimeoutMs: 1000,
    }),
  ],
})
export class HealthModule {}
