import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { Duration } from 'luxon';
import { Profanity } from '@2toad/profanity';
import { IFileRandomFilenameOptions } from '@/common/file/interfaces/file.interface';
import { FileService } from '@/common/file/services/file.service';
import { HelperService } from '@/common/helper/services/helper.service';
import { IActivityLogMetadata } from '@/modules/activity-log/interfaces/activity-log.interface';
import { UserListResponseDto } from '@/modules/user/dtos/response/user.list.response.dto';
import { UserProfileResponseDto } from '@/modules/user/dtos/response/user.profile.response.dto';
import { UserDto } from '@/modules/user/dtos/user.dto';
import {
  IUser,
  IUserForgotPasswordCreate,
  IUserProfile,
} from '@/modules/user/interfaces/user.interface';
import { IUserVerificationCreate } from '@/modules/verification/interfaces/verification.interface';
import { UserModel } from '../models/user.model';
import { EnumVerificationType } from '@/modules/verification/enums/verification.enum';

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

  private readonly profanity: Profanity;

  constructor(
    private readonly configService: ConfigService,
    private readonly helperService: HelperService,
    private readonly fileService: FileService
  ) {
    this.usernamePrefix = this.configService.get<string>('user.usernamePrefix');
    this.usernamePattern = this.configService.get<RegExp>(
      'user.usernamePattern'
    );
    this.uploadPhotoProfilePath = this.configService.get<string>(
      'user.uploadPhotoProfilePath'
    );

    this.homeUrl = this.configService.get('home.url');

    this.forgotPasswordReferencePrefix = this.configService.get(
      'forgotPassword.reference.prefix'
    );
    this.forgotPasswordReferenceLength = this.configService.get(
      'forgotPassword.reference.length'
    );
    this.forgotExpiredInMinutes = this.configService.get(
      'forgotPassword.expiredInMinutes'
    );
    this.forgotTokenLength = this.configService.get(
      'forgotPassword.tokenLength'
    );
    this.forgotResendInMinutes = this.configService.get(
      'forgotPassword.resendInMinutes'
    );
    this.forgotLinkBaseUrl = this.configService.get(
      'forgotPassword.linkBaseUrl'
    );

    this.verificationReferencePrefix = this.configService.get(
      'verification.reference.prefix'
    );
    this.verificationReferenceLength = this.configService.get(
      'verification.reference.length'
    );
    this.verificationOtpLength = this.configService.get(
      'verification.otpLength'
    );
    this.verificationExpiredInMinutes = this.configService.get(
      'verification.expiredInMinutes'
    );
    this.verificationTokenLength = this.configService.get(
      'verification.tokenLength'
    );
    this.verificationResendInMinutes = this.configService.get(
      'verification.resendInMinutes'
    );
    this.verificationLinkBaseUrl = this.configService.get(
      'verification.linkBaseUrl'
    );

    const availableLanguages = this.configService.get<string[]>(
      'message.availableLanguage'
    );
    this.profanity = new Profanity({
      languages: availableLanguages,
      wholeWord: false,
      grawlix: '*****',
      grawlixChar: '*',
    });
  }

  createRandomFilenamePhotoProfileWithPath(
    user: string,
    { extension }: IFileRandomFilenameOptions
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

  async checkBadWord(str: string): Promise<boolean> {
    return this.profanity.exists(str);
  }

  mapList(users: UserModel[]): UserListResponseDto[] {
    return plainToInstance(UserListResponseDto, users);
  }

  mapExport(users: UserModel[]): any[] {
    return plainToInstance(UserListResponseDto, users);
  }

  mapOne(user: UserModel): UserDto {
    return plainToInstance(UserDto, user);
  }

  mapProfile(user: UserModel): UserProfileResponseDto {
    return plainToInstance(UserProfileResponseDto, user as any);
  }

  checkMobileNumber(phoneCodes: string[], phoneCode: string): boolean {
    return phoneCodes.includes(phoneCode);
  }

  mapActivityLogMetadata(user: UserModel): IActivityLogMetadata {
    return {
      userId: user.id,
      userUsername: user.username,
      timestamp: user.updatedAt ?? user.createdAt,
    };
  }

  forgotPasswordCreateReference(): string {
    const random = this.helperService.randomString(
      this.forgotPasswordReferenceLength
    );

    return `${this.forgotPasswordReferencePrefix}-${random}`;
  }

  forgotPasswordCreateToken(): string {
    return this.helperService.randomString(this.forgotTokenLength);
  }

  forgotPasswordSetExpiredDate(): Date {
    const now = this.helperService.dateCreate();

    return this.helperService.dateForward(
      now,
      Duration.fromObject({ minutes: this.forgotExpiredInMinutes })
    );
  }

  forgotPasswordCreate(userId: string): IUserForgotPasswordCreate {
    const token = this.forgotPasswordCreateToken();
    const hashedToken = this.helperService.sha256Hash(token);
    const link = `${this.homeUrl}/${this.forgotLinkBaseUrl}/${token}`;
    const encryptedLink = this.encryptedLink(userId, link);

    return {
      reference: this.forgotPasswordCreateReference(),
      expiredAt: this.forgotPasswordSetExpiredDate(),
      token,
      hashedToken,
      expiredInMinutes: this.forgotExpiredInMinutes,
      resendInMinutes: this.forgotResendInMinutes,
      link,
      encryptedLink,
    };
  }

  verificationCreateReference(): string {
    const random = this.helperService.randomString(
      this.verificationReferenceLength
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
    const now = this.helperService.dateCreate();

    return this.helperService.dateForward(
      now,
      Duration.fromObject({ minutes: this.verificationExpiredInMinutes })
    );
  }

  verificationCreateVerification(
    userId: string,
    type: EnumVerificationType
  ): IUserVerificationCreate {
    const token =
      type === EnumVerificationType.mobileNumber
        ? this.verificationCreateOtp()
        : this.verificationCreateToken();
    const hashedToken = this.hashedToken(token);
    const link =
      type === EnumVerificationType.mobileNumber
        ? null
        : `${this.homeUrl}/${this.verificationLinkBaseUrl}/${token}`;
    const encryptedLink =
      type === EnumVerificationType.mobileNumber
        ? null
        : this.encryptedLink(userId, link);

    return {
      reference: this.verificationCreateReference(),
      expiredAt: this.verificationSetExpiredDate(),
      type,
      token,
      hashedToken,
      expiredInMinutes: this.verificationExpiredInMinutes,
      link,
      encryptedLink,
      resendInMinutes: this.verificationResendInMinutes,
    };
  }

  hashedToken(token: string): string {
    return this.helperService.sha256Hash(token);
  }

  encryptedLink(userId: string, token: string): string {
    return this.helperService.aes256EncryptSimple(token, userId);
  }

  decryptedLink(userId: string, encoded: string): string {
    return this.helperService.aes256DecryptSimple(encoded, userId);
  }
}
