import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import {
  CandidateAdminListDoc,
  CandidateAdminParamsIdDoc,
  CandidateUpdateStatusDoc,
} from '../docs/candidate.admin.doc';
import {
  Response,
  ResponsePaging,
} from '@/common/response/decorators/response.decorator';
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
  PaginationQuery,
  PaginationQueryFilterInEnum,
} from '@/common/pagination/decorators/pagination.decorator';
import { PaginationListDto } from '@/common/pagination/dtos/pagination.list.dto';
import { ENUM_CANDIDATE_STATUS } from '../enums/candidate.enum';
import {
  IResponse,
  IResponsePaging,
} from '@/common/response/interfaces/response.interface';
import { CandidateListResponseDto } from '../dtos/response/candidate.list.response.dto';
import { CandidateDoc } from '../entities/candidate.entity';
import { CandidateService } from '../services/candidate.services';
import { CandidateGetResponseDto } from '../dtos/response/candidate.get.response.dto';
import { IDatabaseSaveOptions } from '@/common/database/interfaces/database.interface';
import { CandidateUpdateStatusRequestDto } from '../dtos/request/candidate.update-status.request.dto';

@ApiTags('modules.admin.hiring')
@Controller({
  version: '1',
  path: '/hiring/candidate',
})
export class CandidateAdminController {
  constructor(
    private readonly candidateService: CandidateService,
    private readonly paginationService: PaginationService,
  ) {}

  @CandidateAdminListDoc()
  @ResponsePaging('candidate.list')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.READ],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/list')
  async list(
    @PaginationQuery({
      availableSearch: ['name', 'status'],
    })
    { _search, _limit, _offset, _order }: PaginationListDto,
    @PaginationQueryFilterInEnum(
      'status',
      [
        ENUM_CANDIDATE_STATUS.HIRED,
        ENUM_CANDIDATE_STATUS.INTERVIEW_SCHEDULED,
        ENUM_CANDIDATE_STATUS.NEW,
        ENUM_CANDIDATE_STATUS.REJECTED,
        ENUM_CANDIDATE_STATUS.REVIEWED,
      ],
      ENUM_CANDIDATE_STATUS,
    )
    status: Record<string, any>,
    @Query('hiringId') hiringId: string,
    @Query('appliedAtFrom') appliedAtFrom: string,
    @Query('appliedAtTo') appliedAtTo: string,
  ): Promise<IResponsePaging<CandidateListResponseDto>> {
    const find: Record<string, any> = {
      ..._search,
      ...status,
    };
    if (hiringId) {
      find.hiringId = hiringId;
    }
    if (appliedAtFrom && appliedAtTo) {
      find.appliedAt = {
        $gte: new Date(appliedAtFrom),
        $lte: new Date(appliedAtTo),
      };
    } else if (appliedAtFrom) {
      find.appliedAt = { $gte: new Date(appliedAtFrom) };
    } else if (appliedAtTo) {
      find.appliedAt = { $lte: new Date(appliedAtTo) };
    }
    const candidate: CandidateDoc[] = await this.candidateService.findAll(
      find,
      {
        paging: {
          limit: _limit,
          offset: _offset,
        },
        order: _order,
      },
    );

    const total: number = await this.candidateService.getTotal(find);
    const totalPage: number = this.paginationService.totalPage(total, _limit);

    const mapped = this.candidateService.mapList(candidate);

    return {
      _pagination: {
        total,
        totalPage,
      },
      data: mapped,
    };
  }

  @CandidateAdminParamsIdDoc()
  @Response('candidate.get')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.READ],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/get/:id')
  async get(
    @Param('id') id: string,
  ): Promise<IResponse<CandidateGetResponseDto>> {
    const candidate = await this.candidateService.findOneById(id);
    if (!candidate) {
      throw new NotFoundException({
        message: 'candidate.error.notFound',
      });
    }
    const mapped = this.candidateService.mapGet(candidate);
    return { data: mapped };
  }

  @CandidateUpdateStatusDoc()
  @Response('candidate.updateStatus')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.READ],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/update/:id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() { status }: CandidateUpdateStatusRequestDto,
  ): Promise<IResponse<void>> {
    const candidate = await this.candidateService.findOneById(id);
    if (!candidate) {
      throw new NotFoundException({
        message: 'candidate.error.notFound',
      });
    }
    try {
      await this.candidateService.updateStatus(
        candidate,
        { status },
        {} as IDatabaseSaveOptions,
      );
      return {
        _metadata: {
          customProperty: {
            messageProperties: {
              status: status.toLowerCase(),
            },
          },
        },
      };
    } catch (err) {
      throw new InternalServerErrorException({
        message: 'candidate.error.updateStatusFailed',
        _error: err,
      });
    }
  }
}
