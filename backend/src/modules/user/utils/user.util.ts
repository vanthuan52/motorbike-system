import { IFileRandomFilenameOptions } from '@/common/file/interfaces/file.interface';
import { FileService } from '@/common/file/services/file.service';
import { HelperService } from '@/common/helper/services/helper.service';
import { UserListResponseDto } from '../dtos/response/user.list.response.dto';
import { UserProfileResponseDto } from '../dtos/response/user.profile.response.dto';
import { UserDto } from '../dtos/user.dto';
import { IUserEntity, IUserDoc } from '../interfaces/user.interface';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { Duration } from 'luxon';
import { Document } from 'mongoose';
import { UserDoc } from '../entities/user.entity';

@Injectable()
export class UserUtil {
  private readonly usernamePrefix: string;
  private readonly usernamePattern: RegExp;
  private readonly uploadPhotoProfilePath: string;

  private readonly homeUrl: string;

  private readonly forgotPasswordReferencePrefix: string;
  private readonly forgotPasswordReferenceLength: number;
  private readonly forgotExpiredInMinutes: number;
  private readonly forgotTokenLength: number;
  readonly forgotResendInMinutes: number;
  private readonly forgotLinkBaseUrl: string;

  private readonly verificationReferencePrefix: string;
  private readonly verificationReferenceLength: number;
  private readonly verificationOtpLength: number;
  readonly verificationExpiredInMinutes: number;
  private readonly verificationTokenLength: number;
  private readonly verificationResendInMinutes: number;
  private readonly verificationLinkBaseUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly helperService: HelperService,
    private readonly fileService: FileService,
  ) {
    this.usernamePrefix = this.configService.get<string>('user.usernamePrefix');
    this.usernamePattern = this.configService.get<RegExp>(
      'user.usernamePattern',
    );
    this.uploadPhotoProfilePath = this.configService.get<string>(
      'user.uploadPhotoProfilePath',
    );

    this.homeUrl = this.configService.get('app.homeUrl');

    this.forgotPasswordReferencePrefix = this.configService.get(
      'forgotPassword.reference.prefix',
    );
    this.forgotPasswordReferenceLength = this.configService.get(
      'forgotPassword.reference.length',
    );
    this.forgotExpiredInMinutes = this.configService.get(
      'forgotPassword.expiredInMinutes',
    );
    this.forgotTokenLength = this.configService.get(
      'forgotPassword.tokenLength',
    );
    this.forgotResendInMinutes = this.configService.get(
      'forgotPassword.resendInMinutes',
    );
    this.forgotLinkBaseUrl = this.configService.get(
      'forgotPassword.linkBaseUrl',
    );

    this.verificationReferencePrefix = this.configService.get(
      'verification.reference.prefix',
    );
    this.verificationReferenceLength = this.configService.get(
      'verification.reference.length',
    );
    this.verificationOtpLength = this.configService.get(
      'verification.otpLength',
    );
    this.verificationExpiredInMinutes = this.configService.get(
      'verification.expiredInMinutes',
    );
    this.verificationTokenLength = this.configService.get(
      'verification.tokenLength',
    );
    this.verificationResendInMinutes = this.configService.get(
      'verification.resendInMinutes',
    );
    this.verificationLinkBaseUrl = this.configService.get(
      'verification.linkBaseUrl',
    );

    const availableLanguages = this.configService.get<string[]>(
      'message.availableLanguage',
    );
  }

  createRandomFilenamePhotoProfileWithPath(
    user: string,
    { extension }: IFileRandomFilenameOptions,
  ): string {
    const path: string = this.uploadPhotoProfilePath.replace('{userId}', user);
    return this.fileService.createRandomFilename({
      path,
      extension,
      randomLength: 20,
    });
  }

  createRandomUsername(): string {
    const suffix = this.helperService.randomString(6);

    return `${this.usernamePrefix}-${suffix}`.toLowerCase();
  }

  checkUsernamePattern(username: string): boolean {
    return !!username.search(this.usernamePattern);
  }

  mapList(
    users: IUserDoc[] | IUserEntity[] | UserDoc[],
  ): UserListResponseDto[] {
    return plainToInstance(
      UserListResponseDto,
      users.map((u: IUserDoc | IUserEntity | UserDoc) =>
        u instanceof Document ? u.toObject() : u,
      ),
    );
  }

  mapOne(user: IUserDoc | IUserEntity | UserDoc): UserDto {
    return plainToInstance(
      UserDto,
      user instanceof Document ? user.toObject() : user,
    );
  }

  mapProfile(user: IUserDoc | IUserEntity | UserDoc): UserProfileResponseDto {
    return plainToInstance(
      UserProfileResponseDto,
      user instanceof Document ? user.toObject() : user,
    );
  }

  checkMobileNumber(phoneCodes: string[], phoneCode: string): boolean {
    return phoneCodes.includes(phoneCode);
  }

  forgotPasswordCreateReference(): string {
    const random = this.helperService.randomString(
      this.forgotPasswordReferenceLength,
    );

    return `${this.forgotPasswordReferencePrefix}-${random}`;
  }

  forgotPasswordCreateToken(): string {
    return this.helperService.randomString(this.forgotTokenLength);
  }

  forgotPasswordSetExpiredDate(): Date {
    const now = new Date();

    return this.helperService.dateForward(
      now,
      Duration.fromObject({ minutes: this.forgotExpiredInMinutes }),
    );
  }

  verificationCreateReference(): string {
    const random = this.helperService.randomString(
      this.verificationReferenceLength,
    );

    return `${this.verificationReferencePrefix}-${random}`;
  }

  verificationCreateOtp(): string {
    return this.helperService.randomDigits(this.verificationOtpLength);
  }

  verificationCreateToken(): string {
    return this.helperService.randomString(this.verificationTokenLength);
  }

  verificationSetExpiredDate(): Date {
    const now = new Date();

    return this.helperService.dateForward(
      now,
      Duration.fromObject({ minutes: this.verificationExpiredInMinutes }),
    );
  }

  createTempEmail(temp: string): string {
    return `temp_${temp}@antmotor.vn`;
  }

  createDefaultPassword(): string {
    return this.helperService.randomString(8);
  }
}
