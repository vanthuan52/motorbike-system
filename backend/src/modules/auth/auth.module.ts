import { DynamicModule, Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Algorithm } from 'jsonwebtoken';
import { AuthService } from './services/auth.service';
import { AuthJwtAccessStrategy } from './guards/jwt/strategies/auth.jwt.access.strategy';
import { AuthJwtRefreshStrategy } from './guards/jwt/strategies/auth.jwt.refresh.strategy';

@Module({
  providers: [AuthService],
  exports: [AuthService],
  controllers: [],
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: (configService: ConfigService): JwtModuleOptions => ({
        signOptions: {
          audience: configService.get<string>('auth.jwt.audience'),
          issuer: configService.get<string>('auth.jwt.issuer'),
          algorithm: configService.get<Algorithm>('auth.jwt.algorithm'),
        },
      }),
    }),
  ],
})
export class AuthModule {
  static forRoot(): DynamicModule {
    return {
      module: AuthModule,
      providers: [AuthJwtAccessStrategy, AuthJwtRefreshStrategy],
      exports: [],
      controllers: [],
      imports: [],
    };
  }
}
