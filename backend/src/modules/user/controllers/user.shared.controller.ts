import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
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
import { RequestIsValidObjectIdPipe } from '@/common/request/pipes/request.is-valid-object-id.pipe';
import { RequestRequiredPipe } from '@/common/request/pipes/request.required.pipe';
import { Response } from '@/common/response/decorators/response.decorator';
import { IResponseReturn } from '@/common/response/interfaces/response.interface';
import { ApiKeyProtected } from '@/modules/api-key/decorators/api-key.decorator';
import {
  AuthJwtAccessProtected,
  AuthJwtPayload,
  AuthJwtRefreshProtected,
  AuthJwtToken,
} from '@/modules/auth/decorators/auth.jwt.decorator';
import { AuthTokenResponseDto } from '@/modules/auth/dtos/response/auth.token.response.dto';
import {
  UserCurrent,
  UserProtected,
} from '@/modules/user/decorators/user.decorator';
import {
  UserSharedAddMobileNumberDoc,
  UserSharedChangePasswordDoc,
  UserSharedClaimUsernameDoc,
  UserSharedDeleteMobileNumberDoc,
  UserSharedGeneratePhotoProfilePresignDoc,
  UserSharedProfileDoc,
  UserSharedRefreshDoc,
  UserSharedTwoFactorDisableDoc,
  UserSharedTwoFactorEnableDoc,
  UserSharedTwoFactorRegenerateBackupDoc,
  UserSharedTwoFactorSetupDoc,
  UserSharedTwoFactorStatusDoc,
  UserSharedUpdateMobileNumberDoc,
  UserSharedUpdatePhotoProfileDoc,
  UserSharedUpdateProfileDoc,
  UserSharedUploadPhotoProfileDoc,
} from '@/modules/user/docs/user.shared.doc';
import { UserChangePasswordRequestDto } from '@/modules/user/dtos/request/user.change-password.request.dto';
import { UserClaimUsernameRequestDto } from '@/modules/user/dtos/request/user.claim-username.request.dto';
import { UserGeneratePhotoProfileRequestDto } from '@/modules/user/dtos/request/user.generate-photo-profile.request.dto';
import {
  UserAddMobileNumberRequestDto,
  UserUpdateMobileNumberRequestDto,
} from '@/modules/user/dtos/request/user.mobile-number.request.dto';
import {
  UserUpdateProfilePhotoRequestDto,
  UserUpdateProfileRequestDto,
} from '@/modules/user/dtos/request/user.profile.request.dto';
import { UserTwoFactorDisableRequestDto } from '@/modules/user/dtos/request/user.two-factor-disable.request.dto';
import { UserTwoFactorEnableRequestDto } from '@/modules/user/dtos/request/user.two-factor-enable.request.dto';
import { UserProfileResponseDto } from '@/modules/user/dtos/response/user.profile.response.dto';
import { UserTwoFactorEnableResponseDto } from '@/modules/user/dtos/response/user.two-factor-enable.response.dto';
import { UserTwoFactorSetupResponseDto } from '@/modules/user/dtos/response/user.two-factor-setup.response.dto';
import { UserTwoFactorStatusResponseDto } from '@/modules/user/dtos/response/user.two-factor-status.response.dto';
import { UserMobileNumberResponseDto } from '@/modules/user/dtos/user.mobile-number.dto';
import { IUser } from '@/modules/user/interfaces/user.interface';
import { UserService } from '@/modules/user/services/user.service';
import { GeoLocation, UserAgent } from '@/generated/prisma-client';

@ApiTags('modules.shared.user')
@Controller({
  version: '1',
  path: '/user',
})
export class UserSharedController {
  constructor(private readonly userService: UserService) {}

  @UserSharedRefreshDoc()
  @Response('user.refresh')
  @UserProtected()
  @AuthJwtRefreshProtected()
  @ApiKeyProtected()
  @HttpCode(HttpStatus.OK)
  @Post('/refresh')
  async refresh(
    @UserCurrent() user: IUser,
    @AuthJwtToken() refreshToken: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<AuthTokenResponseDto>> {
    return this.userService.refresh(user, refreshToken, {
      ipAddress,
      userAgent,
      geoLocation,
    });
  }

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

  @UserSharedChangePasswordDoc()
  @Response('user.changePassword')
  @UserProtected()
  @AuthJwtAccessProtected()
  @ApiKeyProtected()
  @Patch('/change-password')
  async changePassword(
    @UserCurrent() user: IUser,
    @Body() body: UserChangePasswordRequestDto,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<void>> {
    return this.userService.changePassword(user, body, {
      ipAddress,
      userAgent,
      geoLocation,
    });
  }

  @UserSharedAddMobileNumberDoc()
  @Response('user.addMobileNumber')
  @UserProtected()
  @AuthJwtAccessProtected()
  @ApiKeyProtected()
  @Post('/mobile-number/add')
  async addMobileNumber(
    @AuthJwtPayload('userId') userId: string,
    @Body()
    body: UserAddMobileNumberRequestDto,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<UserMobileNumberResponseDto>> {
    return this.userService.addMobileNumber(userId, body, {
      ipAddress,
      userAgent,
      geoLocation,
    });
  }

  @UserSharedUpdateMobileNumberDoc()
  @Response('user.updateMobileNumber')
  @UserProtected()
  @AuthJwtAccessProtected()
  @ApiKeyProtected()
  @Put('/mobile-number/update/:mobileNumberId')
  async updateMobileNumber(
    @AuthJwtPayload('userId') userId: string,
    @Param('mobileNumberId', RequestRequiredPipe, RequestIsValidObjectIdPipe)
    mobileNumberId: string,
    @Body()
    body: UserUpdateMobileNumberRequestDto,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<UserMobileNumberResponseDto>> {
    return this.userService.updateMobileNumber(userId, mobileNumberId, body, {
      ipAddress,
      userAgent,
      geoLocation,
    });
  }

  @UserSharedDeleteMobileNumberDoc()
  @Response('user.deleteMobileNumber')
  @UserProtected()
  @AuthJwtAccessProtected()
  @ApiKeyProtected()
  @Delete('/mobile-number/delete/:mobileNumberId')
  async deleteMobileNumber(
    @AuthJwtPayload('userId') userId: string,
    @Param('mobileNumberId', RequestRequiredPipe, RequestIsValidObjectIdPipe)
    mobileNumberId: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<UserMobileNumberResponseDto>> {
    return this.userService.deleteMobileNumber(userId, mobileNumberId, {
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

  @UserSharedTwoFactorStatusDoc()
  @Response('user.twoFactor.status')
  @TermPolicyAcceptanceProtected()
  @UserProtected()
  @AuthJwtAccessProtected()
  @ApiKeyProtected()
  @Get('/2fa/status')
  async getTwoFactorStatus(
    @UserCurrent() user: IUser
  ): Promise<IResponseReturn<UserTwoFactorStatusResponseDto>> {
    return this.userService.getTwoFactorStatus(user);
  }

  @UserSharedTwoFactorSetupDoc()
  @Response('user.twoFactor.setup')
  @UserProtected()
  @AuthJwtAccessProtected()
  @ApiKeyProtected()
  @HttpCode(HttpStatus.OK)
  @Post('/2fa/setup')
  async setupTwoFactor(
    @UserCurrent() user: IUser,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<UserTwoFactorSetupResponseDto>> {
    return this.userService.setupTwoFactor(user, {
      ipAddress,
      userAgent,
      geoLocation,
    });
  }

  @UserSharedTwoFactorEnableDoc()
  @Response('user.twoFactor.enable')
  @UserProtected()
  @AuthJwtAccessProtected()
  @ApiKeyProtected()
  @HttpCode(HttpStatus.OK)
  @Post('/2fa/enable')
  async enableTwoFactor(
    @UserCurrent() user: IUser,
    @Body() body: UserTwoFactorEnableRequestDto,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<UserTwoFactorEnableResponseDto>> {
    return this.userService.enableTwoFactor(user, body, {
      ipAddress,
      userAgent,
      geoLocation,
    });
  }

  @UserSharedTwoFactorDisableDoc()
  @Response('user.twoFactor.disable')
  @UserProtected()
  @AuthJwtAccessProtected()
  @ApiKeyProtected()
  @HttpCode(HttpStatus.OK)
  @Delete('/2fa/disable')
  async disableTwoFactor(
    @UserCurrent() user: IUser,
    @Body() body: UserTwoFactorDisableRequestDto,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<void>> {
    return this.userService.disableTwoFactor(user, body, {
      ipAddress,
      userAgent,
      geoLocation,
    });
  }

  @UserSharedTwoFactorRegenerateBackupDoc()
  @Response('user.twoFactor.regenerateBackupCodes')
  @UserProtected()
  @AuthJwtAccessProtected()
  @ApiKeyProtected()
  @Post('/2fa/regenerate-backup-codes')
  async regenerateTwoFactorBackupCodes(
    @UserCurrent() user: IUser,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<UserTwoFactorEnableResponseDto>> {
    return this.userService.regenerateTwoFactorBackupCodes(user, {
      ipAddress,
      userAgent,
      geoLocation,
    });
  }

  // TODO: LAST - Implement logout api

  // TODO: Verify number implementation, but which provider?
}
