import { registerAs } from '@nestjs/config';
import { AWS_S3_PRESIGN_EXPIRED } from '../constants/aws.constant';

export type AwsConfig = {
  s3: {
    presignExpired: number;
    config: {
      public: {
        credential: {
          key: string;
          secret: string;
        };
        bucket: string;
        region: string;
        baseUrl: string;
        cdnUrl: string;
        endpoint: string;
        forcePathStyle: boolean;
      };
      private: {
        credential: {
          key: string;
          secret: string;
        };
        bucket: string;
        region: string;
        baseUrl: string;
      };
    };
  };
};

export default registerAs('aws', () => {
  const isProduction = process.env.NODE_ENV === 'production';

  // --- Public Bucket Configuration ---
  const publicCredentialKey = isProduction
    ? process.env.AWS_S3_PUBLIC_CREDENTIAL_KEY
    : process.env.MINIO_PUBLIC_CREDENTIAL_KEY;
  const publicCredentialSecret = isProduction
    ? process.env.AWS_S3_PUBLIC_CREDENTIAL_SECRET
    : process.env.MINIO_PUBLIC_CREDENTIAL_SECRET;
  const publicBucket = isProduction
    ? (process.env.AWS_S3_PUBLIC_BUCKET ?? 'motorbike-system-public-files')
    : (process.env.MINIO_PUBLIC_BUCKET ?? 'motorbike-system-public-files');
  const publicRegion = isProduction
    ? process.env.AWS_S3_PUBLIC_REGION
    : 'us-east-1';

  const publicEndpoint = isProduction
    ? `https://${publicBucket}.s3.${publicRegion}.amazonaws.com`
    : process.env.MINIO_PUBLIC_ENDPOINT;

  const publicCdnUrl = isProduction
    ? `https://${process.env.AWS_S3_PUBLIC_CDN}`
    : publicEndpoint;

  // --- Private Bucket Configuration ---
  const privateCredentialKey = isProduction
    ? process.env.AWS_S3_PRIVATE_CREDENTIAL_KEY
    : process.env.MINIO_PRIVATE_CREDENTIAL_KEY;
  const privateCredentialSecret = isProduction
    ? process.env.AWS_S3_PRIVATE_CREDENTIAL_SECRET
    : process.env.MINIO_PRIVATE_CREDENTIAL_SECRET;
  const privateBucket = isProduction
    ? (process.env.AWS_S3_PRIVATE_BUCKET ?? 'motorbike-system-private-files')
    : (process.env.MINIO_PRIVATE_BUCKET ?? 'motorbike-system-private-files');
  const privateRegion = isProduction
    ? process.env.AWS_S3_PRIVATE_REGION
    : 'us-east-1';

  const privateEndpoint = isProduction
    ? `https://${privateBucket}.s3.${privateRegion}.amazonaws.com`
    : process.env.MINIO_PRIVATE_ENDPOINT;

  return {
    s3: {
      presignExpired: AWS_S3_PRESIGN_EXPIRED,
      config: {
        public: {
          credential: {
            key: publicCredentialKey,
            secret: publicCredentialSecret,
          },
          bucket: publicBucket,
          region: publicRegion,
          baseUrl: publicEndpoint,
          cdnUrl: publicCdnUrl,
          endpoint: publicEndpoint,
          forcePathStyle: !isProduction,
        },
        private: {
          credential: {
            key: privateCredentialKey,
            secret: privateCredentialSecret,
          },
          bucket: privateBucket,
          region: privateRegion,
          baseUrl: privateEndpoint,
          endpoint: privateEndpoint,
          forcePathStyle: !isProduction,
        },
      },
    },
  };
});
