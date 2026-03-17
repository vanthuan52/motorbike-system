import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { EnumAppEnvironment } from '@/app/enums/app.enum';
import { IDatabaseOptionService } from '../interfaces/database.option-service.interface';

@Injectable()
export class DatabaseOptionService implements IDatabaseOptionService {
  private readonly logger = new Logger(DatabaseOptionService.name);

  constructor(private readonly configService: ConfigService) {}

  createOptions(): MongooseModuleOptions {
    const env = this.configService.get<string>('app.env');
    const name = this.configService.get<string>('app.name');

    const uri = this.configService.get<string>('database.uri');

    const dbName = this.configService.get<string>('database.name');
    const user = this.configService.get<string>('database.username');
    const pass = this.configService.get<string>('database.password');

    const debug = this.configService.get<boolean>('database.debug');

    let timeoutOptions = this.configService.get<Record<string, number>>(
      'database.timeoutOptions',
    );

    let poolOptions = this.configService.get<Record<string, number>>(
      'database.poolOptions',
    );

    if (env !== EnumAppEnvironment.production) {
      mongoose.set('debug', debug);
    }

    if (env === EnumAppEnvironment.migration) {
      timeoutOptions = {
        serverSelectionTimeoutMS: 60 * 1000, // 60 secs
        socketTimeoutMS: 300 * 1000, // 5 minutes
        heartbeatFrequencyMS: 10 * 1000, // 10 secs
      };

      poolOptions = {
        maxPoolSize: 20,
        minPoolSize: 5,
        maxIdleTimeMS: 120000, // Increased from 60000
        waitQueueTimeoutMS: 60000, // Increased from 30000
      };
    }

    const mongooseOptions: MongooseModuleOptions = {
      autoIndex: env !== EnumAppEnvironment.production,
      appName: name,
      retryWrites: true,
      retryReads: true,
      ...timeoutOptions,
      ...poolOptions,
    };

    // If a full URI is provided, we can connect directly to the database
    // In this case, host, port, username, and password are not required.
    if (uri) {
      mongooseOptions.uri = uri;
      this.logger.log(`Using database URI: ${uri}`);
    } else {
      const host = this.configService.get<string>('database.host');
      mongooseOptions.uri = host;
      mongooseOptions.dbName = dbName;
      mongooseOptions.user = user;
      mongooseOptions.pass = pass;
      mongooseOptions.authSource = dbName;

      this.logger.log(`Using database host: ${host}`);
      this.logger.log(`Database name: ${dbName}`);
    }

    return mongooseOptions;
  }
}
