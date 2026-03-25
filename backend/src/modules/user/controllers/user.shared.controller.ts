import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  UploadedFile,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AwsS3PresignDto } from '@/common/aws/dtos/aws.s3-presign.dto';
import { FileUploadSingle } from '@/common/file/decorators/file.decorator';
import { EnumFileExtensionImage } from '@/common/file/enums/file.enum';
import { IFile } from '@/common/file/interfaces/file.interface';
import { FileExtensionPipe } from '@/common/file/pipes/file.extension.pipe';
import {
  RequestGeoLocation,
  RequestIPAddress,
  RequestTimeout,
  RequestUserAgent,
} from '@/common/request/decorators/request.decorator';
import { RequestRequiredPipe } from '@/common/request/pipes/request.required.pipe';
import { Response } from '@/common/response/decorators/response.decorator';
import { IResponseReturn } from '@/common/response/interfaces/response.interface';
import { ApiKeyProtected } from '@/modules/api-key/decorators/api-key.decorator';
import {
  AuthJwtAccessProtected,
  AuthJwtPayload,
} from '@/modules/auth/decorators/auth.jwt.decorator';
import { UserProtected } from '@/modules/user/decorators/user.decorator';
import {
  UserSharedClaimUsernameDoc,
  UserSharedGeneratePhotoProfilePresignDoc,
  UserSharedProfileDoc,
  UserSharedUpdatePhotoProfileDoc,
  UserSharedUpdateProfileDoc,
  UserSharedUploadPhotoProfileDoc,
} from '@/modules/user/docs/user.shared.doc';
import { UserClaimUsernameRequestDto } from '@/modules/user/dtos/request/user.claim-username.request.dto';
import { UserGeneratePhotoProfileRequestDto } from '@/modules/user/dtos/request/user.generate-photo-profile.request.dto';
import {
  UserUpdateProfilePhotoRequestDto,
  UserUpdateProfileRequestDto,
} from '@/modules/user/dtos/request/user.profile.request.dto';
import { UserProfileResponseDto } from '@/modules/user/dtos/response/user.profile.response.dto';
import { UserService } from '@/modules/user/services/user.service';
import {
  GeoLocation,
  UserAgent,
} from '@/modules/user/interfaces/user.interface';

@ApiTags('modules.shared.user')
@Controller({
  version: '1',
  path: '/user',
})
export class UserSharedController {
  constructor(private readonly userService: UserService) {}

  @UserSharedProfileDoc()
  @Response('user.profile')
  @UserProtected()
  @AuthJwtAccessProtected()
  @ApiKeyProtected()
  @Get('/profile')
  async profile(
    @AuthJwtPayload('userId')
    userId: string
  ): Promise<IResponseReturn<UserProfileResponseDto>> {
    return this.userService.getProfile(userId);
  }

  @UserSharedUpdateProfileDoc()
  @Response('user.updateProfile')
  @UserProtected()
  @AuthJwtAccessProtected()
  @ApiKeyProtected()
  @Put('/profile/update')
  async updateProfile(
    @AuthJwtPayload('userId')
    userId: string,
    @Body()
    body: UserUpdateProfileRequestDto,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<void>> {
    return this.userService.updateProfile(userId, body, {
      ipAddress,
      userAgent,
      geoLocation,
    });
  }

  @UserSharedGeneratePhotoProfilePresignDoc()
  @Response('user.generatePhotoProfilePresign')
  @UserProtected()
  @AuthJwtAccessProtected()
  @ApiKeyProtected()
  @HttpCode(HttpStatus.OK)
  @Post('/profile/generate-presign/photo')
  async generatePhotoProfilePresign(
    @AuthJwtPayload('userId')
    userId: string,
    @Body() body: UserGeneratePhotoProfileRequestDto
  ): Promise<IResponseReturn<AwsS3PresignDto>> {
    return this.userService.generatePhotoProfilePresign(userId, body);
  }

  @UserSharedUpdatePhotoProfileDoc()
  @Response('user.updatePhotoProfile')
  @UserProtected()
  @AuthJwtAccessProtected()
  @ApiKeyProtected()
  @Put('/profile/update/photo')
  async updatePhotoProfile(
    @AuthJwtPayload('userId')
    userId: string,
    @Body() body: UserUpdateProfilePhotoRequestDto,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<void>> {
    return this.userService.updatePhotoProfile(userId, body, {
      ipAddress,
      userAgent,
      geoLocation,
    });
  }

  @UserSharedUploadPhotoProfileDoc()
  @Response('user.uploadPhotoProfile')
  @UserProtected()
  @AuthJwtAccessProtected()
  @ApiKeyProtected()
  @FileUploadSingle()
  @RequestTimeout('1m')
  @HttpCode(HttpStatus.OK)
  @Post('/profile/upload/photo')
  async uploadPhotoProfile(
    @AuthJwtPayload('userId')
    userId: string,
    @UploadedFile(
      RequestRequiredPipe,
      FileExtensionPipe([
        EnumFileExtensionImage.jpeg,
        EnumFileExtensionImage.png,
        EnumFileExtensionImage.jpg,
      ])
    )
    file: IFile,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<void>> {
    return this.userService.uploadPhotoProfile(userId, file, {
      ipAddress,
      userAgent,
      geoLocation,
    });
  }

  @UserSharedClaimUsernameDoc()
  @Response('user.claimUsername')
  @UserProtected()
  @AuthJwtAccessProtected()
  @ApiKeyProtected()
  @HttpCode(HttpStatus.OK)
  @Post('/username/claim')
  async claimUsername(
    @AuthJwtPayload('userId') userId: string,
    @Body()
    body: UserClaimUsernameRequestDto,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<void>> {
    return this.userService.claimUsername(userId, body, {
      ipAddress,
      userAgent,
      geoLocation,
    });
  }

  // TODO: LAST - Implement logout api

  // TODO: Verify number implementation, but which provider?
}
