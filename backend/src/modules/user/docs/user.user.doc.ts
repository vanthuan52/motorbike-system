import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  UserDocParamsId,
  UserDocQueryList,
} from '../constants/user.doc.constant';
import {
  Doc,
  DocAuth,
  DocGuard,
  DocRequest,
  DocRequestFile,
  DocResponse,
  DocResponseFile,
} from '@/common/doc/decorators/doc.decorator';
import { UserProfileResponseDto } from '../dtos/response/user.profile.response.dto';
import { EnumDocRequestBodyType } from '@/common/doc/enums/doc.enum';
import { UserUpdateRequestDto } from '../dtos/request/user.update.request.dto';
import { AwsS3PresignRequestDto } from '@/common/aws/dtos/request/aws.s3-presign.request.dto';
import { UserGeneratePhotoProfileRequestDto } from '../dtos/request/user.generate-photo-profile.request.dto';
import { AwsS3PresignDto } from '@/common/aws/dtos/aws.s3-presign.dto';
import { FileSingleDto } from '@/common/file/dtos/file.single.dto';
import { EnumFileExtensionDocument } from '@/common/file/enums/file.enum';

export function UserUserProfileDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get profile',
    }),
    DocAuth({
      xApiKey: false,
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<UserProfileResponseDto>('user.profile', {
      dto: UserProfileResponseDto,
    }),
  );
}

export function UserUserUpdateProfileDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'update profile',
    }),
    DocRequest({
      bodyType: EnumDocRequestBodyType.json,
      dto: UserUpdateRequestDto,
    }),
    DocAuth({
      xApiKey: false,
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: false }),
    DocResponse('user.updateProfile'),
  );
}

export function UserUserGeneratePhotoProfilePresignDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'generate upload photo profile presign',
    }),
    DocAuth({
      xApiKey: false,
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: false }),
    DocRequest({
      bodyType: EnumDocRequestBodyType.json,
      dto: UserGeneratePhotoProfileRequestDto,
    }),
    DocResponse<AwsS3PresignDto>('user.generatePhotoProfilePresign', {
      dto: AwsS3PresignDto,
    }),
  );
}

export function UserUserUpdatePhotoProfileDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'update photo profile',
    }),
    DocAuth({
      xApiKey: false,
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: false }),
    DocRequest({
      bodyType: EnumDocRequestBodyType.json,
      dto: AwsS3PresignRequestDto,
    }),
    DocResponse('user.updatePhotoProfile'),
  );
}

export function UserUserUploadPhotoProfileDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'upload photo profile',
    }),
    DocAuth({
      xApiKey: false,
      jwtAccessToken: true,
    }),
    DocRequestFile({
      dto: FileSingleDto,
    }),
    DocResponse('user.uploadPhotoProfile'),
  );
}

export function UserUserUpdatePasswordDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'update password of user',
    }),
    DocRequest({
      params: UserDocParamsId,
    }),
    DocAuth({
      xApiKey: false,
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: false }),
    DocResponse('user.updatePassword'),
  );
}

export function UserResetTwoFactorDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: "Reset user's two-factor authentication",
    }),
    DocRequest({
      params: UserDocParamsId,
    }),
    DocAuth({
      xApiKey: false,
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: false }),
    DocResponse('user.twoFactor.reset'),
  );
}

export function UserImportDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'import users via csv file',
    }),
    DocRequestFile({
      dto: FileSingleDto,
    }),
    DocAuth({
      xApiKey: true,
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('user.import', {
      httpStatus: HttpStatus.CREATED,
    }),
  );
}

export function UserExportDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'export users via csv file',
    }),
    DocRequest({
      queries: UserDocQueryList,
    }),
    DocAuth({
      xApiKey: true,
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponseFile({
      extension: EnumFileExtensionDocument.csv,
    }),
  );
}
