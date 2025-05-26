import {
  IDatabaseAggregateOptions,
  IDatabaseFindAllOptions,
  IDatabaseFindOneOptions,
  IDatabaseGetTotalOptions,
  IDatabaseOptions,
} from '@/common/database/interfaces/database.interface';
import { UserDocument } from '../entities/user.entity';
import { PipelineStage } from 'mongoose';
import { IUserDoc } from './user.interface';

export interface IUserService {
  findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<UserDocument[]>;

  getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number>;

  createRawQueryFindAllWithRoleAndCountry(
    find?: Record<string, any>,
  ): PipelineStage[];

  findAllWithRoleAndCountry(
    find?: Record<string, any>,
    options?: IDatabaseAggregateOptions,
  ): Promise<number>;

  findOneById(_id: string, options?: IDatabaseOptions): Promise<UserDocument>;

  findOne(
    find: Record<string, any>,
    options?: IDatabaseOptions,
  ): Promise<UserDocument>;

  findOneByEmail(
    email: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<UserDocument>;
  findOneByPhone(
    phone: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<UserDocument>;

  findOneByRole(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<IUserDoc>;

  findAllActive(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<IUserDoc[]>;

  getTotalActive(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number>;
}
