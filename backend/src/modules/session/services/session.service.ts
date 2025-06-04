import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Duration } from 'luxon';
import { ISessionService } from '../interfaces/session.service.interface';
import { HelperDateService } from '@/common/helper/services/helper.date.service';
import { SessionRepository } from '../repository/session.repository';
import { DatabaseService } from '@/common/database/services/database.service';
import {
  IDatabaseCreateOptions,
  IDatabaseFindAllOptions,
  IDatabaseFindOneOptions,
  IDatabaseGetTotalOptions,
  IDatabaseOptions,
} from '@/common/database/interfaces/database.interface';
import { SessionDoc, SessionEntity } from '../entities/session.entity';
import { SessionCreateRequestDto } from '../dtos/request/session.create.request.dto';
import { ENUM_SESSION_STATUS } from '../enums/session.enum';

@Injectable()
export class SessionService {
  private readonly refreshTokenExpiration: number;
  private readonly appName: string;

  private readonly sessionKeyPrefix: string;

  constructor(
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

  //   async create(
  //     request: Request,
  //     { user }: SessionCreateRequestDto,
  //     options?: IDatabaseCreateOptions,
  //   ): Promise<SessionDoc> {
  //     const today = this.helperDateService.create();
  //     const expiredAt: Date = this.helperDateService.forward(
  //       today,
  //       Duration.fromObject({ seconds: this.refreshTokenExpiration }),
  //     );

  //     const create = new SessionEntity();
  //     create.user = user;
  //     create.hostname = request.hostname;
  //     create.ip = request.ip ?? '0.0.0.0';
  //     create.protocol = request.protocol;
  //     create.originalUrl = request.originalUrl;
  //     create.method = request.method;

  //     create.userAgent = request.headers['user-agent'] as string;
  //     create.xForwardedFor = request.headers['x-forwarded-for'] as string;
  //     create.xForwardedHost = request.headers['x-forwarded-host'] as string;
  //     create.xForwardedPorto = request.headers['x-forwarded-porto'] as string;

  //     create.status = ENUM_SESSION_STATUS.ACTIVE;
  //     create.expiredAt = expiredAt;

  //     return this.sessionRepository.create<SessionEntity>(create, options);
  //   }
}
