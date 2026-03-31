import {
  Body,
  Controller,
  Get,
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
import { CandidateService } from '../services/candidate.service';
import { CandidateUpdateStatusRequestDto } from '../dtos/request/candidate.update-status.request.dto';
import { RoleProtected } from '@/modules/role/decorators/role.decorator';
import { CandidateUtil } from '../utils/candidate.util';
import { Prisma } from '@/generated/prisma-client';

@ApiTags('modules.admin.hiring')
@Controller({
  version: '1',
  path: '/hiring/candidate',
})
export class CandidateAdminController {
  constructor(
    private readonly candidateService: CandidateService,
    private readonly candidateUtil: CandidateUtil,
  ) {}

  @CandidateAdminListDoc()
  @ResponsePaging('candidate.list')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.candidate,
    action: [EnumPolicyAction.read],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/list')
  async list(
    @PaginationOffsetQuery({
      availableSearch: ['name', 'status'],
    })
    pagination: IPaginationQueryOffsetParams<
      Prisma.CandidateSelect,
      Prisma.CandidateWhereInput
    >,
    @PaginationQueryFilterInEnum('status', [
      EnumCandidateStatus.hired,
      EnumCandidateStatus.interviewScheduled,
      EnumCandidateStatus.new,
      EnumCandidateStatus.rejected,
      EnumCandidateStatus.reviewed,
      EnumCandidateStatus.interviewing,
    ])
    status: Record<string, IPaginationIn>,
    @Query('hiring') hiring: string,
    @Query('appliedAtFrom') appliedAtFrom: string,
    @Query('appliedAtTo') appliedAtTo: string,
  ): Promise<IResponsePagingReturn<CandidateResponseDto>> {
    const filters: Record<string, any> = {
      ...status,
    };
    if (hiring) {
      filters.hiringId = hiring;
    }
    if (appliedAtFrom && appliedAtTo) {
      filters.appliedAt = {
        gte: new Date(appliedAtFrom),
        lte: new Date(appliedAtTo),
      };
    } else if (appliedAtFrom) {
      filters.appliedAt = { gte: new Date(appliedAtFrom) };
    } else if (appliedAtTo) {
      filters.appliedAt = { lte: new Date(appliedAtTo) };
    }

    const result = await this.candidateService.getListOffset(
      pagination,
      filters
    );

    const mapped = this.candidateUtil.mapList(result.data);

    return {
      ...result,
      data: mapped,
    };
  }

  @CandidateAdminParamsIdDoc()
  @Response('candidate.get')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.candidate,
    action: [EnumPolicyAction.read],
  })
  @RoleProtected('admin', 'user')
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
    subject: EnumPolicySubject.candidate,
    action: [EnumPolicyAction.read, EnumPolicyAction.update],
  })
  @RoleProtected('admin', 'user')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Patch('/update/:id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() payload: CandidateUpdateStatusRequestDto,
  ): Promise<IResponseReturn<void>> {
    await this.candidateService.updateStatus(id, payload);
    return {
      metadata: {
        messageProperties: {
          status: payload.status.toLowerCase(),
        },
      },
    };
  }
}
