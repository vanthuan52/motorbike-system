import { applyDecorators } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import {
  Doc,
  DocRequest,
  DocResponse,
} from '@/common/doc/decorators/doc.decorator';
import { ENUM_AWS_S3_ACCESSIBILITY } from '@/modules/aws/enums/aws.enum';
import { AwsS3PresignResponseDto } from '@/modules/aws/dtos/response/aws.s3-presign.response.dto';

interface DocField {
  name: string;
  allowEmptyValue: boolean;
  required: boolean;
  type: string;
  example: any;
  description?: string;
}

export const AwsS3DocParamsKey: DocField[] = [
  {
    name: 'key',
    allowEmptyValue: false,
    required: true,
    type: 'string',
    example: faker.system.filePath(),
  },
];

export const FileAwsS3PresignGetDocQueryKey: DocField[] = [
  {
    name: 'key',
    allowEmptyValue: false,
    required: true,
    type: 'string',
    example: faker.system.filePath(),
    description: 'An AWS S3 object key',
  },
];

export const FileAwsS3PresignGetDocQueryAccess: DocField[] = [
  {
    name: 'access',
    allowEmptyValue: false,
    required: true,
    type: 'string',
    example: ENUM_AWS_S3_ACCESSIBILITY.PRIVATE,
    description: 'Public or private access',
  },
];

export function FileAwsS3PresignGetResponseDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'Return presign get object',
    }),
    DocRequest({
      queries: [
        ...FileAwsS3PresignGetDocQueryKey,
        ...FileAwsS3PresignGetDocQueryAccess,
      ],
    }),
    DocResponse<AwsS3PresignResponseDto>('file.expose', {
      dto: AwsS3PresignResponseDto,
    }),
  );
}
