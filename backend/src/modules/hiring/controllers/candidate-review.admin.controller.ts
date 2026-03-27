import { ApiTags } from '@nestjs/swagger';
import { CandidateService } from '../services/candidate.service';
import { CandidateReviewService } from '../services/candidate-review.service';
import {
  CandidateReviewAdminCreateDoc,
  CandidateReviewAdminListDoc,
} from '../docs/candidate-review.admin.doc';
import { PolicyAbilityProtected } from '@/modules/policy/decorators/policy.decorator';
import {
  EnumPolicySubject,
  EnumPolicyAction,
} from '@/modules/policy/enums/policy.enum';
import { UserProtected } from '@/modules/user/decorators/user.decorator';
import { AuthJwtAccessProtected } from '@/modules/auth/decorators/auth.jwt.decorator';
import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Query,
} from '@nestjs/common';
import {
  IResponseReturn,
  IResponsePagingReturn,
} from '@/common/response/interfaces/response.interface';
import { CandidateReviewCreateRequestDto } from '../dtos/request/candidate-review.create.request.dto';
import { UserService } from '@/modules/user/services/user.service';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.dto';
import {
  Response,
  ResponsePaging,
} from '@/common/response/decorators/response.decorator';
import { RoleProtected } from '@/modules/role/decorators/role.decorator';
import { CandidateReviewUtil } from '../utils/candidate-review.util';
import { CandidateReviewResponseDto } from '../dtos/candidate-review-response.dto';
import { PaginationOffsetQuery } from '@/common/pagination/decorators/pagination.decorator';
import {
  IPaginationQueryOffsetParams,
  IPaginationIn,
} from '@/common/pagination/interfaces/pagination.interface';
import { Prisma } from '@/generated/prisma-client';
import { EnumRoleType } from '@/modules/role/enums/role.enum';

@ApiTags('modules.admin.hiring')
@Controller({
  version: '1',
  path: '/hiring/candidate-review',
})
export class CandidateReviewAdminController {
  constructor(
    private readonly candidateReviewService: CandidateReviewService,
    private readonly candidateService: CandidateService,
    private readonly userService: UserService,
    private readonly candidateReviewUtil: CandidateReviewUtil
  ) {}

  @CandidateReviewAdminListDoc()
  @ResponsePaging('candidate-review.list')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.user,
    action: [EnumPolicyAction.read],
  })
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/list')
  async list(
    @PaginationOffsetQuery({
      availableSearch: [],
    })
    pagination: IPaginationQueryOffsetParams<
      Prisma.CandidateReviewSelect,
      Prisma.CandidateReviewWhereInput
    >,
    @Query('candidate')
    candidateId: string
  ): Promise<IResponsePagingReturn<CandidateReviewResponseDto>> {
    const filters: Record<string, any> = {};

    if (candidateId) {
      const isCandidateExist =
        await this.candidateService.findOneById(candidateId);
      if (!isCandidateExist) {
        throw new NotFoundException('candidate-review.error.notFoundCandidate');
      }
      filters.candidateId = candidateId;
    } else {
      throw new NotFoundException('candidate-review.error.notFoundCandidate');
    }

    const result = await this.candidateReviewService.getListOffset(
      pagination,
      filters
    );

    const mapped = this.candidateReviewUtil.mapList(result.data);

    return {
      ...result,
      data: mapped,
    };
  }

  @CandidateReviewAdminCreateDoc()
  @Response('candidate-review.create')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.user,
    action: [EnumPolicyAction.create],
  })
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Post('/create')
  async create(
    @Body() payload: CandidateReviewCreateRequestDto
  ): Promise<IResponseReturn<DatabaseIdDto>> {
    const isCandidateExist = await this.candidateService.findOneById(
      payload.candidate
    );
    if (!isCandidateExist)
      throw new NotFoundException('hiring.error.notFoundCandidate');

    const isUserExist = await this.userService.findOneById(payload.user);
    if (!isUserExist) throw new NotFoundException('user.error.notFound');

    const created = await this.candidateReviewService.create(payload);

    return { data: created };
  }
}
