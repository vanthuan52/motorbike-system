import { registerAs } from '@nestjs/config';
import ms from 'ms';
import { AwsS3PresignExpired } from '../common/aws/constants/aws.constant';

export type AwsConfig = {
  s3: {
    multipartExpiredInDay: number;
    presignExpired: number;
    maxAttempts: number;
    timeoutInMs: number;
    region?: string;
    endpoint?: string;
    credential: {
      key?: string;
      secret?: string;
    };
    iam: {
      key?: string;
      secret?: string;
      arn?: string;
    };
    config: {
      public: {
        bucket: string;
        baseUrl: string;
        arn?: string;
        cdnUrl?: string;
        forcePathStyle: boolean;
      };
      private: {
        bucket: string;
        baseUrl: string;
        arn?: string;
        cdnUrl?: string;
        forcePathStyle: boolean;
      };
      temp?: {
        bucket?: string;
        baseUrl?: string;
        arn?: string;
        forcePathStyle?: boolean;
      };
    };
  };
};

export default registerAs('aws', (): AwsConfig => {
  // Use NODE_ENV for environment detection (consistent with .env.example)
  const isProduction = process.env.NODE_ENV === 'production';

  // Shared credentials
  const credentialKey = isProduction
    ? process.env.AWS_S3_ACCESS_KEY
    : process.env.MINIO_ACCESS_KEY;
  const credentialSecret = isProduction
    ? process.env.AWS_S3_SECRET_KEY
    : process.env.MINIO_SECRET_KEY;

  const region = process.env.AWS_S3_REGION ?? 'app-southeast-3';

  // Endpoint: undefined for AWS (SDK auto-detects), MinIO endpoint for dev/staging
  const endpoint = isProduction
    ? undefined
    : (process.env.MINIO_ENDPOINT ?? 'http://localhost:39000');

  // CDN URL (only for production)
  const cdnUrl = isProduction ? process.env.AWS_S3_CDN : undefined;

  // --- Shared Bucket Names (used for both AWS and MinIO) ---
  const publicBucket = process.env.AWS_S3_PUBLIC_BUCKET ?? 'app-public-files';
  const privateBucket =
    process.env.AWS_S3_PRIVATE_BUCKET ?? 'app-private-files';
  const tempBucket = process.env.AWS_S3_TEMP_BUCKET ?? 'app-temp-processing';

  // --- Base URLs ---
  // AWS:   https://<bucket>.s3.<region>.amazonaws.com
  // MinIO: http://host:port/<bucket>
  const publicBaseUrl = isProduction
    ? `https://${publicBucket}.s3.${region}.amazonaws.com`
    : `${endpoint}/${publicBucket}`;

  const privateBaseUrl = isProduction
    ? `https://${privateBucket}.s3.${region}.amazonaws.com`
    : `${endpoint}/${privateBucket}`;

  const tempBaseUrl = isProduction
    ? `https://${tempBucket}.s3.${region}.amazonaws.com`
    : `${endpoint}/${tempBucket}`;

  return {
    s3: {
      multipartExpiredInDay: 3,
      presignExpired: AwsS3PresignExpired,
      maxAttempts: 3,
      timeoutInMs: ms('30s'),
      region,
      endpoint,
      credential: {
        key: credentialKey,
        secret: credentialSecret,
      },
      iam: {
        key: process.env.AWS_S3_IAM_CREDENTIAL_KEY,
        secret: process.env.AWS_S3_IAM_CREDENTIAL_SECRET,
        arn: process.env.AWS_S3_IAM_ARN,
      },
      config: {
        public: {
          bucket: publicBucket,
          baseUrl: publicBaseUrl,
          arn: `arn:aws:s3:::${publicBucket}`,
          cdnUrl: cdnUrl || undefined,
          forcePathStyle: !isProduction, // MinIO requires path-style
        },
        private: {
          bucket: privateBucket,
          baseUrl: privateBaseUrl,
          arn: `arn:aws:s3:::${privateBucket}`,
          cdnUrl: cdnUrl || undefined,
          forcePathStyle: !isProduction,
        },
        temp: {
          bucket: tempBucket,
          baseUrl: tempBaseUrl,
          arn: `arn:aws:s3:::${tempBucket}`,
          forcePathStyle: !isProduction,
        },
      },
    },
  };
});
