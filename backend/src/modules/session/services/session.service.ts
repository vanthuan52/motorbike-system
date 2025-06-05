import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Request } from 'express';
import { Document } from 'mongoose';
import { Duration } from 'luxon';
import { Cache } from 'cache-manager';
import { plainToInstance } from 'class-transformer';
import { ISessionService } from '../interfaces/session.service.interface';
import { HelperDateService } from '@/common/helper/services/helper.date.service';
import { SessionRepository } from '../repository/session.repository';
import { DatabaseService } from '@/common/database/services/database.service';
import {
  IDatabaseCreateOptions,
  IDatabaseDeleteManyOptions,
  IDatabaseFindAllOptions,
  IDatabaseFindOneOptions,
  IDatabaseGetTotalOptions,
  IDatabaseOptions,
  IDatabaseSaveOptions,
  IDatabaseUpdateManyOptions,
} from '@/common/database/interfaces/database.interface';
import { SessionDoc, SessionEntity } from '../entities/session.entity';
import { SessionCreateRequestDto } from '../dtos/request/session.create.request.dto';
import { ENUM_SESSION_STATUS } from '../enums/session.enum';
import { SessionListResponseDto } from '../dtos/response/session.list.response.dto';
import { IUserDoc } from '@/modules/user/interfaces/user.interface';

@Injectable()
export class SessionService implements ISessionService {
  private readonly refreshTokenExpiration: number;
  private readonly appName: string;

  private readonly sessionKeyPrefix: string;

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly configService: ConfigService,
    private readonly helperDateService: HelperDateService,
    private readonly sessionRepository: SessionRepository,
    private readonly databaseService: DatabaseService,
  ) {
    this.refreshTokenExpiration = this.configService.get<number>(
      'auth.jwt.refreshToken.expirationTime',
    )!;
    this.appName = this.configService.get<string>('app.name')!;

    this.sessionKeyPrefix =
      this.configService.get<string>('session.keyPrefix')!;
  }

  async findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<SessionDoc[]> {
    return this.sessionRepository.findAll<SessionDoc>(find, options);
  }

  async findAllByUser(
    user: string,
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<SessionDoc[]> {
    return this.sessionRepository.findAll<SessionDoc>(
      { user, ...find },
      options,
    );
  }

  async findOneById(
    _id: string,
    options?: IDatabaseOptions,
  ): Promise<SessionDoc | null> {
    return this.sessionRepository.findOneById<SessionDoc>(_id, options);
  }

  async findOne(
    find: Record<string, any>,
    options?: IDatabaseOptions,
  ): Promise<SessionDoc | null> {
    return this.sessionRepository.findOne<SessionDoc>(find, options);
  }

  async findOneActiveById(
    _id: string,
    options?: IDatabaseOptions,
  ): Promise<SessionDoc | null> {
    const today = this.helperDateService.create();

    return this.sessionRepository.findOne<SessionDoc>(
      {
        _id,
        ...this.databaseService.filterGte('expiredAt', today),
      },
      options,
    );
  }

  async findOneActiveByIdAndUser(
    _id: string,
    user: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<SessionDoc | null> {
    const today = this.helperDateService.create();

    return this.sessionRepository.findOne<SessionDoc>(
      {
        _id,
        user,
        ...this.databaseService.filterGte('expiredAt', today),
      },
      options,
    );
  }

  async getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number> {
    return this.sessionRepository.getTotal(find, options);
  }

  async getTotalByUser(
    user: string,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number> {
    return this.sessionRepository.getTotal({ user }, options);
  }

  async create(
    request: Request,
    { user }: SessionCreateRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<SessionDoc> {
    const today = this.helperDateService.create();
    const expiredAt: Date = this.helperDateService.forward(
      today,
      Duration.fromObject({
        seconds: this.refreshTokenExpiration,
      }),
    );

    const create = new SessionEntity();
    create.user = user;
    create.hostname = request.hostname;
    create.ip = request.ip ?? '0.0.0.0';
    create.protocol = request.protocol;
    create.originalUrl = request.originalUrl;
    create.method = request.method;

    create.userAgent = request.headers['user-agent'] as string;
    create.xForwardedFor = request.headers['x-forwarded-for'] as string;
    create.xForwardedHost = request.headers['x-forwarded-host'] as string;
    create.xForwardedPorto = request.headers['x-forwarded-porto'] as string;

    create.status = ENUM_SESSION_STATUS.ACTIVE;
    create.expiredAt = expiredAt;

    return this.sessionRepository.create<SessionEntity>(create, options);
  }

  mapList(
    userLogins: SessionDoc[] | SessionEntity[],
  ): SessionListResponseDto[] {
    return plainToInstance(
      SessionListResponseDto,
      userLogins.map((e: SessionDoc | SessionEntity) =>
        e instanceof Document ? e.toObject() : e,
      ),
    );
  }

  async findLoginSession(_id: string): Promise<string> {
    return (await this.cacheManager.get<string>(
      `${this.appName}:${this.sessionKeyPrefix}:${_id}`,
    ))!;
  }

  async setLoginSession(user: IUserDoc, session: SessionDoc): Promise<void> {
    const key = `${this.appName}:${this.sessionKeyPrefix}:${session._id}`;

    await this.cacheManager.set(
      key,
      { user: user._id },
      this.refreshTokenExpiration,
    );
    // To-do
    return;
  }

  async deleteLoginSession(_id: string): Promise<void> {
    const key = `${this.appName}:${this.sessionKeyPrefix}:${_id}`;
    await this.cacheManager.del(key);
    // To-do

    return;
  }

  async resetLoginSession(): Promise<void> {
    await this.cacheManager.clear();

    return;
  }

  async updateRevoke(
    repository: SessionDoc,
    options?: IDatabaseOptions,
  ): Promise<SessionDoc> {
    await this.deleteLoginSession(repository._id);

    repository.status = ENUM_SESSION_STATUS.REVOKED;
    repository.revokeAt = this.helperDateService.create();

    return this.sessionRepository.save(
      repository,
      options as IDatabaseSaveOptions,
    );
  }

  async updateManyRevokeByUser(
    user: string,
    options?: IDatabaseUpdateManyOptions,
  ): Promise<boolean> {
    const today = this.helperDateService.create();
    const sessions = await this.findAllByUser(user, undefined, options);
    const promises = sessions.map((e) => this.deleteLoginSession(e._id));

    await Promise.all(promises);

    await this.sessionRepository.updateMany(
      {
        user,
      },
      {
        status: ENUM_SESSION_STATUS.REVOKED,
        revokeAt: today,
      },
      options,
    );

    return true;
  }

  async deleteMany(
    find?: Record<string, any>,
    options?: IDatabaseDeleteManyOptions,
  ): Promise<boolean> {
    await this.sessionRepository.deleteMany(find, options);

    return true;
  }
}
