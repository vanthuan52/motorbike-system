import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { Duration } from 'luxon';
import { TokenPayload } from 'google-auth-library';
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
  EnumUserSignUpFrom,
  EnumUserSignUpWith,
} from '@/modules/user/enums/user.enum';
import { EnumSessionStatusCodeError } from '@/modules/session/enums/session.status-code.enum';
import { SessionUtil } from '@/modules/session/utils/session.util';
import { EnumUserStatusCodeError } from '@/modules/user/enums/user.status-code.enum';
import { UserService } from '@/modules/user/services/user.service';
import { IResponseReturn } from '@/common/response/interfaces/response.interface';
import { EnumAppStatusCodeError } from '@/app/enums/app.status-code.enum';
import { UserLoginRequestDto } from '@/modules/auth/dtos/request/auth.login.request.dto';
import { UserCreateSocialRequestDto } from '@/modules/auth/dtos/request/auth.create-social.request.dto';
import { AuthSignUpRequestDto } from '@/modules/auth/dtos/request/auth.sign-up.request.dto';
import { RoleService } from '@/modules/role/services/role.service';
import { SessionService } from '@/modules/session/services/session.service';
import { EnumRoleStatusCodeError } from '@/modules/role/enums/role.status-code.enum';
import { AuthChangePasswordRequestDto } from '../dtos/request/auth.change-password.request.dto';
import { UserCreateBySignUpRequestDto } from '@/modules/user/dtos/request/user.create-by-sign-up.request.dto';
import { DefaultRole } from '../constants/auth.constant';
import { UserForgotPasswordRequestDto } from '@/modules/user/dtos/request/user.forgot-password.request.dto';
import { UserForgotPasswordResetRequestDto } from '@/modules/user/dtos/request/user.forgot-password-reset.request.dto';
import { IUser } from '@/modules/user/interfaces/user.interface';

/**
 * Authentication service handling JWT token operations, session validation,
 * and social authentication (Google, Apple). Manages token creation, refresh,
 * and authentication guard validations for secure user access.
 */
@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly userService: UserService,
    private readonly roleService: RoleService,
    private readonly sessionService: SessionService,
    private readonly helperService: HelperService,
    private readonly authUtil: AuthUtil,
    private readonly sessionUtil: SessionUtil,
    private readonly databaseUtil: DatabaseUtil
  ) {}

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

  /**
   * Creates both access and refresh tokens for a user session.
   *
   * Generates JWT tokens with current timestamp, unique session ID, and unique token identifier (jti)
   * for session tracking and security validation.
   *
   * @param user - The user entity containing profile and role information
   * @param loginFrom - The source/platform of the login (website, mobile, etc.)
   * @param loginWith - The authentication method used for sign-up (email, google, apple, etc.)
   * @returns Token response object containing access token, refresh token, expiration time, jti, and sessionId
   */
  createTokens(
    user: IUser,
    loginFrom: EnumUserLoginFrom,
    loginWith: EnumUserLoginWith
  ): IAuthAccessTokenGenerate {
    const loginDate = this.helperService.dateCreate();

    const sessionId = this.databaseUtil.createId();
    const jti = this.authUtil.generateJti();
    const payloadAccessToken: IAuthJwtAccessTokenPayload =
      this.authUtil.createPayloadAccessToken(
        user,
        sessionId,
        loginDate,
        loginFrom,
        loginWith
      );
    const accessToken: string = this.authUtil.createAccessToken(
      user._id,
      jti,
      payloadAccessToken
    );

    const payloadRefreshToken: IAuthJwtRefreshTokenPayload =
      this.authUtil.createPayloadRefreshToken(payloadAccessToken);
    const refreshToken: string = this.authUtil.createRefreshToken(
      user._id,
      jti,
      payloadRefreshToken
    );

    const tokens: AuthTokenResponseDto = {
      tokenType: this.authUtil.jwtPrefix,
      roleType: user.role.type,
      expiresIn: this.authUtil.jwtAccessTokenExpirationTimeInSeconds,
      accessToken,
      refreshToken,
    };

    return {
      tokens,
      jti,
      sessionId,
    };
  }

  /**
   * Refreshes an access token using a valid refresh token.
   *
   * This method extracts session and user information from the provided refresh token, then generates a new access token
   * and a new refresh token with a new token identifier (jti). The new refresh token's expiration is adjusted based on the
   * remaining validity of the original refresh token, ensuring the session does not extend beyond its original lifetime.
   *
   * @param user - The user entity containing profile and role information
   * @param refreshTokenFromRequest - The existing refresh token to extract session and expiration data from
   * @returns IAuthRefreshTokenGenerate object containing the new access token, new refresh token (with adjusted expiry), new jti, sessionId, and remaining expiration in ms
   */
  generateRefreshTokens(
    user: IUserDoc,
    refreshTokenFromRequest: string
  ): IAuthRefreshTokenGenerate {
    const {
      sessionId,
      loginAt,
      loginFrom,
      loginWith,
      exp: oldExp,
    } = this.authUtil.payloadToken<IAuthJwtRefreshTokenPayload>(
      refreshTokenFromRequest
    );

    const jti = this.authUtil.generateJti();
    const payloadAccessToken: IAuthJwtAccessTokenPayload =
      this.authUtil.createPayloadAccessToken(
        user,
        sessionId,
        loginAt,
        loginFrom,
        loginWith
      );
    const accessToken: string = this.authUtil.createAccessToken(
      user.id,
      jti,
      payloadAccessToken
    );

    const newPayloadRefreshToken: IAuthJwtRefreshTokenPayload =
      this.authUtil.createPayloadRefreshToken(payloadAccessToken);

    const today = this.helperService.dateCreate();
    const expiredAt = this.helperService.dateCreateFromTimestamp(oldExp * 1000);

    const newRefreshTokenExpire = this.helperService.dateDiff(expiredAt, today);
    const newRefreshTokenExpireInSeconds = newRefreshTokenExpire.seconds
      ? newRefreshTokenExpire.seconds
      : Math.floor(newRefreshTokenExpire.milliseconds / 1000);

    const newRefreshToken: string = this.authUtil.createRefreshToken(
      user.id,
      jti,
      newPayloadRefreshToken,
      newRefreshTokenExpireInSeconds
    );

    const tokens: AuthTokenResponseDto = {
      tokenType: this.authUtil.jwtPrefix,
      roleType: user.role.type,
      expiresIn: this.authUtil.jwtAccessTokenExpirationTimeInSeconds,
      accessToken,
      refreshToken: newRefreshToken,
    };

    return {
      tokens,
      jti,
      sessionId,
      expiredInMs: newRefreshTokenExpire.milliseconds,
    };
  }

  // Api Service

  async loginCredential(
    { email, password, from, device }: UserLoginRequestDto,
    requestLog: IRequestLog
  ): Promise<IResponseReturn<UserLoginResponseDto>> {
    const user = await this.userRepository.findOneWithRoleByEmail(email);
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

    if (this.authUtil.checkPasswordAttempt(user)) {
      await this.userRepository.reachMaxPasswordAttempt(user.id, requestLog);

      throw new ForbiddenException({
        statusCode: EnumUserStatusCodeError.passwordAttemptMax,
        message: 'auth.error.passwordAttemptMax',
      });
    } else if (!this.authUtil.validatePassword(password, user.password)) {
      await this.userRepository.increasePasswordAttempt(user.id);

      throw new BadRequestException({
        statusCode: EnumUserStatusCodeError.passwordNotMatch,
        message: 'auth.error.passwordNotMatch',
      });
    }

    await this.userRepository.resetPasswordAttempt(user.id);

    const checkPasswordExpired: boolean = this.authUtil.checkPasswordExpired(
      user.passwordExpired
    );
    if (checkPasswordExpired) {
      throw new ForbiddenException({
        statusCode: EnumUserStatusCodeError.passwordExpired,
        message: 'auth.error.passwordExpired',
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
    { from, device, ...others }: UserCreateSocialRequestDto,
    requestLog: IRequestLog
  ): Promise<IResponseReturn<UserLoginResponseDto>> {
    const featureFlag = await this.featureFlagUtil.getMetadataByKeyAndCache<{
      signUpAllowed: boolean;
    }>(
      loginWith === EnumUserLoginWith.socialGoogle
        ? 'loginWithGoogle'
        : 'loginWithApple'
    );
    let user = await this.userRepository.findOneWithRoleByEmail(email);

    if (!user && featureFlag.signUpAllowed) {
      const role = await this.roleRepository.existByName(this.userRoleName);
      if (!role) {
        throw new NotFoundException({
          statusCode: EnumRoleStatusCodeError.notFound,
          message: 'role.error.notFound',
        });
      }

      const randomUsername = this.userUtil.createRandomUsername();
      user = await this.userRepository.createBySocial(
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
      const updatedUser = await this.userRepository.verify(user.id, requestLog);
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

  async signUp(
    {
      countryId,
      email,
      password: passwordString,
      ...others
    }: UserSignUpRequestDto,
    requestLog: IRequestLog
  ): Promise<IResponseReturn<void>> {
    const [role, emailExist, checkCountry] = await Promise.all([
      this.roleRepository.existByName(this.userRoleName),
      this.userRepository.existByEmail(email),
      this.countryRepository.existById(countryId),
    ]);
    if (!role) {
      throw new NotFoundException({
        statusCode: EnumRoleStatusCodeError.notFound,
        message: 'role.error.notFound',
      });
    } else if (!checkCountry) {
      throw new NotFoundException({
        statusCode: EnumCountryStatusCodeError.notFound,
        message: 'country.error.notFound',
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
      const randomUsername = this.userUtil.createRandomUsername();
      const emailVerification = this.userUtil.verificationCreateVerification(
        userId,
        EnumVerificationType.email
      );

      const created = await this.userRepository.signUp(
        userId,
        randomUsername,
        role.id,
        {
          countryId,
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

  async verifyEmail(
    { token }: UserVerifyEmailRequestDto,
    requestLog: IRequestLog
  ): Promise<IResponseReturn<void>> {
    const hashedToken = this.userUtil.hashedToken(token);
    const verification =
      await this.userRepository.findOneActiveByVerificationEmailToken(
        hashedToken
      );
    if (!verification) {
      throw new BadRequestException({
        statusCode: EnumUserStatusCodeError.tokenInvalid,
        message: 'user.error.verificationTokenInvalid',
      });
    }

    try {
      await this.userRepository.verifyEmail(
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
    { email }: UserSendEmailVerificationRequestDto,
    requestLog: IRequestLog
  ): Promise<IResponseReturn<void>> {
    const user = await this.userRepository.findOneActiveByEmail(email);
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
      await this.userRepository.findOneLatestByVerificationEmail(user.id);
    if (lastVerification) {
      const today = this.helperService.dateCreate();
      const canResendAt = this.helperService.dateForward(
        lastVerification.createdAt,
        Duration.fromObject({
          minutes: this.userUtil.verificationExpiredInMinutes,
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
      const emailVerification = this.userUtil.verificationCreateVerification(
        user.id,
        EnumVerificationType.email
      );

      await this.userRepository.requestVerificationEmail(
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
    { email }: UserForgotPasswordRequestDto,
    requestLog: IRequestLog
  ): Promise<IResponseReturn<void>> {
    const user = await this.userRepository.findOneActiveByEmail(email);
    if (!user) {
      throw new NotFoundException({
        statusCode: EnumUserStatusCodeError.notFound,
        message: 'user.error.notFound',
      });
    }

    const lastForgotPassword =
      await this.userRepository.findOneLatestByForgotPassword(user.id);
    if (lastForgotPassword) {
      const today = this.helperService.dateCreate();
      const canResendAt = this.helperService.dateForward(
        lastForgotPassword.createdAt,
        Duration.fromObject({
          minutes: this.userUtil.forgotResendInMinutes,
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
      const resetPassword = this.userUtil.forgotPasswordCreate(user.id);

      await this.userRepository.forgotPassword(
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
    {
      newPassword,
      token,
      backupCode,
      code,
      method,
    }: UserForgotPasswordResetRequestDto,
    requestLog: IRequestLog
  ): Promise<IResponseReturn<void>> {
    const hashedToken = this.userUtil.hashedToken(token);
    const resetPassword =
      await this.userRepository.findOneActiveByForgotPasswordToken(hashedToken);
    if (!resetPassword) {
      throw new NotFoundException({
        statusCode: EnumUserStatusCodeError.notFound,
        message: 'user.error.notFound',
      });
    }

    const passwordHistories =
      await this.passwordHistoryRepository.findActiveUser(resetPassword.userId);
    const passwordCheck = this.authUtil.checkPasswordPeriod(
      passwordHistories,
      newPassword
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

    let twoFactorVerified: IAuthTwoFactorVerifyResult | undefined;
    if (resetPassword.user.twoFactor.enabled) {
      twoFactorVerified = await this.handleTwoFactorValidation(
        resetPassword.user,
        {
          code,
          backupCode,
          method,
        }
      );
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
        this.userRepository.resetPassword(
          resetPassword.userId,
          resetPassword.id,
          password,
          requestLog
        ),
        this.sessionUtil.deleteAllLogins(resetPassword.userId, sessions),
        twoFactorVerified
          ? this.userRepository.verifyTwoFactor(
              resetPassword.userId,
              twoFactorVerified,
              requestLog
            )
          : Promise.resolve(),
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

  /**
   * Refreshes user access token using a valid refresh token.
   *
   * Fetches user, validates session, generates new tokens, and updates session and user info.
   *
   * @param user - The user entity containing profile and role information
   * @param refreshToken - The refresh token from request
   * @param requestLog - Request logging info (IP, user agent)
   * @returns Token response containing new access and refresh tokens
   */
  async refresh(
    user: IUser,
    refreshToken: string,
    requestLog: IRequestLog
  ): Promise<IResponseReturn<AuthTokenResponseDto>> {
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
        this.userRepository.refresh(
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

      return {
        data: tokens,
      };
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
      await this.userRepository.login(
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
  ): Promise<IResponseReturn<UserLoginResponseDto>> {
    if (!user.isVerified) {
      const emailVerification = this.userUtil.verificationCreateVerification(
        user.id,
        EnumVerificationType.email
      );

      await this.userRepository.requestVerificationEmail(
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

    if (!user.twoFactor.enabled) {
      const tokens = await this.createTokenAndSession(
        user,
        device,
        loginFrom,
        loginWith,
        loginAt,
        requestLog
      );

      return {
        data: {
          isTwoFactorEnable: false,
          tokens,
        },
      };
    }

    const { challengeToken, expiresInMs } =
      await this.authTwoFactorUtil.createChallenge({
        userId: user.id,
        device,
        loginFrom,
        loginWith,
      });
    if (user.twoFactor.requiredSetup) {
      const { encryptedSecret, otpauthUrl, secret, iv } =
        await this.authTwoFactorUtil.setupTwoFactor(user.email);
      await this.userRepository.setupTwoFactor(
        user.id,
        encryptedSecret,
        iv,
        requestLog
      );

      return {
        data: {
          isTwoFactorEnable: true,
          twoFactor: {
            isRequiredSetup: true,
            challengeToken,
            challengeExpiresInMs: expiresInMs,
            backupCodesRemaining: user.twoFactor.backupCodes.length ?? 0,
            otpauthUrl,
            secret,
          },
        },
      };
    }

    return {
      data: {
        isTwoFactorEnable: true,
        twoFactor: {
          isRequiredSetup: false,
          challengeToken,
          challengeExpiresInMs: expiresInMs,
          backupCodesRemaining: user.twoFactor.backupCodes.length ?? 0,
        },
      },
    };
  }
}
