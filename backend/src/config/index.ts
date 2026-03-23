import AppConfig from '@/config/app.config';
import AuthConfig from '@/config/auth.config';
import DatabaseConfig from '@/config/database.config';
import AwsConfig from '@/config/aws.config';
import UserConfig from '@/config/user.config';
import RequestConfig from '@/config/request.config';
import DocConfig from '@/config/doc.config';
import MessageConfig from '@/config/message.config';
import EmailConfig from '@/config/email.config';
import RedisConfig from '@/config/redis.config';
import ForgotPasswordConfig from '@/config/forgot-password.config';
import VerificationConfig from '@/config/verification.config';
import HomeConfig from '@/config/home.config';
import LoggerConfig from '@/config/logger.config';
import SessionConfig from '@/config/session.config';
import TermPolicyConfig from '@/config/term-policy.config';
import FeatureFlagConfig from '@/config/feature-flag.config';
import ResponseConfig from '@/config/response.config';
import FirebaseConfig from '@/config/firebase.config';

export default [
  AppConfig,
  AuthConfig,
  DatabaseConfig,
  AwsConfig,
  UserConfig,
  RequestConfig,
  DocConfig,
  MessageConfig,
  EmailConfig,
  RedisConfig,
  LoggerConfig,
  ForgotPasswordConfig,
  VerificationConfig,
  HomeConfig,
  SessionConfig,
  TermPolicyConfig,
  FeatureFlagConfig,
  ResponseConfig,
  FirebaseConfig,
];
