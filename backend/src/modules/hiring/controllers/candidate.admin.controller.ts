import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  CandidateAdminListDoc,
  CandidateAdminParamsIdDoc,
  CandidateAdminUpdateStatusDoc,
} from '../docs/candidate.admin.doc';
import {
  Response,
  ResponsePaging,
} from '@/common/response/decorators/response.decorator';
import { PolicyAbilityProtected } from '@/modules/policy/decorators/policy.decorator';
import {
  EnumPolicyAction,
  EnumRoleType,
  EnumPolicySubject,
} from '@/modules/policy/enums/policy.enum';
import { UserProtected } from '@/modules/user/decorators/user.decorator';
import { AuthJwtAccessProtected } from '@/modules/auth/decorators/auth.jwt.decorator';
import {
  PaginationOffsetQuery,
  PaginationQueryFilterInEnum,
} from '@/common/pagination/decorators/pagination.decorator';
import {
  IPaginationQueryOffsetParams,
  IPaginationIn,
} from '@/common/pagination/interfaces/pagination.interface';
import { EnumCandidateStatus } from '../enums/hiring.enum';
import {
  IResponseReturn,
  IResponsePagingReturn,
} from '@/common/response/interfaces/response.interface';
import { CandidateResponseDto } from '../dtos/candidate-response.dto';
import { CandidateDoc } from '../entities/candidate.entity';
import { CandidateService } from '../services/candidate.service';
import { IDatabaseSaveOptions } from '@/common/database/interfaces/database.interface';
import { CandidateUpdateStatusRequestDto } from '../dtos/request/candidate.update-status.request.dto';
import { RoleProtected } from '@/modules/role/decorators/role.decorator';
import { CandidateUtil } from '../utils/candidate.util';
import { PaginationUtil } from '@/common/pagination/utils/pagination.util';

@ApiTags('modules.admin.hiring')
@Controller({
  version: '1',
  path: '/hiring/candidate',
})
export class CandidateAdminController {
  constructor(
    private readonly candidateService: CandidateService,
    private readonly candidateUtil: CandidateUtil,
    private readonly paginationUtil: PaginationUtil,
  ) {}

  @CandidateAdminListDoc()
  @ResponsePaging('candidate.list')
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
      availableSearch: ['name', 'status'],
    })
    { limit, skip, where, orderBy }: IPaginationQueryOffsetParams,
    @PaginationQueryFilterInEnum('status', [
      EnumCandidateStatus.hired,
      EnumCandidateStatus.interviewScheduled,
      EnumCandidateStatus.new,
      EnumCandidateStatus.rejected,
      EnumCandidateStatus.reviewed,
    ])
    status: Record<string, IPaginationIn>,
    @Query('hiring') hiring: string,
    @Query('appliedAtFrom') appliedAtFrom: string,
    @Query('appliedAtTo') appliedAtTo: string,
  ): Promise<IResponsePagingReturn<CandidateResponseDto>> {
    const find: Record<string, any> = {
      ...where,
      ...status,
    };
    if (hiring) {
      find.hiring = hiring;
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

    // Manual pagination using findAll and getTotal because Service doesn't have getListOffset yet used in other modules.
    // However, I should probably stick to what Service provides if I don't want to change Service extensively to standard getListOffset.
    // Given the task is about standardizing Service return type (Raw Data), using findAll and getTotal separately is fine as they return raw data.

    // Ideally I should refactor Service to have getListOffset if I want to be consistent with others, but let's see.
    // The previous modules (CareRecord) had getListOffset.
    // Hiring Service has findAll.
    // I will use findAll and getTotal here, and use PaginationUtil to format.

    const [candidates, total] = await Promise.all([
      this.candidateService.findAll(find, {
        paging: { limit, offset: skip },
        order: orderBy,
      }),
      this.candidateService.getTotal(find),
    ]);

    const mapped = this.candidateUtil.mapList(candidates);

    return this.paginationUtil.formatOffset(mapped, total, {
      limit,
      skip,
    });
  }

  @CandidateAdminParamsIdDoc()
  @Response('candidate.get')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.user,
    action: [EnumPolicyAction.read],
  })
  @RoleProtected(EnumRoleType.admin, EnumRoleType.user)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/get/:id')
  async get(
    @Param('id') id: string,
  ): Promise<IResponseReturn<CandidateResponseDto>> {
    const candidate = await this.candidateService.findOneById(id);
    if (!candidate) {
      throw new NotFoundException({
        message: 'candidate.error.notFound',
      });
    }
    const mapped = this.candidateUtil.mapOne(candidate);
    return { data: mapped };
  }

  @CandidateAdminUpdateStatusDoc()
  @Response('candidate.updateStatus')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.user,
    action: [EnumPolicyAction.read],
  })
  @RoleProtected(EnumRoleType.admin, EnumRoleType.user)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Patch('/update/:id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() { status }: CandidateUpdateStatusRequestDto,
  ): Promise<IResponseReturn<void>> {
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
        metadata: {
          messageProperties: {
            status: status.toLowerCase(),
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
