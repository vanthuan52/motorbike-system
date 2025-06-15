import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Connection } from 'mongoose';
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
  MongooseHealthIndicator,
} from '@nestjs/terminus';
import {
  HealthAwsS3PrivateBucketIndicator,
  HealthAwsS3PublicBucketIndicator,
} from '../indicators/health.aws-s3.indicator';
import { InjectDatabaseConnection } from '@/common/database/decorators/database.decorator';
import {
  HealthSystemCheckAwsDoc,
  HealthSystemCheckDatabaseDoc,
  HealthSystemCheckInstanceDoc,
} from '../docs/health.system.doc';
import { Response } from '@/common/response/decorators/response.decorator';
import { ApiKeySystemProtected } from '@/modules/api-key/decorators/api-key.decorator';
import { IResponse } from '@/common/response/interfaces/response.interface';
import { HealthAwsResponseDto } from '../dtos/response/health.aws.response.dto';
import { HealthDatabaseResponseDto } from '../dtos/response/health.database.response.dto';
import { HealthInstanceResponseDto } from '../dtos/response/health.instance.response.dto';

@ApiTags('modules.system.health')
@Controller({
  version: VERSION_NEUTRAL,
  path: '/health',
})
export class HealthSystemController {
  constructor(
    @InjectDatabaseConnection() private readonly databaseConnection: Connection,
    private readonly health: HealthCheckService,
    private readonly memoryHealthIndicator: MemoryHealthIndicator,
    private readonly diskHealthIndicator: DiskHealthIndicator,
    private readonly mongooseIndicator: MongooseHealthIndicator,
    private readonly awsS3PublicBucketIndicator: HealthAwsS3PublicBucketIndicator,
    private readonly awsS3PrivateBucketIndicator: HealthAwsS3PrivateBucketIndicator,
  ) {}

  @HealthSystemCheckAwsDoc()
  @Response('health.checkAws')
  @HealthCheck()
  //@ApiKeySystemProtected()
  @Get('/aws')
  async checkAws(): Promise<IResponse<HealthAwsResponseDto>> {
    const data = await this.health.check([
      () => this.awsS3PublicBucketIndicator.isHealthy('s3PublicBucket'),
      () => this.awsS3PrivateBucketIndicator.isHealthy('s3PrivateBucket'),
    ]);

    return { data };
  }

  @HealthSystemCheckDatabaseDoc()
  @Response('health.checkDatabase')
  @HealthCheck()
  //@ApiKeySystemProtected()
  @Get('/database')
  async checkDatabase(): Promise<IResponse<HealthDatabaseResponseDto>> {
    const data = await this.health.check([
      () =>
        this.mongooseIndicator.pingCheck('database', {
          connection: this.databaseConnection,
        }),
    ]);
    return {
      data,
    };
  }

  @HealthSystemCheckInstanceDoc()
  @Response('health.checkInstance')
  @HealthCheck()
  //@ApiKeySystemProtected()
  @Get('/instance')
  async checkInstance(): Promise<IResponse<HealthInstanceResponseDto>> {
    const data = await this.health.check([
      () => this.memoryHealthIndicator.checkRSS('memoryRss', 300 * 1024 * 1024),
      () =>
        this.memoryHealthIndicator.checkHeap('memoryHeap', 300 * 1024 * 1024),
      () =>
        this.diskHealthIndicator.checkStorage('storage', {
          thresholdPercent: 0.75,
          path: '/',
        }),
    ]);

    return {
      data,
    };
  }
}
