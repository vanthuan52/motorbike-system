import { Module } from '@nestjs/common';
import { CommonModule } from '@/common/common.module';
import { MigrationApiKeySeed } from '@/migration/seeds/migration.api-key.seed';
import { UserModule } from '@/modules/user/user.module';
import { MigrationRoleSeed } from '@/migration/seeds/migration.role.seed';
import { MigrationUserSeed } from '@/migration/seeds/migration.user.seed';
import { MigrationAwsS3ConfigSeed } from '@/migration/seeds/migration.aws-s3-config.seed';
import { AwsModule } from '@/common/aws/aws.module';
import { MigrationTemplateEmailNotificationSeed } from '@/migration/seeds/migration.template-notification.seed';

/**
 * Migration module that provides database seeding and removal functionality.
 *
 * This module manages all database seed providers used during development and initial deployment.
 * It handles seeding and removal of the following data:
 * - **API Keys**: Default API keys for third-party integrations
 * - **Countries**: Country reference data used throughout the application
 * - **Feature Flags**: Feature toggle configurations
 * - **Roles**: User role definitions and permissions
 * - **Term Policies**: Terms and policy framework data
 * - **Users**: Default user accounts for testing
 * - **Email Templates**: Email notification templates
 * - **Term Policy Templates**: Term policy document templates
 * - **AWS S3 Configuration**: S3 bucket and storage configuration
 */
@Module({
  imports: [CommonModule, UserModule, AwsModule],
  providers: [
    MigrationApiKeySeed,
    MigrationRoleSeed,
    MigrationUserSeed,
    MigrationTemplateEmailNotificationSeed,
    MigrationAwsS3ConfigSeed,
  ],
  exports: [],
})
export class MigrationModule {}
