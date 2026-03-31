import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { TokenPayload } from 'google-auth-library';
import { Duration } from 'luxon';
import { DatabaseUtil } from '@/common/database/utils/database.util';
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
  IAuthAccessTokenGenerate,
  IAuthRefreshTokenGenerate,
} from '@/modules/auth/interfaces/auth.interface';
import { IAuthService } from '@/modules/auth/interfaces/auth.service.interface';
import { AuthUtil } from '@/modules/auth/utils/auth.util';
import {
  EnumUserLoginFrom,
  EnumUserLoginWith,
  EnumUserStatus,
} from '@/modules/user/enums/user.enum';
import { EnumUserStatusCodeError } from '@/modules/user/enums/user.status-code.enum';
import { UserService } from '@/modules/user/services/user.service';
import { EnumSessionStatusCodeError } from '@/modules/session/enums/session.status-code.enum';
import { SessionRepository } from '@/modules/session/repositories/session.repository';
import { SessionUtil } from '@/modules/session/utils/session.util';
import { VerificationService } from '@/modules/verification/services/verification.service';
import { IResponseReturn } from '@/common/response/interfaces/response.interface';
import { EnumAppStatusCodeError } from '@/app/enums/app.status-code.enum';
import { AuthLoginRequestDto } from '@/modules/auth/dtos/request/auth.login.request.dto';
import { AuthCreateSocialRequestDto } from '@/modules/auth/dtos/request/auth.create-social.request.dto';
import { AuthSignUpRequestDto } from '@/modules/auth/dtos/request/auth.sign-up.request.dto';
import { RoleService } from '@/modules/role/services/role.service';
import { SessionService } from '@/modules/session/services/session.service';
import { EnumRoleStatusCodeError } from '@/modules/role/enums/role.status-code.enum';
import { AuthChangePasswordRequestDto } from '@/modules/auth/dtos/request/auth.change-password.request.dto';
import { DefaultRole } from '../constants/auth.constant';
import { AuthForgotPasswordRequestDto } from '@/modules/auth/dtos/request/auth.forgot-password.request.dto';
import { AuthForgotPasswordResetRequestDto } from '@/modules/auth/dtos/request/auth.forgot-password-reset.request.dto';
import { IUser } from '@/modules/user/interfaces/user.interface';
import { AuthLoginResponseDto } from '../dtos/response/auth.login.response.dto';
import { VerificationUtil } from '@/modules/verification/utils/verification.util';
import { AuthVerifyEmailRequestDto } from '../dtos/request/auth.verify-email.request.dto';
import { AuthSendEmailVerificationRequestDto } from '../dtos/request/auth.send-email-verification.request.dto';
import { DeviceRequestDto } from '@/modules/device/dtos/requests/device.request.dto';
import { NotificationUtil } from '@/modules/notification/utils/notification.util';
import { EnumVerificationType } from '@/modules/verification/enums/verification.enum';

/**
 * Authentication service handling JWT token operations, session validation,
 * and social authentication (Google, Apple). Manages token creation, refresh,
 * and authentication guard validations for secure user access.
 */
@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly userService: UserService,
    private readonly sessionRepository: SessionRepository,
    private readonly verificationService: VerificationService,
    private readonly roleService: RoleService,
    private readonly sessionService: SessionService,
    private readonly helperService: HelperService,
    private readonly authUtil: AuthUtil,
    private readonly verificationUtil: VerificationUtil,
    private readonly sessionUtil: SessionUtil,
    private readonly databaseUtil: DatabaseUtil,
    private readonly notificationUtil: NotificationUtil
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
      const role = await this.roleService.findRoleByName(this.userRoleName);
      if (!role) {
        throw new NotFoundException({
          statusCode: EnumRoleStatusCodeError.notFound,
          message: 'role.error.notFound',
        });
      }

      const randomUsername = this.userService.createRandomUsername();
      user = await this.userService.createBySocial(
        email,
        randomUsername,
        role.id,
        loginWith,
        { from, device, ...others },
        requestLog
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
      const updatedUser = await this.verificationService.updateVerified(
        user.id,
        requestLog
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

      await Promise.all([
        this.sessionUtil.updateLogin(
          userId,
          sessionId,
          session,
          newJti,
          expiredInMs
        ),
        this.userService.updateLoginMetadata(
          userId,
          {
            sessionId,
            jti: newJti,
            expiredAt: session.expiredAt,
            loginFrom: loginFrom,
            loginWith: loginWith,
          },
          requestLog
        ),
      ]);

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
      this.roleService.findRoleByName(this.userRoleName),
      this.userService.findOneByEmail(email),
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

      const created = await this.userService.createFromRegistration(
        userId,
        randomUsername,
        role.id,
        {
          email,
          password: passwordString,
          ...others,
        },
        password,
        emailVerification,
        requestLog
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
    if (this.authUtil.checkPasswordAttempt(user)) {
      throw new ForbiddenException({
        statusCode: EnumUserStatusCodeError.passwordAttemptMax,
        message: 'auth.error.passwordAttemptMax',
      });
    } else if (!this.authUtil.validatePassword(oldPassword, user.password)) {
      await this.userService.increasePasswordAttempt(user.id);

      throw new BadRequestException({
        statusCode: EnumUserStatusCodeError.passwordNotMatch,
        message: 'auth.error.passwordNotMatch',
      });
    }

    await this.userService.resetPasswordAttempt(user.id);

    try {
      const sessions = await this.sessionRepository.findActive(user.id);
      const password = this.authUtil.createPassword(user.id, newPassword);

      await Promise.all([
        this.userService.changeUserPassword(user.id, password, requestLog),
        this.sessionUtil.deleteAllLogins(user.id, sessions),
      ]);

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
      await this.verificationService.confirmUserEmail(
        verification.id,
        verification.userId,
        requestLog
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

      await this.verificationService.requestEmailVerification(
        user.id,
        user.email,
        emailVerification,
        requestLog
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

      await this.userService.forgotPassword(
        user.id,
        email,
        resetPassword,
        requestLog
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

    const passwordCheck = this.authUtil.passwordCheck(
      newPassword,
      resetPassword.user.password
    );

    if (passwordCheck) {
      throw new BadRequestException({
        statusCode: EnumUserStatusCodeError.passwordMustNew,
        message: 'auth.error.passwordMustNew',
        messageProperties: {
          period: this.authUtil.getPasswordPeriodInDays(),
        },
      });
    }

    try {
      const sessions = await this.sessionRepository.findActive(
        resetPassword.userId
      );
      const password = this.authUtil.createPassword(
        resetPassword.userId,
        newPassword
      );

      await Promise.all([
        this.userService.resetPasswordWithToken(
          resetPassword.userId,
          resetPassword.id,
          password,
          requestLog
        ),
        this.sessionUtil.deleteAllLogins(resetPassword.userId, sessions),
      ]);

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

    const { isNewDevice, sessionShouldBeInactive } =
      await this.userService.loginUser(
        user.id,
        device,
        {
          loginFrom,
          loginWith,
          jti,
          sessionId,
          expiredAt,
        },
        requestLog
      );

    const promises = [
      this.sessionUtil.setLogin(user.id, sessionId, jti, expiredAt),
    ];

    if (sessionShouldBeInactive.length > 0) {
      promises.push(
        this.sessionUtil.deleteAllLogins(user.id, sessionShouldBeInactive)
      );
    }

    if (isNewDevice) {
      promises.push(
        this.notificationUtil.sendNewDeviceLogin(user.id, {
          requestLog,
          loginFrom,
          loginWith,
          loginAt: this.helperService.dateFormatToIso(loginAt),
        })
      );
    }

    await Promise.all(promises);

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

      await this.verificationService.requestEmailVerification(
        user.id,
        user.email,
        emailVerification,
        requestLog
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

    return {};
  }
}
