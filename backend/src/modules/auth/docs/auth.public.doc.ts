import { HttpStatus, applyDecorators } from '@nestjs/common';
import {
  Doc,
  DocAuth,
  DocRequest,
  DocResponse,
} from '@/common/doc/decorators/doc.decorator';
import { EnumDocRequestBodyType } from '@/common/doc/enums/doc.enum';
import { AuthTokenResponseDto } from '@/modules/auth/dtos/response/auth.token.response.dto';
import { AuthForgotPasswordResetRequestDto } from '@/modules/auth/dtos/request/auth.forgot-password-reset.request.dto';
import { AuthForgotPasswordRequestDto } from '@/modules/auth/dtos/request/auth.forgot-password.request.dto';
import { AuthLoginRequestDto } from '@/modules/auth/dtos/request/auth.login.request.dto';
import { AuthSendEmailVerificationRequestDto } from '@/modules/auth/dtos/request/auth.send-email-verification.request.dto';
import { AuthSignUpRequestDto } from '@/modules/auth/dtos/request/auth.sign-up.request.dto';
import { AuthVerifyEmailRequestDto } from '@/modules/auth/dtos/request/auth.verify-email.request.dto';
import { AuthLoginResponseDto } from '@/modules/auth/dtos/response/auth.login.response.dto';

export function AuthPublicLoginCredentialDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'login with credential',
    }),
    DocAuth({
      xApiKey: true,
    }),
    DocRequest({
      bodyType: EnumDocRequestBodyType.json,
      dto: AuthLoginRequestDto,
    }),
    DocResponse('user.loginCredential', {
      dto: AuthLoginResponseDto,
    })
  );
}

export function AuthPublicLoginSocialGoogleDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'Login with social google',
    }),
    DocAuth({ xApiKey: true, google: true }),
    DocResponse('auth.loginWithSocialGoogle', {
      dto: AuthLoginResponseDto,
    })
  );
}

export function AuthPublicLoginSocialAppleDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'Login with social apple',
    }),
    DocAuth({ xApiKey: true, apple: true }),
    DocResponse('auth.loginWithSocialApple', {
      dto: AuthLoginResponseDto,
    })
  );
}

export function AuthPublicSignUpDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'User sign up',
    }),
    DocRequest({
      bodyType: EnumDocRequestBodyType.json,
      dto: AuthSignUpRequestDto,
    }),
    DocAuth({
      xApiKey: true,
    }),
    DocResponse('user.signUp', {
      httpStatus: HttpStatus.CREATED,
    })
  );
}

export function AuthPublicSendEmailVerificationDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'User resend email verification',
    }),
    DocAuth({
      xApiKey: true,
    }),
    DocRequest({
      bodyType: EnumDocRequestBodyType.json,
      dto: AuthSendEmailVerificationRequestDto,
    }),
    DocResponse('user.sendEmailVerification')
  );
}

export function AuthPublicVerifyEmailDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'User Email Verification',
    }),
    DocAuth({
      xApiKey: true,
    }),
    DocRequest({
      bodyType: EnumDocRequestBodyType.json,
      dto: AuthVerifyEmailRequestDto,
    }),
    DocResponse('user.verifyEmail')
  );
}

export function AuthPublicForgotPasswordDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'User forgot password',
    }),
    DocRequest({
      bodyType: EnumDocRequestBodyType.json,
      dto: AuthForgotPasswordRequestDto,
    }),
    DocAuth({
      xApiKey: true,
    }),
    DocResponse('user.forgotPassword')
  );
}

export function AuthPublicResetPasswordDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'User reset password',
    }),
    DocRequest({
      bodyType: EnumDocRequestBodyType.json,
      dto: AuthForgotPasswordResetRequestDto,
    }),
    DocAuth({
      xApiKey: true,
    }),
    DocResponse('user.resetPassword')
  );
}
