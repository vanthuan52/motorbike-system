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
import { IUserDoc } from '@/modules/user/interfaces/user.interface';
import {
  EnumUserLoginFrom,
  EnumUserLoginWith,
  EnumUserStatus,
} from '@/modules/user/enums/user.enum';
import { EnumSessionStatusCodeError } from '@/modules/session/enums/session.status-code.enum';
import { SessionUtil } from '@/modules/session/utils/session.util';
import { EnumUserStatusCodeError } from '@/modules/user/enums/user.status-code.enum';
import { UserService } from '@/modules/user/services/user.service';
import { IResponseReturn } from '@/common/response/interfaces/response.interface';
import { EnumAppStatusCodeError } from '@/app/enums/app.status-code.enum';
import { UserLoginRequestDto } from '@/modules/auth/dtos/request/auth.login.request.dto';
import { UserCreateSocialRequestDto } from '@/modules/user/dtos/request/user.create-social.request.dto';
import { AuthSignUpRequestDto } from '@/modules/auth/dtos/request/auth.sign-up.request.dto';
import { RoleService } from '@/modules/role/services/role.service';
import { SessionService } from '@/modules/session/services/session.service';
import { EnumRoleStatusCodeError } from '@/modules/role/enums/role.status-code.enum';
import {
  EnumUserSignUpFrom,
  EnumUserSignUpWith,
} from '@/modules/user/enums/user.enum';
import { AuthChangePasswordRequestDto } from '../dtos/request/auth.change-password.request.dto';
import { UserCreateBySignUpRequestDto } from '@/modules/user/dtos/request/user.create-by-sign-up.request.dto';
import { DefaultRole } from '../constants/auth.constant';
import { UserForgotPasswordRequestDto } from '@/modules/user/dtos/request/user.forgot-password.request.dto';
import { UserForgotPasswordResetRequestDto } from '@/modules/user/dtos/request/user.forgot-password-reset.request.dto';

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
    user: IUserDoc,
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

  /**
   * Authenticates user with email/password credentials.
   *
   * Validates user exists and is active, checks password attempts,
   * verifies password, creates tokens, and establishes session.
   *
   * @param body - Login credentials (email, password, from)
   * @param requestLog - Request logging info (IP, user agent)
   * @returns Token response containing access and refresh tokens
   * @throws {NotFoundException} When user not found
   * @throws {ForbiddenException} When user inactive or max password attempts reached
   * @throws {BadRequestException} When password not set or not match
   */
  async loginCredential(
    { email, password, from }: UserLoginRequestDto,
    requestLog: IRequestLog
  ): Promise<AuthTokenResponseDto> {
    const user: IUserDoc = await this.userService.findOneWithRole({
      email,
    });
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
      // Set user status to inactive
      await this.userService.updateStatus(user._id, {
        status: EnumUserStatus.inactive,
      });

      throw new ForbiddenException({
        statusCode: EnumUserStatusCodeError.passwordAttemptMax,
        message: 'auth.error.passwordAttemptMax',
      });
    } else if (!this.authUtil.validatePassword(password, user.password)) {
      await this.userService.incrementUserPasswordAttempt(user._id);

      throw new BadRequestException({
        statusCode: EnumUserStatusCodeError.passwordNotMatch,
        message: 'auth.error.passwordNotMatch',
      });
    }

    await this.userService.resetUserPasswordAttempt(user._id);

    const { tokens, sessionId, jti } = this.createTokens(
      user,
      from,
      EnumUserLoginWith.credential
    );
    const expiredAt = this.helperService.dateForward(
      this.helperService.dateCreate(),
      Duration.fromObject({
        seconds: this.authUtil.jwtRefreshTokenExpirationTimeInSeconds,
      })
    );

    await Promise.all([
      this.sessionUtil.setLogin(user._id, sessionId, jti, expiredAt),
      this.userService.updateLogin(
        user._id,
        {
          loginFrom: from,
          loginWith: EnumUserLoginWith.credential,
          sessionId,
          expiredAt,
          jti,
        },
        requestLog
      ),
    ]);

    return tokens;
  }

  /**
   * Authenticates user via social login (Google, Apple).
   *
   * If user doesn't exist, creates new user. Validates user status,
   * creates tokens, and establishes session.
   *
   * @param email - User's email from social provider
   * @param loginWith - Social login provider (google, apple)
   * @param body - Social user creation data
   * @param requestLog - Request logging info (IP, user agent)
   * @returns Token response containing access and refresh tokens
   */
  async loginWithSocial(
    email: string,
    loginWith: EnumUserLoginWith,
    { from, ...others }: UserCreateSocialRequestDto,
    requestLog: IRequestLog
  ): Promise<AuthTokenResponseDto> {
    // Delegate user fetching/creation to UserService
    const user = await this.userService.findOrCreateUserBySocial(
      email,
      loginWith,
      { from, ...others },
      requestLog
    );

    if (user.status !== EnumUserStatus.active) {
      throw new ForbiddenException({
        statusCode: EnumUserStatusCodeError.inactiveForbidden,
        message: 'user.error.inactive',
      });
    }
    const promises = [];
    if (!user.isVerified) {
      promises.push(this.userService.updateVerify(user._id, true));
    }

    const { tokens, jti, sessionId } = this.createTokens(user, from, loginWith);
    const expiredAt = this.helperService.dateForward(
      this.helperService.dateCreate(),
      Duration.fromObject({
        seconds: this.authUtil.jwtRefreshTokenExpirationTimeInSeconds,
      })
    );

    await Promise.all([
      ...promises,
      this.sessionUtil.setLogin(user._id, sessionId, jti, expiredAt),
      this.userService.updateLogin(
        user._id,
        {
          loginFrom: from,
          jti,
          loginWith,
          sessionId,
          expiredAt,
        },
        requestLog
      ),
    ]);

    return tokens;
  }

  async signUp(
    dto: AuthSignUpRequestDto,
    requestLog: IRequestLog
  ): Promise<void> {
    const [role, emailExist] = await Promise.all([
      this.roleService.findOneByName(DefaultRole),
      this.userService.existByEmail(dto.email),
    ]);

    if (!role) {
      throw new NotFoundException({
        statusCode: EnumRoleStatusCodeError.notFound,
        message: 'role.error.notFound',
      });
    }

    if (emailExist) {
      throw new ConflictException({
        statusCode: EnumUserStatusCodeError.emailExist,
        message: 'user.error.emailExist',
      });
    }

    const { passwordHash } = this.authUtil.createPassword(dto.password);

    const data: UserCreateBySignUpRequestDto = {
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      passwordHash,
      roleId: role._id,
      signUpFrom: EnumUserSignUpFrom.website,
      signUpWith: EnumUserSignUpWith.credential,
    };

    await this.userService.createBySignUp(data);
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
  async refreshToken(
    user: IUserDoc,
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

    const {
      jti: newJti,
      tokens,
      expiredInMs,
    } = this.generateRefreshTokens(user, refreshToken);

    await this.sessionUtil.updateLogin(
      userId,
      sessionId,
      session,
      newJti,
      expiredInMs
    );

    const expiredAt = this.helperService.dateForward(
      this.helperService.dateCreate(),
      Duration.fromObject({ milliseconds: expiredInMs })
    );
    const { ipAddress, userAgent } = requestLog;

    await Promise.all([
      this.userService.updateLogin(
        user._id,
        {
          loginFrom,
          loginWith,
          sessionId,
          expiredAt,
          jti: newJti,
        },
        {
          ipAddress,
          userAgent,
        }
      ),
      this.sessionService.updateJti(sessionId, newJti),
    ]);

    return tokens;
  }

  async changePassword(
    user: IUserDoc,
    { newPassword, oldPassword }: AuthChangePasswordRequestDto,
    requestLog: IRequestLog
  ): Promise<void> {
    // Check if password attempts exceeded
    if (this.authUtil.checkPasswordAttempt(user)) {
      throw new ForbiddenException({
        statusCode: EnumUserStatusCodeError.passwordAttemptMax,
        message: 'auth.error.passwordAttemptMax',
      });
    }

    const passwordMatch = this.authUtil.validatePassword(
      oldPassword,
      user.password
    );

    if (!passwordMatch) {
      await this.userService.incrementPasswordAttempt(user._id);

      throw new BadRequestException({
        statusCode: EnumUserStatusCodeError.passwordNotMatch,
        message: 'auth.error.passwordNotMatch',
      });
    }

    // Reset password attempt after successful validation
    await this.userService.resetPasswordAttempt(user._id);

    // Update password in database
    await this.userService.updatePassword(user._id, newPassword);

    // Revoke all sessions to force re-login
    const sessions = await this.sessionService.findAllByUser(user._id);
    await this.sessionUtil.deleteAllLogins(user._id, sessions);
  }

  async forgotPassword(
    { email }: UserForgotPasswordRequestDto,
    requestLog: IRequestLog
  ): Promise<void> {}

  async resetPassword(
    data: UserForgotPasswordResetRequestDto,
    requestLog: IRequestLog
  ): Promise<void> {}
}
