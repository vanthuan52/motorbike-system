/**
 * Maximum number of parts allowed for AWS S3 multipart upload operations.
 */
export const AwsS3MaxPartNumber = 10000;
export const AwsS3MaxFetchItems = 100;

export const AwsS3MinPartSize = 2 * 1024 * 1024; // 2 MB
// expire time is 5 minutes for security (reduced from 30 minutes)
export const AwsS3PresignExpired = 30 * 60;
