import {
  IDatabaseCreateOptions,
  IDatabaseDeleteManyOptions,
  IDatabaseFindAllOptions,
  IDatabaseGetTotalOptions,
  IDatabaseOptions,
  IDatabaseUpdateManyOptions,
} from '@/common/database/interfaces/database.interface';
import { SessionDoc, SessionEntity } from '../entities/session.entity';
import { SessionCreateRequestDto } from '../dtos/request/session.create.request.dto';
import { SessionListResponseDto } from '../dtos/response/session.list.response.dto';
import { IUserDoc } from '@/modules/user/interfaces/user.interface';

export interface ISessionService {
  findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<SessionDoc[]>;
  findAllByUser(
    user: string,
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<SessionDoc[]>;
  findOneById(
    _id: string,
    options?: IDatabaseOptions,
  ): Promise<SessionDoc | null>;
  findOne(
    find: Record<string, any>,
    options?: IDatabaseOptions,
  ): Promise<SessionDoc | null>;
  findOneActiveById(
    _id: string,
    options?: IDatabaseOptions,
  ): Promise<SessionDoc | null>;
  findOneActiveByIdAndUser(
    _id: string,
    user: string,
    options?: IDatabaseOptions,
  ): Promise<SessionDoc | null>;
  getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number>;
  getTotalByUser(
    user: string,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number>;
  create(
    request: Request,
    { user }: SessionCreateRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<SessionDoc>;
  mapList(userLogins: SessionDoc[] | SessionEntity[]): SessionListResponseDto[];
  findLoginSession(_id: string): Promise<string>;
  setLoginSession(user: IUserDoc, session: SessionDoc): Promise<void>;
  deleteLoginSession(_id: string): Promise<void>;
  resetLoginSession(): Promise<void>;
  updateRevoke(
    repository: SessionDoc,
    options?: IDatabaseOptions,
  ): Promise<SessionDoc>;
  updateManyRevokeByUser(
    user: string,
    options?: IDatabaseUpdateManyOptions,
  ): Promise<boolean>;
  deleteMany(
    find?: Record<string, any>,
    options?: IDatabaseDeleteManyOptions,
  ): Promise<boolean>;
}
