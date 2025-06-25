import { ApiTags } from '@nestjs/swagger';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import { CandidateService } from '../services/candidate.services';
import { CandidateReviewService } from '../services/candidate-review.services';
import {
  CandidateReviewAdminCreateDoc,
  CandidateReviewAdminListDoc,
} from '../docs/candidate-review.admin.doc';
import {
  PolicyAbilityProtected,
  PolicyRoleProtected,
} from '@/modules/policy/decorators/policy.decorator';
import {
  ENUM_POLICY_ACTION,
  ENUM_POLICY_ROLE_TYPE,
  ENUM_POLICY_SUBJECT,
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
  IResponse,
  IResponsePaging,
} from '@/common/response/interfaces/response.interface';
import { CandidateReviewListResponseDto } from '../dtos/response/candidate-review.list.response.dto';
import { CandidateReviewAdminCreateRequestDto } from '../dtos/request/candidate-review.create.request.dto';
import { UserService } from '@/modules/user/services/user.service';
import { DatabaseIdResponseDto } from '@/common/database/dtos/response/database.id.response.dto';
import { Response } from '@/common/response/decorators/response.decorator';
import { CandidateReviewDoc } from '../entities/candidate-review.entity';
import { ENUM_PAGINATION_ORDER_DIRECTION_TYPE } from '@/common/pagination/enums/pagination.enum';

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
  ) {}
  @CandidateReviewAdminListDoc()
  @Response('candidate-review.list')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.READ],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/list')
  async list(
    @Query('candidate') candidate: string,
    @Query('more') more: string,
  ): Promise<IResponsePaging<CandidateReviewListResponseDto>> {
    if (!candidate) {
      throw new NotFoundException('candidate-review.error.notFoundCandidate');
    }

    const isCandidateExist = await this.candidateService.findOneById(candidate);
    if (!isCandidateExist) {
      throw new NotFoundException('candidate-review.error.notFoundCandidate');
    }

    const moreCount = Number(more) || 0;
    const defaultLimit = 10;

    const limit = (moreCount + 1) * defaultLimit;
    const offset = 0;

    const find: Record<string, any> = { candidate };

    const candidateReviews: CandidateReviewDoc[] =
      await this.candidateReviewService.findAll(find, {
        paging: {
          limit,
          offset,
        },
        order: {
          createdAt: ENUM_PAGINATION_ORDER_DIRECTION_TYPE.DESC,
        },
      });

    const total = await this.candidateReviewService.getTotal(find);
    const totalPage = this.paginationService.totalPage(total, defaultLimit);

    const mapped = this.candidateReviewService.mapList(candidateReviews);

    return {
      _pagination: {
        total,
        totalPage,
      },
      data: mapped,
    };
  }

  @CandidateReviewAdminCreateDoc()
  @Response('candidate-review.create')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.CREATE],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Post('/create')
  async create(
    @Body() payload: CandidateReviewAdminCreateRequestDto,
  ): Promise<IResponse<DatabaseIdResponseDto>> {
    const isCandidateExist = await this.candidateService.findOneById(
      payload.candidate,
    );
    if (!isCandidateExist)
      throw new NotFoundException('hiring.error.notFoundCandidate');

    const isUserExist = await this.userService.findOneById(payload.user);
    if (!isUserExist) throw new NotFoundException('user.error.notFound');

    const candidateReview = await this.candidateReviewService.create(payload);

    return { data: candidateReview };
  }
}
