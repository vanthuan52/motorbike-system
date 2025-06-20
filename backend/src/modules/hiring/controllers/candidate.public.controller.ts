import { ApiTags } from '@nestjs/swagger';
import { CandidateUserCreateDoc } from '../docs/candidate.public.doc';
import {
  Body,
  Controller,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { CandidateService } from '../services/candidate.services';
import { Response } from '@/common/response/decorators/response.decorator';
import { PolicyRoleProtected } from '@/modules/policy/decorators/policy.decorator';
import { ENUM_POLICY_ROLE_TYPE } from '@/modules/policy/enums/policy.enum';
import { UserProtected } from '@/modules/user/decorators/user.decorator';
import { AuthJwtAccessProtected } from '@/modules/auth/decorators/auth.jwt.decorator';
import { CandidateUserCreateRequestDto } from '../dtos/request/candidate.create.request.dto';
import { IResponse } from '@/common/response/interfaces/response.interface';
import { DatabaseIdResponseDto } from '@/common/database/dtos/response/database.id.response.dto';
import { HiringService } from '../services/hiring.services';

@ApiTags('modules.hiring.public')
@Controller({
  version: '1',
  path: '/hiring/candidate',
})
export class CandidateUserController {
  constructor(
    private readonly candidateService: CandidateService,
    private readonly hiringService: HiringService,
  ) {}

  @CandidateUserCreateDoc()
  @Response('candidate.create')
  @Post('/create')
  async create(
    @Body() body: CandidateUserCreateRequestDto,
  ): Promise<IResponse<DatabaseIdResponseDto>> {
    try {
      const hiring = await this.hiringService.findOneById(
        String(body.hiringId),
      );
      if (!hiring) {
        throw new NotFoundException('hiring.error.notFoundHiring');
      }
      const candidate = await this.candidateService.create(body);
      return { data: candidate };
    } catch (err) {
      if (err instanceof HttpException) throw err;

      throw new InternalServerErrorException({
        message: 'candidate.error.createFailed',
        _error: err,
      });
    }
  }
}
