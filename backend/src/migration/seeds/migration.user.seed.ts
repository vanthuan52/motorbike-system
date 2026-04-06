import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Command } from 'nest-commander';
import { UAParser } from 'ua-parser-js';
import { EnumAppEnvironment } from '@/app/enums/app.enum';
import { DatabaseService } from '@/common/database/services/database.service';
import { DatabaseUtil } from '@/common/database/utils/database.util';
import { HelperService } from '@/common/helper/services/helper.service';
import { faker } from '@faker-js/faker';
import { MigrationSeedBase } from '@/migration/bases/migration.seed.base';
import { migrationUserData } from '@/migration/data/migration.user.data';
import { IMigrationSeed } from '@/migration/interfaces/migration.seed.interface';
import { AuthUtil } from '@/modules/auth/utils/auth.util';
import { UserUtil } from '@/modules/user/utils/user.util';
import { EnumActivityLogAction } from '@/modules/activity-log/enums/activity-log.enum';
import {
  EnumNotificationChannel,
  EnumNotificationType,
} from '@/modules/notification/enums/notification.enum';
import {
  EnumUserSignUpFrom,
  EnumUserSignUpWith,
  EnumUserStatus,
} from '@/modules/user/enums/user.enum';
import { EnumVerificationType } from '@/modules/verification/enums/verification.enum';

@Command({
  name: 'user',
  description: 'Seed/Remove Users',
  allowUnknownOptions: false,
})
export class MigrationUserSeed
  extends MigrationSeedBase
  implements IMigrationSeed
{
  private readonly logger = new Logger(MigrationUserSeed.name);

  private readonly env: EnumAppEnvironment;
  private readonly users: {
    email: string;
    name: string;
    role: string;
    password: string;
  }[] = [];

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly configService: ConfigService,
    private readonly databaseUtil: DatabaseUtil,
    private readonly authUtil: AuthUtil,
    private readonly userUtil: UserUtil,
    private readonly helperService: HelperService
  ) {
    super();

    this.env = this.configService.get<EnumAppEnvironment>('app.env');
    this.users = migrationUserData[this.env];
  }

  async seed(): Promise<void> {
    this.logger.log('Seeding Users...');
    this.logger.log(`Found ${this.users.length} Users to seed.`);

    const uniqueRoles = this.helperService.arrayUnique(
      this.users.map(user => user.role)
    );
    const roles = await this.databaseService.role.findMany({
      where: {
        name: {
          in: uniqueRoles,
        },
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (roles.length !== uniqueRoles.length) {
      this.logger.warn('Roles not found for users, cannot seed.');
      return;
    }

    try {
      const today = this.helperService.dateCreate();

      const userAgent = UAParser(faker.internet.userAgent());
      const ip = faker.internet.ip();

      await this.databaseService.$transaction(
        this.users.map(user => {
          const userId = this.databaseUtil.createId();
          const { passwordCreated, passwordExpired, passwordHash } =
            this.authUtil.createPassword(userId, user.password);
          const { reference, hashedToken, type } =
            this.userUtil.verificationCreateVerification(
              userId,
              EnumVerificationType.email
            );

          return this.databaseService.user.upsert({
            where: {
              email: user.email.toLowerCase(),
            },
            create: {
              id: userId,
              email: user.email.toLowerCase(),
              name: user.name,
              userRoles: {
                create: {
                  role: {
                    connect: {
                      id: roles.find(role => role.name === user.role).id,
                    },
                  },
                },
              },
              password: passwordHash,
              passwordCreated,
              passwordExpired,
              passwordAttempt: 0,
              signUpDate: today,
              isVerified: true,
              signUpWith: EnumUserSignUpWith.credential,
              signUpFrom: EnumUserSignUpFrom.system,
              status: EnumUserStatus.active,
              username: this.userUtil.createRandomUsername(),
              deletedAt: null,
              verifications: {
                create: {
                  expiredAt: this.helperService.dateCreate(),
                  verifiedAt: this.helperService.dateCreate(),
                  reference,
                  token: hashedToken,
                  hashedToken,
                  expiredInMinutes: 30,
                  resendInMinutes: 1,
                  type,
                  createdBy: userId,
                  to: user.email,
                  isUsed: true,
                },
              },
              activityLogs: {
                createMany: {
                  data: [
                    {
                      action: EnumActivityLogAction.userCreated,
                      ipAddress: ip,
                      userAgent: this.databaseUtil.toPlainObject(userAgent),
                      createdBy: userId,
                    },
                    {
                      action: EnumActivityLogAction.userVerifiedEmail,
                      ipAddress: ip,
                      userAgent: this.databaseUtil.toPlainObject(userAgent),
                      createdBy: userId,
                    },
                  ],
                },
              },

              notificationSettings: {
                createMany: {
                  data: Object.values(EnumNotificationChannel)
                    .map(channel =>
                      Object.values(EnumNotificationType).map(type => ({
                        channel,
                        type,
                        isActive: true,
                      }))
                    )
                    .flat(),
                },
              },
            },
            update: {},
          });
        })
      );
    } catch (error: unknown) {
      this.logger.error(error, 'Error seeding users');
      throw error;
    }

    this.logger.log('Users seeded successfully.');

    return;
  }

  async remove(): Promise<void> {
    this.logger.log('Removing back Users...');

    try {
      await this.databaseService.$transaction([
        this.databaseService.session.deleteMany({}),
        this.databaseService.verification.deleteMany({}),
        this.databaseService.forgotPassword.deleteMany({}),
        this.databaseService.activityLog.deleteMany({}),
        this.databaseService.notificationUserSetting.deleteMany({}),
        this.databaseService.user.deleteMany({}),
      ]);
    } catch (error: unknown) {
      this.logger.error(error, 'Error removing users');
      throw error;
    }

    this.logger.log('Users removed completed.');

    return;
  }
}
