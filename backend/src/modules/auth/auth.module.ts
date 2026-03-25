import { Global, Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthJwtAccessStrategy } from '@/modules/auth/guards/jwt/strategies/auth.jwt.access.strategy';
import { AuthJwtRefreshStrategy } from '@/modules/auth/guards/jwt/strategies/auth.jwt.refresh.strategy';
import { AuthService } from '@/modules/auth/services/auth.service';
import { AuthUtil } from '@/modules/auth/utils/auth.util';
import { VerificationModule } from '@/modules/verification/verification.module';

@Global()
@Module({
  providers: [
    AuthJwtAccessStrategy,
    AuthJwtRefreshStrategy,

    AuthService,
    AuthUtil,
  ],
  exports: [AuthService, AuthUtil],
  controllers: [],
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: (configService: ConfigService): JwtModuleOptions => ({
        signOptions: {
          audience: configService.get<string>('auth.jwt.audience'),
          issuer: configService.get<string>('auth.jwt.issuer'),
        },
      }),
    }),
    VerificationModule,
  ],
})
export class AuthModule {}
