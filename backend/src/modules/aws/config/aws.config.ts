import { registerAs } from '@nestjs/config';
import { AWS_S3_PRESIGN_EXPIRED } from '../constants/aws.constant';
import { AwsS3EnvironmentVariablesValidator } from '../validators/aws-s3-environment-variables.validator';
import validateConfig from '@/common/utils/validate-config';

// export default registerAs('aws', () => {
//   validateConfig(process.env, AwsS3EnvironmentVariablesValidator);

//   const publicBucket = process.env.AWS_S3_PUBLIC_BUCKET ?? 'bucketPublic';
//   const publicRegion = process.env.AWS_S3_PUBLIC_REGION;
//   const privateBucket = process.env.AWS_S3_PRIVATE_BUCKET ?? 'bucketPrivate';
//   const privateRegion = process.env.AWS_S3_PRIVATE_REGION;

//   return {
//     s3: {
//       presignExpired: AWS_S3_PRESIGN_EXPIRED,
//       config: {
//         public: {
//           credential: {
//             key: process.env.AWS_S3_PUBLIC_CREDENTIAL_KEY,
//             secret: process.env.AWS_S3_PUBLIC_CREDENTIAL_SECRET,
//           },
//           bucket: publicBucket,
//           region: publicRegion,
//           baseUrl: `https://${publicBucket}.s3.${publicRegion}.amazonaws.com`,
//           cdnUrl: `https://${process.env.AWS_S3_PUBLIC_CDN}`,
//         },
//         private: {
//           credential: {
//             key: process.env.AWS_S3_PRIVATE_CREDENTIAL_KEY,
//             secret: process.env.AWS_S3_PRIVATE_CREDENTIAL_SECRET,
//           },
//           bucket: privateBucket,
//           region: privateRegion,
//           baseUrl: `https://${privateBucket}.s3.${privateRegion}.amazonaws.com`,
//         },
//       },
//     },
//   };
// });
