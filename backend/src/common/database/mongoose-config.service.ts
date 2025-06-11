// import { Injectable, Logger } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import {
//   MongooseModuleOptions,
//   MongooseOptionsFactory,
// } from '@nestjs/mongoose';
// import mongoose from 'mongoose';
// import { AllConfigType } from '@/config/config.type';
// import { ENUM_NODE_ENVIRONMENT } from '@/app/enums/app.enum';

// // With no injectable, it's useless
// class MongooseConfigService implements MongooseOptionsFactory {
//   private readonly logger = new Logger(MongooseConfigService.name);

//   constructor(private configService: ConfigService<AllConfigType>) {}

//   createMongooseOptions():
//     | Promise<MongooseModuleOptions>
//     | MongooseModuleOptions {
//     const env = this.configService.get<string>('app.env', { infer: true });

//     // If a full URI is provided, we can connect directly to the database
//     // In this case, host, port, username, and password are not required.
//     const uri = this.configService.get<string>('database.uri', { infer: true });

//     const dbName = this.configService.get('database.name', { infer: true });
//     const user = this.configService.get('database.username', { infer: true });
//     const pass = this.configService.get('database.password', { infer: true });

//     const debug = this.configService.get<boolean>('database.debug', {
//       infer: true,
//     });

//     if (env !== ENUM_NODE_ENVIRONMENT.PRODUCTION) {
//       mongoose.set('debug', debug);
//     }

//     const mongooseOptions: MongooseModuleOptions = {
//       autoIndex: env !== ENUM_NODE_ENVIRONMENT.PRODUCTION,
//     };

//     if (uri) {
//       mongooseOptions.uri = uri;
//       this.logger.log(`Using database URI: ${uri}`);
//     } else {
//       const host = this.configService.get('database.host', {
//         infer: true,
//       });
//       mongooseOptions.uri = host;
//       mongooseOptions.dbName = dbName;
//       mongooseOptions.user = user;
//       mongooseOptions.pass = pass;
//       mongooseOptions.authSource = dbName;

//       this.logger.log(`Using database host: ${host}`);
//       this.logger.log(`Database name: ${dbName}`);
//     }

//     return mongooseOptions;
//   }
// }
