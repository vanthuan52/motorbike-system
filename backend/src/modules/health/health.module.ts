import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { AwsModule } from '@/common/aws/aws.module';
import { HealthAwsS3BucketIndicator } from './indicators/health.aws-s3.indicator';
import { HealthAwsSESIndicator } from './indicators/health.aws-ses.indicator';
import { HealthDatabaseIndicator } from './indicators/health.database.indicator';
import { HealthRedisIndicator } from './indicators/health.redis.indicator';

@Module({
  providers: [
    HealthAwsS3BucketIndicator,
    HealthAwsSESIndicator,
    HealthDatabaseIndicator,
    HealthRedisIndicator,
  ],
  exports: [
    HealthAwsS3BucketIndicator,
    HealthAwsSESIndicator,
    HealthDatabaseIndicator,
    HealthRedisIndicator,
    TerminusModule,
  ],
  imports: [
    AwsModule,
    TerminusModule.forRoot({
      gracefulShutdownTimeoutMs: 30000,
    }),
  ],
})
export class HealthModule {}
