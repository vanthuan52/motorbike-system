import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptionsWithRequest } from 'passport-jwt';
import { Algorithm } from 'jsonwebtoken';
import { passportJwtSecret } from 'jwks-rsa';
import { ConfigService } from '@nestjs/config';
import { IAuthJwtAccessTokenPayload } from '@/modules/auth/interfaces/auth.interface';

@Injectable()
export class AuthJwtAccessStrategy extends PassportStrategy(
  Strategy,
  'jwtAccess',
) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme(
        configService.get<string>('auth.jwt.prefix')!,
      ),
      ignoreExpiration: false,
      jsonWebTokenOptions: {
        ignoreNotBefore: true,
        audience: configService.get<string>('auth.jwt.audience'),
        issuer: configService.get<string>('auth.jwt.issuer'),
      },
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: configService.get<string>('auth.jwt.jwksUri')!,
      }),
      algorithms: [configService.get<Algorithm>('auth.jwt.algorithm')],
    } as StrategyOptionsWithRequest);
  }

  async validate(
    data: IAuthJwtAccessTokenPayload,
  ): Promise<IAuthJwtAccessTokenPayload> {
    return data;
  }
}
