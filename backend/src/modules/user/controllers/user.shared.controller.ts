import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ClientSession } from 'mongoose';
import { UserService } from '../services/user.service';
import { DatabaseService } from '@/common/database/services/database.service';
import { MessageService } from '@/common/message/services/message.service';
import { Response } from '@/common/response/decorators/response.decorator';
import { UserProtected } from '../decorators/user.decorator';
import {
  AuthJwtAccessProtected,
  AuthJwtPayload,
} from '@/modules/auth/decorators/auth.jwt.decorator';
import { ApiKeyProtected } from '@/modules/api-key/decorators/api-key.decorator';
import { UserActiveParsePipe, UserParsePipe } from '../pipes/user.parse.pipe';
import { IUserDoc } from '../interfaces/user.interface';
import { IResponse } from '@/common/response/interfaces/response.interface';
import { UserProfileResponseDto } from '../dtos/response/user.profile.response.dto';
import { IAuthJwtAccessTokenPayload } from '@/modules/auth/interfaces/auth.interface';
import { UserDoc } from '../entities/user.entity';
import { UserUpdateProfileRequestDto } from '../dtos/request/user.update-profile.dto';
import { IDatabaseSaveOptions } from '@/common/database/interfaces/database.interface';
import { ENUM_APP_STATUS_CODE_ERROR } from '@/app/enums/app.status-code.num';
import {
  UserSharedProfileDoc,
  UserSharedUpdateProfileDoc,
} from '../docs/user.shared.doc';

@ApiTags('modules.shared.user')
@Controller({
  version: '1',
  path: '/user',
})
export class UserSharedController {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly userService: UserService,
    private readonly messageService: MessageService,
  ) {}

  @UserSharedProfileDoc()
  @Response('user.profile')
  @UserProtected()
  @AuthJwtAccessProtected()
  @ApiKeyProtected()
  @Get('/profile')
  async profile(
    @AuthJwtPayload<IAuthJwtAccessTokenPayload>('user', UserActiveParsePipe)
    user: IUserDoc,
  ): Promise<IResponse<UserProfileResponseDto>> {
    const mapped: UserProfileResponseDto = this.userService.mapProfile(user);
    return { data: mapped };
  }

  @UserSharedUpdateProfileDoc()
  @Response('user.updateProfile')
  @UserProtected()
  @AuthJwtAccessProtected()
  @ApiKeyProtected()
  @Put('/profile/update')
  async updateProfile(
    @AuthJwtPayload<IAuthJwtAccessTokenPayload>('user', UserParsePipe)
    user: UserDoc,
    @Body() body: UserUpdateProfileRequestDto,
  ): Promise<void> {
    try {
      await this.userService.updateProfile(
        user,
        {
          ...body,
        },
        { actionBy: user._id } as IDatabaseSaveOptions,
      );
    } catch (err: unknown) {
      throw new InternalServerErrorException({
        statusCode: ENUM_APP_STATUS_CODE_ERROR.UNKNOWN,
        message: 'http.serverError.internalServerError',
        _error: err,
      });
    }

    return;
  }

  // @UserSharedUploadPhotoProfileDoc()
  // @Response('user.uploadPhotoProfile')
  // @UserProtected()
  // @AuthJwtAccessProtected()
  // @ApiKeyProtected()
  // @HttpCode(HttpStatus.OK)
  // @Post('/profile/upload-photo')
  // async uploadPhotoProfile(
  //   @AuthJwtPayload<IAuthJwtAccessTokenPayload>('user', UserParsePipe)
  //   user: UserDoc,
  //   @Body() { mime, size }: UserUploadPhotoRequestDto,
  // ): Promise<IResponse<AwsS3PresignResponseDto>> {
  //   const randomFilename: string = this.userService.createRandomFilenamePhoto(
  //     user._id,
  //     {
  //       mime,
  //       size,
  //     },
  //   );

  //   const aws: AwsS3PresignResponseDto = await this.awsS3Service.presignPutItem(
  //     randomFilename,
  //     size,
  //   );

  //   return {
  //     data: aws,
  //   };
  // }

  // @UserSharedUpdatePhotoProfileDoc()
  // @Response('user.updatePhotoProfile')
  // @UserProtected()
  // @AuthJwtAccessProtected()
  // @ApiKeyProtected()
  // @Put('/profile/update-photo')
  // async updatePhotoProfile(
  //   @AuthJwtPayload<IAuthJwtAccessTokenPayload>('user', UserParsePipe)
  //   user: UserDoc,
  //   @Body() body: AwsS3PresignRequestDto,
  // ): Promise<void> {
  //   const session: ClientSession =
  //     await this.databaseService.createTransaction();

  //   try {
  //     const aws: AwsS3Dto = this.awsS3Service.mapPresign(body);

  //     await this.userService.updatePhoto(user, aws, {
  //       session,
  //     } as IDatabaseSaveOptions);

  //     await this.databaseService.commitTransaction(session);
  //   } catch (err: unknown) {
  //     await this.databaseService.abortTransaction(session);

  //     throw new InternalServerErrorException({
  //       statusCode: ENUM_APP_STATUS_CODE_ERROR.UNKNOWN,
  //       message: 'http.serverError.internalServerError',
  //       _error: err,
  //     });
  //   }

  //   return;
  // }
}
