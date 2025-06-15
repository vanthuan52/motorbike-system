import {
  Doc,
  DocAuth,
  DocResponse,
} from '@/common/doc/decorators/doc.decorator';
import { applyDecorators } from '@nestjs/common';
import { HealthAwsResponseDto } from '../dtos/response/health.aws.response.dto';
import { HealthDatabaseResponseDto } from '../dtos/response/health.database.response.dto';
import { HealthInstanceResponseDto } from '../dtos/response/health.instance.response.dto';

export function HealthSystemCheckAwsDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'health check api for aws',
    }),
    DocAuth({
      xApiKey: false,
    }),
    DocResponse<HealthAwsResponseDto>('health.checkAws', {
      dto: HealthAwsResponseDto,
    }),
  );
}

export function HealthSystemCheckDatabaseDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'health check api for database',
    }),
    DocAuth({
      xApiKey: false,
    }),
    DocResponse<HealthDatabaseResponseDto>('health.checkDatabase', {
      dto: HealthDatabaseResponseDto,
    }),
  );
}

export function HealthSystemCheckInstanceDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'health check api for instance',
    }),
    DocAuth({
      xApiKey: false,
    }),
    DocResponse<HealthInstanceResponseDto>('health.checkInstance', {
      dto: HealthInstanceResponseDto,
    }),
  );
}
