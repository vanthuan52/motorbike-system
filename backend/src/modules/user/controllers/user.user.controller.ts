import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Put,
  UploadedFile,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import { Response } from '@/common/response/decorators/response.decorator';
import { UserUtil } from '../utils/user.util';
import {
  UserUserGeneratePhotoProfilePresignDoc,
  UserUserProfileDoc,
  UserUserUpdatePhotoProfileDoc,
  UserUserUpdateProfileDoc,
  UserUserUploadPhotoProfileDoc,
} from '../docs/user.user.doc';
import { UserProtected } from '../decorators/user.decorator';
import {
  AuthJwtAccessProtected,
  AuthJwtPayload,
} from '@/modules/auth/decorators/auth.jwt.decorator';
import { IResponseReturn } from '@/common/response/interfaces/response.interface';
import { UserProfileResponseDto } from '../dtos/response/user.profile.response.dto';
import { UserUpdateProfileRequestDto } from '../dtos/request/user.update-profile.request.dto';
import { UserGeneratePhotoProfileRequestDto } from '../dtos/request/user.generate-photo-profile.request.dto';
import { AwsS3PresignDto } from '@/common/aws/dtos/aws.s3-presign.dto';
import { UserConfirmPhotoProfileRequestDto } from '../dtos/request/user.confirm-photo-profile.request.dto';
import { FileUploadSingle } from '@/common/file/decorators/file.decorator';
import {
  RequestIPAddress,
  RequestTimeout,
  RequestUserAgent,
} from '@/common/request/decorators/request.decorator';
import { FileExtensionPipe } from '@/common/file/pipes/file.extension.pipe';
import { EnumFileExtensionImage } from '@/common/file/enums/file.enum';
import { RequestUserAgentDto } from '@/common/request/dtos/request.user-agent.dto';
import { IFile } from '@/common/file/interfaces/file.interface';

@ApiTags('modules.user.user')
@Controller({
  version: '1',
  path: '/user',
})
export class UserUserController {
  private readonly logger = new Logger(UserUserController.name);
  constructor(
    private readonly userService: UserService,
    private readonly userUtil: UserUtil,
  ) {}

  @UserUserProfileDoc()
  @Response('user.profile')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/profile')
  async profile(
    @AuthJwtPayload('userId') userId: string,
  ): Promise<IResponseReturn<UserProfileResponseDto>> {
    const user = await this.userService.findOneWithRoleById(userId);
    const mapped = this.userUtil.mapProfile(user);
    return {
      data: mapped,
    };
  }

  @UserUserUpdateProfileDoc()
  @Response('user.updateProfile')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Put('/profile/update')
  async updateProfile(
    @AuthJwtPayload('userId') userId: string,
    @Body() body: UserUpdateProfileRequestDto,
  ): Promise<void> {
    await this.userService.updateProfile(userId, body, { actionBy: userId });
    return;
  }

  @UserUserGeneratePhotoProfilePresignDoc()
  @Response('user.generatePhotoProfilePresign')
  @UserProtected()
  @AuthJwtAccessProtected()
  @HttpCode(HttpStatus.OK)
  @Post('/profile/generate-presign/photo')
  async generatePhotoProfilePresign(
    @AuthJwtPayload('userId') userId: string,
    @Body() body: UserGeneratePhotoProfileRequestDto,
  ): Promise<IResponseReturn<AwsS3PresignDto>> {
    const presign = await this.userService.generatePhotoProfilePresign(
      userId,
      body,
    );
    return {
      data: presign,
    };
  }

  @UserUserUpdatePhotoProfileDoc()
  @Response('user.confirmPhotoProfile')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Put('/profile/photo/confirm')
  async confirmPhotoProfile(
    @AuthJwtPayload('userId') userId: string,
    @Body() { key }: UserConfirmPhotoProfileRequestDto,
  ): Promise<IResponseReturn<void>> {
    await this.userService.confirmPhotoProfile(userId, key);
    return;
  }

  @UserUserUploadPhotoProfileDoc()
  @Response('user.uploadPhotoProfile')
  @UserProtected()
  @AuthJwtAccessProtected()
  @FileUploadSingle()
  @RequestTimeout('1m')
  @HttpCode(HttpStatus.OK)
  @Post('/profile/upload/photo')
  async uploadPhotoProfile(
    @AuthJwtPayload('userId')
    userId: string,
    @UploadedFile(
      FileExtensionPipe([
        EnumFileExtensionImage.jpeg,
        EnumFileExtensionImage.png,
        EnumFileExtensionImage.jpg,
      ]),
    )
    file: IFile,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: RequestUserAgentDto,
  ): Promise<IResponseReturn<void>> {
    await this.userService.uploadPhotoProfile(userId, file, {
      actionBy: userId,
    });
    return {};
  }
}
