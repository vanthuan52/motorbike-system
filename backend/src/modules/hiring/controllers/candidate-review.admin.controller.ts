import { ApiTags } from '@nestjs/swagger';
import { PaginationService } from '@/common/pagination/services/pagination.service';
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
  EnumRoleType,
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
import { PaginationUtil } from '@/common/pagination/utils/pagination.util';
import { CandidateReviewResponseDto } from '../dtos/candidate-review-response.dto';
import {
  PaginationOffsetQuery,
  PaginationQueryFilterInEnum,
} from '@/common/pagination/decorators/pagination.decorator';
import { IPaginationQueryOffsetParams } from '@/common/pagination/interfaces/pagination.interface';
import { CandidateReviewDoc } from '../entities/candidate-review.entity';

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
    private readonly paginationService: PaginationService,
    private readonly candidateReviewUtil: CandidateReviewUtil,
    private readonly paginationUtil: PaginationUtil
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
      availableSearch: [], // Add searchable fields if any, e.g. feedback? Entity has 'user', 'candidate', 'feedback'
    })
    { limit, skip, where, orderBy }: IPaginationQueryOffsetParams,
    @PaginationQueryFilterInEnum('candidate', []) // Not enum, but standard filter?
    // Wait, original controller filtered by 'candidate' query param.
    // I should support filtering by candidate ID.
    // PaginationOffsetQuery supports 'where' but complex logic might be needed if I want exact match on candidate ID.
    // Usually standard pattern suggests using query params for filters.
    // I will use @Query('candidate') like before, but integrate it into 'find'.
    @Query('candidate')
    candidateId: string
  ): Promise<IResponsePagingReturn<CandidateReviewResponseDto>> {
    // Original logic: required candidate.
    // If I want to maintain that:
    if (candidateId) {
      const isCandidateExist =
        await this.candidateService.findOneById(candidateId);
      if (!isCandidateExist) {
        throw new NotFoundException('candidate-review.error.notFoundCandidate');
      }
    } else {
      // Should I throw if candidate is missing? Original threw 404 if !candidate.
      throw new NotFoundException('candidate-review.error.notFoundCandidate');
    }

    const find: Record<string, any> = {
      ...where,
      candidate: candidateId,
    };

    const [candidateReviews, total] = await Promise.all([
      this.candidateReviewService.findAll(find, {
        paging: {
          limit,
          offset: skip,
        },
        order: orderBy,
      }),
      this.candidateReviewService.getTotal(find),
    ]);

    const mapped = this.candidateReviewUtil.mapList(candidateReviews);

    return this.paginationUtil.formatOffset(mapped, total, {
      limit,
      skip,
    });
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

    const candidateReview = await this.candidateReviewService.create(payload);

    return { data: { _id: candidateReview._id } };
  }
}
