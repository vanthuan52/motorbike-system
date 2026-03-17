import {
  ExtractJwt,
  Strategy,
  StrategyOptionsWithoutRequest,
} from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { passportJwtSecret } from 'jwks-rsa';
import { Algorithm } from 'jsonwebtoken';
import { createPublicKey } from 'crypto';
import { IAuthJwtAccessTokenPayload } from '@/modules/auth/interfaces/auth.interface';
import { AuthJwtAccessGuardKey } from '@/modules/auth/constants/auth.constant';
import { AuthService } from '@/modules/auth/services/auth.service';

/**
 * Builds JWT strategy options based on configuration.
 * Priority: JWKS URI > Inline Public Key
 */
function buildStrategyOptions(
  configService: ConfigService,
): StrategyOptionsWithoutRequest {
  const jwksUri = configService.get<string>('auth.jwt.accessToken.jwksUri');
  const publicKeyBase64 = configService.get<string>(
    'auth.jwt.accessToken.publicKey',
  );

  const baseOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme(
      configService.get<string>('auth.jwt.prefix'),
    ),
    ignoreExpiration: false,
    passReqToCallback: false as const,
    jsonWebTokenOptions: {
      ignoreNotBefore: false,
      audience: configService.get<string>('auth.jwt.audience'),
      issuer: configService.get<string>('auth.jwt.issuer'),
    },
    algorithms: [
      configService.get<Algorithm>('auth.jwt.accessToken.algorithm'),
    ],
  };

  if (jwksUri) {
    // Use JWKS endpoint for key resolution (microservices/distributed setup)
    return {
      ...baseOptions,
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        cacheMaxEntries: 5,
        cacheMaxAge: 600000, // 10 minutes
        rateLimit: true,
        jwksRequestsPerMinute: 10,
        jwksUri,
      }),
    };
  }

  if (publicKeyBase64) {
    // Use inline public key (monolith/simple setup)
    const publicKeyBuffer = Buffer.from(publicKeyBase64, 'base64');
    const publicKeyPem = createPublicKey({
      key: publicKeyBuffer,
      format: 'der',
      type: 'spki',
    }).export({ type: 'spki', format: 'pem' }) as string;

    return {
      ...baseOptions,
      secretOrKey: publicKeyPem,
    };
  }

  throw new Error(
    'JWT Access Token: Either AUTH_JWT_ACCESS_TOKEN_JWKS_URI or AUTH_JWT_ACCESS_TOKEN_PUBLIC_KEY must be configured',
  );
}

/**
 * JWT Access Token Strategy for Passport
 *
 * This strategy is responsible for validating JWT access tokens in incoming requests.
 * It extracts the JWT token from the Authorization header, verifies its signature
 * using either inline public key or JWKS (JSON Web Key Set), and validates the token payload.
 *
 * Key Resolution Priority:
 * 1. If AUTH_JWT_ACCESS_TOKEN_JWKS_URI is set → Use JWKS endpoint
 * 2. Otherwise → Use inline public key from AUTH_JWT_ACCESS_TOKEN_PUBLIC_KEY
 *
 */
@Injectable()
export class AuthJwtAccessStrategy extends PassportStrategy(
  Strategy,
  AuthJwtAccessGuardKey,
) {
  /**
   * Creates an instance of AuthJwtAccessStrategy.
   *
   * @param {ConfigService} configService - Service for accessing configuration values
   * @param {AuthService} authService - Service for authentication operations
   *
   * @note We don't validate JTI (JWT ID) claims in this strategy
   */
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super(buildStrategyOptions(configService));
  }

  /**
   * Validates the JWT access token payload
   *
   * This method is called after the JWT token has been successfully verified.
   * It delegates further validation to the AuthService to ensure the user
   * and token are still valid in the application context.
   *
   * @param {IAuthJwtAccessTokenPayload} data - The decoded JWT token payload
   * @returns {Promise<IAuthJwtAccessTokenPayload>} The validated token payload
   *
   */
  async validate(
    data: IAuthJwtAccessTokenPayload,
  ): Promise<IAuthJwtAccessTokenPayload> {
    return this.authService.validateJwtAccessStrategy(data);
  }
}
