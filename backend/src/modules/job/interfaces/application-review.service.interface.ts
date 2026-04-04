import {
  IPaginationQueryCursorParams,
  IPaginationQueryOffsetParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
} from '@/common/pagination/interfaces/pagination.interface';
import { ApplicationReviewCreateRequestDto } from '../dtos/request/application-review.create.request.dto';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.dto';
import { ApplicationReviewModel } from '../models/application-review.model';
import { IApplicationReviewListFilters } from './application-review.filter.interface';
import { Prisma } from '@/generated/prisma-client';

export interface IApplicationReviewService {
  getListOffset(
    pagination: IPaginationQueryOffsetParams<
      Prisma.ApplicationReviewSelect,
      Prisma.ApplicationReviewWhereInput
    >,
    filters?: IApplicationReviewListFilters
  ): Promise<IPaginationOffsetReturn<ApplicationReviewModel>>;

  getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.ApplicationReviewSelect,
      Prisma.ApplicationReviewWhereInput
    >,
    filters?: IApplicationReviewListFilters
  ): Promise<IPaginationCursorReturn<ApplicationReviewModel>>;

  findOneById(id: string): Promise<ApplicationReviewModel | null>;

  findOne(
    where: Prisma.ApplicationReviewWhereInput
  ): Promise<ApplicationReviewModel | null>;

  create(payload: ApplicationReviewCreateRequestDto): Promise<DatabaseIdDto>;

  delete(id: string): Promise<void>;
}
