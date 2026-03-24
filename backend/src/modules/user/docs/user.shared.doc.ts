import { applyDecorators } from '@nestjs/common';
import { AwsS3PresignDto } from '@/common/aws/dtos/aws.s3-presign.dto';
import {
  Doc,
  DocAuth,
  DocGuard,
  DocRequest,
  DocRequestFile,
  DocResponse,
} from '@/common/doc/decorators/doc.decorator';
import { EnumDocRequestBodyType } from '@/common/doc/enums/doc.enum';
import { FileSingleDto } from '@/common/file/dtos/file.single.dto';
import { UserChangePasswordRequestDto } from '@/modules/user/dtos/request/user.change-password.request.dto';
import { UserClaimUsernameRequestDto } from '@/modules/user/dtos/request/user.claim-username.request.dto';
import { UserGeneratePhotoProfileRequestDto } from '@/modules/user/dtos/request/user.generate-photo-profile.request.dto';
import {
  UserUpdateProfilePhotoRequestDto,
  UserUpdateProfileRequestDto,
} from '@/modules/user/dtos/request/user.profile.request.dto';

import { UserProfileResponseDto } from '@/modules/user/dtos/response/user.profile.response.dto';

export function UserSharedProfileDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get profile',
    }),
    DocGuard({
      termPolicy: true,
    }),
    DocAuth({
      xApiKey: true,
      jwtAccessToken: true,
    }),
    DocResponse<UserProfileResponseDto>('user.profile', {
      dto: UserProfileResponseDto,
    })
  );
}

export function UserSharedUpdateProfileDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'update profile',
    }),
    DocRequest({
      bodyType: EnumDocRequestBodyType.json,
      dto: UserUpdateProfileRequestDto,
    }),
    DocGuard({
      termPolicy: true,
    }),
    DocAuth({
      xApiKey: true,
      jwtAccessToken: true,
    }),
    DocResponse('user.updateProfile')
  );
}

export function UserSharedGeneratePhotoProfilePresignDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'generate upload photo profile presign',
    }),
    DocGuard({
      termPolicy: true,
    }),
    DocAuth({
      xApiKey: true,
      jwtAccessToken: true,
    }),
    DocRequest({
      bodyType: EnumDocRequestBodyType.json,
      dto: UserGeneratePhotoProfileRequestDto,
    }),
    DocResponse<AwsS3PresignDto>('user.generatePhotoProfilePresign', {
      dto: AwsS3PresignDto,
    })
  );
}

export function UserSharedUpdatePhotoProfileDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'update photo profile',
    }),
    DocGuard({
      termPolicy: true,
    }),
    DocAuth({
      xApiKey: true,
      jwtAccessToken: true,
    }),
    DocRequest({
      bodyType: EnumDocRequestBodyType.json,
      dto: UserUpdateProfilePhotoRequestDto,
    }),
    DocResponse('user.updatePhotoProfile')
  );
}

export function UserSharedUploadPhotoProfileDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'upload photo profile',
    }),
    DocGuard({
      termPolicy: true,
    }),
    DocAuth({
      xApiKey: true,
      jwtAccessToken: true,
    }),
    DocRequestFile({
      dto: FileSingleDto,
    }),
    DocResponse('user.uploadPhotoProfile')
  );
}

export function UserSharedChangePasswordDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'change password',
    }),
    DocGuard({
      termPolicy: true,
    }),
    DocAuth({
      xApiKey: true,
      jwtAccessToken: true,
    }),
    DocRequest({
      bodyType: EnumDocRequestBodyType.json,
      dto: UserChangePasswordRequestDto,
    }),
    DocResponse('user.changePassword')
  );
}

export function UserSharedClaimUsernameDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'user claim username',
    }),
    DocRequest({
      bodyType: EnumDocRequestBodyType.json,
      dto: UserClaimUsernameRequestDto,
    }),
    DocGuard({
      termPolicy: true,
    }),
    DocAuth({
      xApiKey: true,
      jwtAccessToken: true,
    }),
    DocResponse('user.claimUsername')
  );
}
