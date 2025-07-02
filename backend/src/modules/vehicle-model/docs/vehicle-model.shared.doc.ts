import { applyDecorators } from '@nestjs/common';
import {
  Doc,
  DocAuth,
  DocRequest,
  DocResponse,
} from '@/common/doc/decorators/doc.decorator';
import { ENUM_DOC_REQUEST_BODY_TYPE } from '@/common/doc/enums/doc.enum';
import { AwsS3PresignRequestDto } from '@/modules/aws/dtos/request/aws.s3-presign.request.dto';
import { AwsS3PresignResponseDto } from '@/modules/aws/dtos/response/aws.s3-presign.response.dto';

export function VehicleModelSharedUploadPhotoDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get presign url for photo vehicle model',
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocResponse<AwsS3PresignResponseDto>('vehicle-model.uploadPhoto', {
      dto: AwsS3PresignResponseDto,
    }),
  );
}

export function VehicleModelSharedUpdatePhotoDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'update photo vehicle model',
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
