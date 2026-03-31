import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Duration } from 'luxon';
import { HelperService } from '@/common/helper/services/helper.service';
import { IUserForgotPasswordCreate } from '@/modules/user/interfaces/user.interface';
import { IUserVerificationCreate } from '@/modules/verification/interfaces/verification.interface';
import { EnumVerificationType } from '@/modules/verification/enums/verification.enum';

@Injectable()
export class VerificationUtil {
  // ---- verification config read from ConfigService ----
  private readonly verificationReferencePrefix: string;
  private readonly verificationReferenceLength: number;
  private readonly verificationOtpLength: number;
  readonly verificationExpiredInMinutes: number;
  private readonly verificationTokenLength: number;
  private readonly verificationResendInMinutes: number;
  private readonly verificationLinkBaseUrl: string;

  // ---- forgot-password config read from ConfigService ----
  private readonly forgotPasswordReferencePrefix: string;
  private readonly forgotPasswordReferenceLength: number;
  private readonly forgotExpiredInMinutes: number;
  private readonly forgotTokenLength: number;
  readonly forgotResendInMinutes: number;
  private readonly forgotLinkBaseUrl: string;

  private readonly homeUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly helperService: HelperService
  ) {
    this.homeUrl = this.configService.get<string>('home.url');

    // verification
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

    // forgot password
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
  }

  // ─── Generic helpers ────────────────────────────────────────────────────────

  hashedToken(token: string): string {
    return this.helperService.sha256Hash(token);
  }

  encryptedLink(userId: string, link: string): string {
    return this.helperService.aes256EncryptSimple(link, userId);
  }

  decryptedLink(userId: string, encoded: string): string {
    return this.helperService.aes256DecryptSimple(encoded, userId);
  }

  // ─── Verification ────────────────────────────────────────────────────────────

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

  createVerification(
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

  // ─── Forgot Password ─────────────────────────────────────────────────────────

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
    const hashedToken = this.hashedToken(token);
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
}
