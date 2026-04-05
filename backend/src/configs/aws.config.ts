import { registerAs } from '@nestjs/config';
import ms from 'ms';

export interface IConfigAws {
  s3: {
    multipartExpiredInDay: number;
    presignExpired: number;
    maxAttempts: number;
    timeoutInMs: number;
    region?: string;
    /**
     * Custom endpoint for S3-compatible storage (e.g. MinIO).
     * Leave undefined to use real AWS S3.
     */
    endpoint?: string;
    /**
     * Must be true for MinIO / path-style S3-compatible providers.
     * AWS S3 uses virtual-hosted style (false) by default.
     */
    forcePathStyle: boolean;
    iam: {
      key?: string;
      secret?: string;
      arn?: string;
    };
    config: {
      public: {
        bucket?: string;
        arn?: string;
        baseUrl?: string;
        cdnUrl?: string;
      };
      private: {
        bucket?: string;
        arn?: string;
        baseUrl?: string;
        cdnUrl?: string;
      };
      /**
       * Temporary bucket for processing files before moving to public/private.
       * Files here are short-lived and should be cleaned up by the application.
       */
      temp: {
        bucket?: string;
        arn?: string;
        baseUrl?: string;
      };
    };
  };
  ses: {
    iam: {
      key?: string;
      secret?: string;
      arn?: string;
    };
    region?: string;
  };
}

/**
 * Resolve baseUrl for a bucket based on storage provider.
 *
 * - MinIO / S3-compatible (endpoint provided): http(s)://<endpoint>/<bucket>
 * - Real AWS S3 (no endpoint):                 https://<bucket>.s3.<region>.amazonaws.com
 */
function resolveBaseUrl(
  bucket: string | undefined,
  region: string | undefined,
  endpoint: string | undefined,
): string | undefined {
  if (!bucket) return undefined;
  if (endpoint) {
    // MinIO / S3-compatible path-style: endpoint/bucket
    return `${endpoint.replace(/\/$/, '')}/${bucket}`;
  }
  // Real AWS S3 virtual-hosted style
  return `https://${bucket}.s3.${region ?? 'us-east-1'}.amazonaws.com`;
}

export default registerAs(
  'aws',
  (): IConfigAws => {
    const region = process.env.AWS_S3_REGION;
    const endpoint = process.env.STORAGE_ENDPOINT || undefined; // e.g. http://minio:9000
    const forcePathStyle = process.env.STORAGE_FORCE_PATH_STYLE === 'true' || !!endpoint;

    const publicBucket = process.env.AWS_S3_PUBLIC_BUCKET ?? 'app-public-files';
    const privateBucket = process.env.AWS_S3_PRIVATE_BUCKET ?? 'app-private-files';
    const tempBucket = process.env.AWS_S3_TEMP_BUCKET ?? 'app-temp-processing';

    return {
      s3: {
        multipartExpiredInDay: 3,
        presignExpired: 30 * 60,
        maxAttempts: 3,
        timeoutInMs: ms('30s'),
        region,
        endpoint,
        forcePathStyle,
        iam: {
          key: process.env.AWS_S3_IAM_CREDENTIAL_KEY,
          secret: process.env.AWS_S3_IAM_CREDENTIAL_SECRET,
          arn: process.env.AWS_S3_IAM_ARN,
        },
        config: {
          public: {
            bucket: publicBucket,
            baseUrl: resolveBaseUrl(publicBucket, region, endpoint),
            arn: `arn:aws:s3:::${publicBucket}`,
            cdnUrl: process.env.AWS_S3_CDN
              ? `https://${process.env.AWS_S3_CDN}`
              : undefined,
          },
          private: {
            bucket: privateBucket,
            baseUrl: resolveBaseUrl(privateBucket, region, endpoint),
            arn: `arn:aws:s3:::${privateBucket}`,
            cdnUrl: undefined,
          },
          temp: {
            bucket: tempBucket,
            baseUrl: resolveBaseUrl(tempBucket, region, endpoint),
            arn: `arn:aws:s3:::${tempBucket}`,
          },
        },
      },
      ses: {
        iam: {
          key: process.env.AWS_SES_CREDENTIAL_KEY,
          secret: process.env.AWS_SES_CREDENTIAL_SECRET,
          arn: process.env.AWS_SES_IAM_ARN,
        },
        region: process.env.AWS_SES_REGION,
      },
    };
  }
);
