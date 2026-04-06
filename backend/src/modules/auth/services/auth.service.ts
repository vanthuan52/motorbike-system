import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenPayload } from 'google-auth-library';
import { Duration } from 'luxon';
import { DatabaseUtil } from '@/common/database/utils/database.util';
import { DatabaseService } from '@/common/database/services/database.service';
import { HelperService } from '@/common/helper/services/helper.service';
import {
  IRequestApp,
  IRequestLog,
} from '@/common/request/interfaces/request.interface';
import { AuthTokenResponseDto } from '@/modules/auth/dtos/response/auth.token.response.dto';
import { EnumAuthStatusCodeError } from '@/modules/auth/enums/auth.status-code.enum';
import {
  IAuthJwtAccessTokenPayload,
  IAuthJwtRefreshTokenPayload,
  IAuthSocialPayload,
} from '@/modules/auth/interfaces/auth.interface';
import { IAuthService } from '@/modules/auth/interfaces/auth.service.interface';
import { EnumActivityLogAction } from '@/modules/activity-log/enums/activity-log.enum';
import { AuthUtil } from '@/modules/auth/utils/auth.util';
import {
  EnumUserLoginFrom,
  EnumUserLoginWith,
  EnumUserStatus,
} from '@/modules/user/enums/user.enum';
import { EnumUserStatusCodeError } from '@/modules/user/enums/user.status-code.enum';
import { UserService } from '@/modules/user/services/user.service';
import { EnumSessionStatusCodeError } from '@/modules/session/enums/session.status-code.enum';
import { SessionUtil } from '@/modules/session/utils/session.util';
import { VerificationService } from '@/modules/verification/services/verification.service';
import { EnumAppStatusCodeError } from '@/app/enums/app.status-code.enum';
import { AuthLoginRequestDto } from '@/modules/auth/dtos/request/auth.login.request.dto';
import { AuthCreateSocialRequestDto } from '@/modules/auth/dtos/request/auth.create-social.request.dto';
import { AuthSignUpRequestDto } from '@/modules/auth/dtos/request/auth.sign-up.request.dto';
import { RoleService } from '@/modules/role/services/role.service';
import { SessionService } from '@/modules/session/services/session.service';
import { ActivityLogService } from '@/modules/activity-log/services/activity-log.service';
import { EnumRoleStatusCodeError } from '@/modules/role/enums/role.status-code.enum';
import { AuthChangePasswordRequestDto } from '@/modules/auth/dtos/request/auth.change-password.request.dto';
import { DefaultRoleType } from '../constants/auth.constant';
import { AuthForgotPasswordRequestDto } from '@/modules/auth/dtos/request/auth.forgot-password.request.dto';
import { AuthForgotPasswordResetRequestDto } from '@/modules/auth/dtos/request/auth.forgot-password-reset.request.dto';
import { IUser } from '@/modules/user/interfaces/user.interface';
import { AuthLoginResponseDto } from '../dtos/response/auth.login.response.dto';
import { VerificationUtil } from '@/modules/verification/utils/verification.util';
import { AuthVerifyEmailRequestDto } from '../dtos/request/auth.verify-email.request.dto';
import { AuthSendEmailVerificationRequestDto } from '../dtos/request/auth.send-email-verification.request.dto';
import { DeviceRequestDto } from '@/modules/device/dtos/requests/device.request.dto';
import { DeviceService } from '@/modules/device/services/device.service';
import { NotificationUtil } from '@/modules/notification/utils/notification.util';
import { EnumVerificationType } from '@/modules/verification/enums/verification.enum';
import { NotificationService } from '@/modules/notification/services/notification.service';
import { Prisma } from '@/generated/prisma-client';

/**
 * Authentication service handling JWT token operations, session validation,
 * and social authentication (Google, Apple). Manages token creation, refresh,
 * and authentication guard validations for secure user access.
 */
@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly userService: UserService,
    private readonly verificationService: VerificationService,
    private readonly roleService: RoleService,
    private readonly sessionService: SessionService,
    private readonly helperService: HelperService,
    private readonly authUtil: AuthUtil,
    private readonly verificationUtil: VerificationUtil,
    private readonly sessionUtil: SessionUtil,
    private readonly databaseUtil: DatabaseUtil,
    private readonly notificationUtil: NotificationUtil,
    private readonly databaseService: DatabaseService,
    private readonly activityLogService: ActivityLogService,
    private readonly notificationService: NotificationService,
    private readonly deviceService: DeviceService
  ) {}

  /* ================================ PURE AUTH SERVICE =========================================*/

  /**
   * Validates the JWT access token strategy for Passport.
   *
   * Verifies that the access token payload contains required fields (sub, sessionId, jti)
   * and validates the session exists with matching token identifier to prevent session hijacking.
   *
   * @param payload - The decoded JWT access token payload
   * @returns Promise resolving to the validated payload if all checks pass
   * @throws {UnauthorizedException} When required fields are missing, invalid type, or session validation fails
   *
   * @see {@link AuthJwtAccessStrategy} for the Passport strategy that calls this method
   */
  async validateJwtAccessStrategy(
    payload: IAuthJwtAccessTokenPayload
  ): Promise<IAuthJwtAccessTokenPayload> {
    const { sub, sessionId, jti } = payload;

    if (
      !sub ||
      !sessionId ||
      typeof sub !== 'string' ||
      !jti ||
      typeof jti !== 'string'
    ) {
      throw new UnauthorizedException({
        statusCode: EnumAuthStatusCodeError.jwtAccessTokenInvalid,
        message: 'auth.error.accessTokenUnauthorized',
      });
    }

    const isValidSession = await this.sessionUtil.getLogin(sub, sessionId);
    if (!isValidSession || jti !== isValidSession.jti) {
      throw new UnauthorizedException({
        statusCode: EnumSessionStatusCodeError.forbidden,
        message: 'session.error.forbidden',
      });
    }

    return payload;
  }

  /**
   * Validates the access token guard callback from Passport.
   *
   * Handles error cases that may occur during token verification and returns the authenticated user.
   * Throws an exception if authentication fails or user is not present.
   *
   * @param err - Any error that occurred during token verification
   * @param user - The authenticated user object from the decoded token
   * @param info - Additional information from the verification process
   * @returns Promise resolving to the authenticated user if validation succeeds
   * @throws {UnauthorizedException} When error exists, user is not present, or verification fails
   *
   * @see {@link AuthJwtAccessStrategy} for the Passport strategy that calls this guard
   */
  async validateJwtAccessGuard(
    err: Error,
    user: IAuthJwtAccessTokenPayload,
    info: Error
  ): Promise<IAuthJwtAccessTokenPayload> {
    if (err || !user) {
      throw new UnauthorizedException({
        statusCode: EnumAuthStatusCodeError.jwtAccessTokenInvalid,
        message: 'auth.error.accessTokenUnauthorized',
        _error: err ? err : info,
      });
    }

    return user;
  }

  /**
   * Validates the JWT refresh token strategy for Passport.
   *
   * Verifies that the refresh token payload contains required fields (sub, sessionId, jti)
   * and validates the session exists with matching token identifier to prevent session hijacking.
   *
   * @param payload - The decoded JWT refresh token payload
   * @returns Promise resolving to the validated payload if all checks pass
   * @throws {UnauthorizedException} When required fields are missing, invalid type, or session validation fails
   *
   * @see {@link AuthJwtRefreshStrategy} for the Passport strategy that calls this method
   */
  async validateJwtRefreshStrategy(
    payload: IAuthJwtRefreshTokenPayload
  ): Promise<IAuthJwtRefreshTokenPayload> {
    const { sub, sessionId, jti } = payload;
    if (
      !sub ||
      !sessionId ||
      typeof sub !== 'string' ||
      !jti ||
      typeof jti !== 'string'
    ) {
      throw new UnauthorizedException({
        statusCode: EnumAuthStatusCodeError.jwtRefreshTokenInvalid,
        message: 'auth.error.refreshTokenUnauthorized',
      });
    }

    const isValidSession = await this.sessionUtil.getLogin(sub, sessionId);
    if (!isValidSession || jti !== isValidSession.jti) {
      throw new UnauthorizedException({
        statusCode: EnumSessionStatusCodeError.forbidden,
        message: 'session.error.forbidden',
      });
    }

    return payload;
  }

  /**
   * Validates the refresh token guard callback from Passport.
   *
   * Handles error cases that may occur during token verification and returns the authenticated user.
   * Throws an exception if authentication fails or user is not present.
   *
   * @param err - Any error that occurred during token verification
   * @param user - The authenticated user object from the decoded token
   * @param info - Additional information from the verification process
   * @returns Promise resolving to the authenticated user if validation succeeds
   * @throws {UnauthorizedException} When error exists, user is not present, or verification fails
   *
   */
  async validateJwtRefreshGuard(
    err: Error,
    user: IAuthJwtRefreshTokenPayload,
    info: Error
  ): Promise<IAuthJwtRefreshTokenPayload> {
    if (err || !user) {
      throw new UnauthorizedException({
        statusCode: EnumAuthStatusCodeError.jwtRefreshTokenInvalid,
        message: 'auth.error.refreshTokenUnauthorized',
        _error: err ? err : info,
      });
    }

    return user;
  }

  /**
   * Validates the Apple social authentication token from the request headers.
   *
   * Extracts the Apple ID token from Authorization header, verifies it with Apple's servers,
   * and attaches user data to the request. Sets verified email and email verification status
   * in the request user object.
   *
   * @param request - The HTTP request object containing Authorization header with Apple ID token in format "Bearer {token}"
   * @returns Promise resolving to true if authentication is successful
   * @throws {UnauthorizedException} When token is missing, malformed, header format is incorrect, or verification with Apple fails
   */
  async validateOAuthAppleGuard(
    request: IRequestApp<IAuthSocialPayload>
  ): Promise<boolean> {
    const requestHeaders = this.authUtil.extractHeaderApple(request);
    if (requestHeaders.length !== 2) {
      throw new UnauthorizedException({
        statusCode: EnumAuthStatusCodeError.socialGoogleRequired,
        message: 'auth.error.socialAppleRequired',
      });
    }

    try {
      const payload = await this.authUtil.verifyApple(requestHeaders[1]);

      request.user = {
        email: payload.email,
        emailVerified: payload.email_verified,
      };

      return true;
    } catch (err: unknown) {
      throw new UnauthorizedException({
        statusCode: EnumAuthStatusCodeError.socialGoogleInvalid,
        message: 'auth.error.socialAppleInvalid',
        _error: err,
      });
    }
  }

  /**
   * Validates the Google social authentication token from the request headers.
   *
   * Extracts the Google ID token from Authorization header, verifies it using Google's OAuth2 client,
   * and attaches user data to the request. Sets verified email and email verification status
   * in the request user object.
   *
   * @param request - The HTTP request object containing Authorization header with Google ID token in format "Bearer {token}"
   * @returns Promise resolving to true if authentication is successful
   * @throws {UnauthorizedException} When token is missing, malformed, header format is incorrect, or verification with Google fails
   */
  async validateOAuthGoogleGuard(
    request: IRequestApp<IAuthSocialPayload>
  ): Promise<boolean> {
    const requestHeaders = this.authUtil.extractHeaderGoogle(request);

    if (requestHeaders.length !== 2) {
      throw new UnauthorizedException({
        statusCode: EnumAuthStatusCodeError.socialGoogleRequired,
        message: 'auth.error.socialGoogleRequired',
      });
    }

    try {
      const payload: TokenPayload = await this.authUtil.verifyGoogle(
        requestHeaders[1]
      );

      request.user = {
        email: payload.email,
        emailVerified: payload.email_verified,
      };

      return true;
    } catch (err: unknown) {
      throw new UnauthorizedException({
        statusCode: EnumAuthStatusCodeError.socialGoogleInvalid,
        message: 'auth.error.socialGoogleInvalid',
        _error: err,
      });
    }
  }

  /* ================================ API AUTH SERVICE =========================================*/

  async loginCredential(
    { email, password, from, device }: AuthLoginRequestDto,
    requestLog: IRequestLog
  ): Promise<AuthLoginResponseDto> {
    const user = await this.userService.findOneWithRoleByEmail(email);
    if (!user) {
      throw new NotFoundException({
        statusCode: EnumUserStatusCodeError.notFound,
        message: 'user.error.notFound',
      });
    } else if (user.status !== EnumUserStatus.active) {
      throw new ForbiddenException({
        statusCode: EnumUserStatusCodeError.inactiveForbidden,
        message: 'user.error.inactive',
      });
    } else if (!user.password) {
      throw new BadRequestException({
        statusCode: EnumUserStatusCodeError.passwordNotSet,
        message: 'auth.error.passwordNotSet',
      });
    }

    if (!this.authUtil.validatePassword(password, user.password)) {
      throw new BadRequestException({
        statusCode: EnumUserStatusCodeError.passwordNotMatch,
        message: 'auth.error.passwordNotMatch',
      });
    }

    return this.handleLogin(
      user,
      device,
      from,
      EnumUserLoginWith.credential,
      this.helperService.dateCreate(),
      requestLog
    );
  }

  async loginWithSocial(
    email: string,
    loginWith: EnumUserLoginWith,
    { from, device, ...others }: AuthCreateSocialRequestDto,
    requestLog: IRequestLog
  ): Promise<AuthLoginResponseDto> {
    let user = await this.userService.findOneWithRoleByEmail(email);

    if (!user) {
      const role = await this.roleService.findRoleByType(DefaultRoleType);
      if (!role) {
        throw new NotFoundException({
          statusCode: EnumRoleStatusCodeError.notFound,
          message: 'role.error.notFound',
        });
      }

      const randomUsername = this.userService.createRandomUsername();
      await this.databaseService.$transaction(
        async (tx: Prisma.TransactionClient) => {
          user = await this.userService.createFromSocial(
            email,
            randomUsername,
            role.id,
            loginWith,
            { from, device, ...others },
            { tx }
          );

          await this.notificationService.initUserSetting(user.id, { tx });

          await this.activityLogService.create(
            user.id,
            EnumActivityLogAction.userCreated,
            requestLog,
            undefined,
            { tx }
          );
        }
      );

      // @note: send email after all creation
      await this.notificationUtil.sendWelcomeSocial(user.id);
    }

    if (user.status !== EnumUserStatus.active) {
      throw new ForbiddenException({
        statusCode: EnumUserStatusCodeError.inactiveForbidden,
        message: 'user.error.inactive',
      });
    }

    if (!user.isVerified) {
      const updatedUser = await this.databaseService.$transaction(
        async (tx: Prisma.TransactionClient) => {
          const _updatedUser = await this.userService.updateVerificationStatus(
            user.id,
            { tx }
          );

          await this.activityLogService.create(
            user.id,
            EnumActivityLogAction.userVerifiedEmail,
            requestLog,
            undefined,
            { tx }
          );

          return _updatedUser;
        }
      );

      user.isVerified = updatedUser.isVerified;
    }

    return this.handleLogin(
      user,
      device,
      from,
      loginWith,
      this.helperService.dateCreate(),
      requestLog
    );
  }

  async refreshToken(
    user: IUser,
    refreshToken: string,
    requestLog: IRequestLog
  ): Promise<AuthTokenResponseDto> {
    const {
      sessionId,
      userId,
      jti: oldJti,
      loginFrom,
      loginWith,
    } = this.authUtil.payloadToken<IAuthJwtRefreshTokenPayload>(refreshToken);

    const session = await this.sessionUtil.getLogin(userId, sessionId);
    if (session.jti !== oldJti) {
      throw new UnauthorizedException({
        statusCode: EnumAuthStatusCodeError.jwtRefreshTokenInvalid,
        message: 'auth.error.refreshTokenInvalid',
      });
    }

    try {
      const {
        jti: newJti,
        tokens,
        expiredInMs,
      } = this.authUtil.refreshToken(user, refreshToken);

      await this.databaseService.$transaction(
        async (tx: Prisma.TransactionClient) => {
          await this.userService.updateLoginMetadata(
            userId,
            { loginFrom, loginWith },
            requestLog.ipAddress,
            { tx }
          );

          await this.sessionService.updateJti(sessionId, newJti, { tx });

          await this.activityLogService.create(
            userId,
            EnumActivityLogAction.userRefreshToken,
            requestLog,
            undefined,
            { tx }
          );
        }
      );

      await this.sessionUtil.updateLogin(
        userId,
        sessionId,
        session,
        newJti,
        expiredInMs
      );

      return tokens;
    } catch (err: unknown) {
      throw new InternalServerErrorException({
        statusCode: EnumAppStatusCodeError.unknown,
        message: 'http.serverError.internalServerError',
        _error: err,
      });
    }
  }

  async signUp(
    { email, password: passwordString, ...others }: AuthSignUpRequestDto,
    requestLog: IRequestLog
  ): Promise<void> {
    const [role, emailExist] = await Promise.all([
      this.roleService.findRoleByType(DefaultRoleType),
      this.userService.existByEmail(email),
    ]);
    if (!role) {
      throw new NotFoundException({
        statusCode: EnumRoleStatusCodeError.notFound,
        message: 'role.error.notFound',
      });
    } else if (emailExist) {
      throw new ConflictException({
        statusCode: EnumUserStatusCodeError.emailExist,
        message: 'user.error.emailExist',
      });
    }

    try {
      const userId = this.databaseUtil.createId();
      const password = this.authUtil.createPassword(userId, passwordString);
      const randomUsername = this.userService.createRandomUsername();
      const emailVerification = this.verificationUtil.createVerification(
        userId,
        EnumVerificationType.email
      );

      let created: IUser = undefined;
      await this.databaseService.$transaction(
        async (tx: Prisma.TransactionClient) => {
          created = await this.userService.createFromRegistration(
            userId,
            randomUsername,
            role.id,
            {
              email,
              password: passwordString,
              ...others,
            },
            password,
            { tx }
          );

          await this.verificationService.requestEmailVerification(
            userId,
            email,
            emailVerification,
            { tx }
          );

          await this.notificationService.initUserSetting(userId, { tx });

          await Object.values([
            EnumActivityLogAction.userCreated,
            EnumActivityLogAction.userSendVerificationEmail,
          ]).reduce(
            (acc, action) =>
              acc.then(
                () =>
                  this.activityLogService
                    .create(userId, action, requestLog, undefined, { tx })
                    .then(() => {}) // Fix map closure to ensure void return
              ),
            Promise.resolve()
          );
        }
      );

      // @note: send email after all creation
      await this.notificationUtil.sendWelcome(created.id, {
        expiredAt: this.helperService.dateFormatToIso(
          emailVerification.expiredAt
        ),
        reference: emailVerification.reference,
        link: emailVerification.encryptedLink,
        expiredInMinutes: emailVerification.expiredInMinutes,
      });
      return;
    } catch (err: unknown) {
      throw new InternalServerErrorException({
        statusCode: EnumAppStatusCodeError.unknown,
        message: 'http.serverError.internalServerError',
        _error: err,
      });
    }
  }

  async changePassword(
    user: IUser,
    { newPassword, oldPassword }: AuthChangePasswordRequestDto,
    requestLog: IRequestLog
  ): Promise<void> {
    if (!this.authUtil.validatePassword(oldPassword, user.password)) {
      await this.userService.increasePasswordAttempt(user.id);

      throw new BadRequestException({
        statusCode: EnumUserStatusCodeError.passwordNotMatch,
        message: 'auth.error.passwordNotMatch',
      });
    }

    try {
      const sessions = await this.sessionService.findActive(user.id);
      const password = this.authUtil.createPassword(user.id, newPassword);

      await this.databaseService.$transaction(
        async (tx: Prisma.TransactionClient) => {
          await this.userService.changeUserPassword(user.id, password, { tx });

          await this.sessionService.revokeAllActive(
            user.id,
            password.passwordCreated,
            { tx }
          );

          await this.activityLogService.create(
            user.id,
            EnumActivityLogAction.userChangePassword,
            requestLog,
            undefined,
            { tx }
          );
        }
      );

      await this.sessionUtil.deleteAllLogins(user.id, sessions);

      // @note: send email after all creation
      await this.notificationUtil.sendChangePassword(user.id);

      return;
    } catch (err: unknown) {
      throw new InternalServerErrorException({
        statusCode: EnumAppStatusCodeError.unknown,
        message: 'http.serverError.internalServerError',
        _error: err,
      });
    }
  }

  async logout(
    userId: string,
    sessionId: string,
    requestLog: IRequestLog
  ): Promise<void> {
    await this.sessionService.revoke(userId, sessionId, requestLog);
  }

  async verifyEmail(
    { token }: AuthVerifyEmailRequestDto,
    requestLog: IRequestLog
  ): Promise<void> {
    const hashedToken = this.verificationUtil.hashedToken(token);
    const verification =
      await this.verificationService.findValidEmailToken(hashedToken);
    if (!verification) {
      throw new BadRequestException({
        statusCode: EnumUserStatusCodeError.tokenInvalid,
        message: 'user.error.verificationTokenInvalid',
      });
    }

    try {
      await this.databaseService.$transaction(
        async (tx: Prisma.TransactionClient) => {
          await this.verificationService.confirmUserEmail(verification.id, {
            tx,
          });
          await this.userService.updateVerificationStatus(verification.userId, {
            tx,
          });
          await this.activityLogService.create(
            verification.userId,
            EnumActivityLogAction.userVerifiedEmail,
            requestLog,
            undefined,
            { tx }
          );
        }
      );

      // @note: send email after all creation
      await this.notificationUtil.sendVerifiedEmail(verification.userId, {
        reference: verification.reference,
      });

      return;
    } catch (err: unknown) {
      throw new InternalServerErrorException({
        statusCode: EnumAppStatusCodeError.unknown,
        message: 'http.serverError.internalServerError',
        _error: err,
      });
    }
  }

  async sendVerificationEmail(
    { email }: AuthSendEmailVerificationRequestDto,
    requestLog: IRequestLog
  ): Promise<void> {
    const user = await this.userService.findOneActiveByEmail(email);
    if (!user) {
      throw new NotFoundException({
        statusCode: EnumUserStatusCodeError.notFound,
        message: 'user.error.notFound',
      });
    } else if (user.isVerified) {
      throw new BadRequestException({
        statusCode: EnumUserStatusCodeError.emailAlreadyVerified,
        message: 'user.error.emailAlreadyVerified',
      });
    }

    const lastVerification =
      await this.verificationService.findLatestVerificationEmail(user.id);
    if (lastVerification) {
      const today = this.helperService.dateCreate();
      const canResendAt = this.helperService.dateForward(
        lastVerification.createdAt,
        Duration.fromObject({
          minutes: this.verificationUtil.verificationExpiredInMinutes,
        })
      );

      if (today < canResendAt) {
        throw new BadRequestException({
          statusCode:
            EnumUserStatusCodeError.verificationEmailResendLimitExceeded,
          message: 'user.error.verificationEmailResendLimitExceeded',
          messageProperties: {
            resendIn: this.helperService.dateDiff(today, canResendAt).minutes,
          },
        });
      }
    }

    try {
      const emailVerification = this.verificationUtil.createVerification(
        user.id,
        EnumVerificationType.email
      );

      await this.databaseService.$transaction(
        async (tx: Prisma.TransactionClient) => {
          await this.verificationService.requestEmailVerification(
            user.id,
            user.email,
            emailVerification,
            { tx }
          );

          await this.activityLogService.create(
            user.id,
            EnumActivityLogAction.userSendVerificationEmail,
            requestLog,
            undefined,
            { tx }
          );
        }
      );

      await this.notificationUtil.sendVerificationEmail(user.id, {
        expiredAt: this.helperService.dateFormatToIso(
          emailVerification.expiredAt
        ),
        reference: emailVerification.reference,
        link: emailVerification.encryptedLink,
        expiredInMinutes: emailVerification.expiredInMinutes,
      });

      return;
    } catch (err: unknown) {
      throw new InternalServerErrorException({
        statusCode: EnumAppStatusCodeError.unknown,
        message: 'http.serverError.internalServerError',
        _error: err,
      });
    }
  }

  async forgotPassword(
    { email }: AuthForgotPasswordRequestDto,
    requestLog: IRequestLog
  ): Promise<void> {
    const user = await this.userService.findOneActiveByEmail(email);
    if (!user) {
      throw new NotFoundException({
        statusCode: EnumUserStatusCodeError.notFound,
        message: 'user.error.notFound',
      });
    }

    const lastForgotPassword =
      await this.userService.findOneLatestByForgotPassword(user.id);
    if (lastForgotPassword) {
      const today = this.helperService.dateCreate();
      const canResendAt = this.helperService.dateForward(
        lastForgotPassword.createdAt,
        Duration.fromObject({
          minutes: this.verificationUtil.forgotResendInMinutes,
        })
      );

      if (today < canResendAt) {
        throw new BadRequestException({
          statusCode:
            EnumUserStatusCodeError.forgotPasswordRequestLimitExceeded,
          message: 'user.error.forgotPasswordRequestLimitExceeded',
          messageProperties: {
            resendIn: this.helperService.dateDiff(today, canResendAt).minutes,
          },
        });
      }
    }

    try {
      const resetPassword = this.verificationUtil.forgotPasswordCreate(user.id);

      await this.databaseService.$transaction(
        async (tx: Prisma.TransactionClient) => {
          await this.userService.createForgotPasswordRequest(
            user.id,
            email,
            resetPassword
          );

          await this.activityLogService.create(
            user.id,
            EnumActivityLogAction.userForgotPassword,
            requestLog,
            undefined,
            { tx }
          );
        }
      );

      await this.notificationUtil.sendForgotPassword(user.id, {
        expiredAt: this.helperService.dateFormatToIso(resetPassword.expiredAt),
        link: resetPassword.encryptedLink,
        reference: resetPassword.reference,
        expiredInMinutes: resetPassword.expiredInMinutes,
        resendInMinutes: resetPassword.resendInMinutes,
      });

      return;
    } catch (err: unknown) {
      throw new InternalServerErrorException({
        statusCode: EnumAppStatusCodeError.unknown,
        message: 'http.serverError.internalServerError',
        _error: err,
      });
    }
  }

  async resetPassword(
    { newPassword, token }: AuthForgotPasswordResetRequestDto,
    requestLog: IRequestLog
  ): Promise<void> {
    const hashedToken = this.verificationUtil.hashedToken(token);
    const resetPassword =
      await this.userService.findOneActiveByForgotPasswordToken(hashedToken);
    if (!resetPassword) {
      throw new NotFoundException({
        statusCode: EnumUserStatusCodeError.notFound,
        message: 'user.error.notFound',
      });
    }

    try {
      const sessions = await this.sessionService.findActive(
        resetPassword.userId
      );
      const password = this.authUtil.createPassword(
        resetPassword.userId,
        newPassword
      );

      await this.databaseService.$transaction(
        async (tx: Prisma.TransactionClient) => {
          await this.userService.resetPassword(
            resetPassword.userId,
            resetPassword.id,
            password,
            { tx }
          );

          await this.activityLogService.create(
            resetPassword.userId,
            EnumActivityLogAction.userResetPassword,
            requestLog,
            undefined,
            { tx }
          );

          await this.sessionService.revokeAllActive(
            resetPassword.userId,
            password.passwordCreated,
            { tx }
          );
        }
      );

      // Clear sessions from cache AFTER transaction succeeds
      await this.sessionUtil.deleteAllLogins(resetPassword.userId, sessions);

      // @note: send email after all creation
      await this.notificationUtil.sendResetPassword(resetPassword.userId);

      return;
    } catch (err: unknown) {
      throw new InternalServerErrorException({
        statusCode: EnumAppStatusCodeError.unknown,
        message: 'http.serverError.internalServerError',
        _error: err,
      });
    }
  }

  private async createTokenAndSession(
    user: IUser,
    device: DeviceRequestDto,
    loginFrom: EnumUserLoginFrom,
    loginWith: EnumUserLoginWith,
    loginAt: Date,
    requestLog: IRequestLog
  ): Promise<AuthTokenResponseDto> {
    const { tokens, sessionId, jti } = this.authUtil.createTokens(
      user,
      loginFrom,
      loginWith
    );
    const expiredAt = this.helperService.dateForward(
      loginAt,
      Duration.fromObject({
        seconds: this.authUtil.jwtRefreshTokenExpirationTimeInSeconds,
      })
    );

    // 1. Orchestrate DB operations: device upsert, user metadata, session creation, activity log
    const { isNewDevice, deviceOwnershipId } =
      await this.deviceService.upsertForLogin(user.id, device);

    // 1.5. Revoke old active sessions for this device ownership
    const activeSessions =
      await this.sessionService.findActiveByDeviceOwnership(
        user.id,
        deviceOwnershipId
      );

    if (activeSessions.length > 0) {
      await Promise.all([
        this.sessionService.revokeByDeviceOwnership(deviceOwnershipId, user.id),
        this.sessionUtil.deleteAllLogins(user.id, activeSessions),
      ]);
    }

    await Promise.all([
      this.userService.updateLoginMetadata(
        user.id,
        { loginFrom, loginWith },
        requestLog.ipAddress
      ),
      this.sessionService.createForLogin(
        user.id,
        { sessionId, jti, expiredAt, deviceOwnershipId },
        requestLog
      ),
      this.activityLogService.create(
        user.id,
        loginWith === EnumUserLoginWith.socialApple
          ? EnumActivityLogAction.userLoginApple
          : loginWith === EnumUserLoginWith.socialGoogle
            ? EnumActivityLogAction.userLoginGoogle
            : EnumActivityLogAction.userLoginCredential,
        requestLog
      ),
    ]);

    // 2. Cache operations (outside of DB transaction scope)
    const cachePromises: Promise<any>[] = [
      this.sessionUtil.setLogin(user.id, sessionId, jti, expiredAt),
    ];

    if (isNewDevice) {
      cachePromises.push(
        this.notificationUtil.sendNewDeviceLogin(user.id, {
          requestLog,
          loginFrom,
          loginWith,
          loginAt: this.helperService.dateFormatToIso(loginAt),
        })
      );
    }

    await Promise.all(cachePromises);

    return tokens;
  }

  private async handleLogin(
    user: IUser,
    device: DeviceRequestDto,
    loginFrom: EnumUserLoginFrom,
    loginWith: EnumUserLoginWith,
    loginAt: Date,
    requestLog: IRequestLog
  ): Promise<AuthLoginResponseDto> {
    if (!user.isVerified) {
      const emailVerification = this.verificationUtil.createVerification(
        user.id,
        EnumVerificationType.email
      );

      await this.databaseService.$transaction(
        async (tx: Prisma.TransactionClient) => {
          await this.verificationService.requestEmailVerification(
            user.id,
            user.email,
            emailVerification,
            { tx }
          );

          await this.activityLogService.create(
            user.id,
            EnumActivityLogAction.userSendVerificationEmail,
            requestLog,
            undefined,
            { tx }
          );
        }
      );

      // send notification after all creation
      await this.notificationUtil.sendVerificationEmail(user.id, {
        expiredAt: this.helperService.dateFormatToIso(
          emailVerification.expiredAt
        ),
        reference: emailVerification.reference,
        link: emailVerification.encryptedLink,
        expiredInMinutes: emailVerification.expiredInMinutes,
      });

      throw new ForbiddenException({
        statusCode: EnumUserStatusCodeError.emailNotVerified,
        message: 'user.error.emailNotVerified',
      });
    }

    const tokens = await this.createTokenAndSession(
      user,
      device,
      loginFrom,
      loginWith,
      loginAt,
      requestLog
    );

    return {
      tokens,
    };
  }
}
