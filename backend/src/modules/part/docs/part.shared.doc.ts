import { applyDecorators } from '@nestjs/common';

import {
  Doc,
  DocAuth,
  DocRequest,
  DocResponse,
} from '@/common/doc/decorators/doc.decorator';
import { ENUM_DOC_REQUEST_BODY_TYPE } from '@/common/doc/enums/doc.enum';
import { AwsS3PresignResponseDto } from '@/modules/aws/dtos/response/aws.s3-presign.response.dto';
import { AwsS3PresignRequestDto } from '@/modules/aws/dtos/request/aws.s3-presign.request.dto';

export function PartSharedUploadPhotoDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get presign url for photo of a part',
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocResponse<AwsS3PresignResponseDto>('vehicle-model.uploadPhoto', {
      dto: AwsS3PresignResponseDto,
    }),
  );
}

export function PartSharedUpdatePhotoDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'update photo of a part',
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocRequest({
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      dto: AwsS3PresignRequestDto,
    }),
    DocResponse('vehicle-model.updatePhoto'),
  );
}
