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
import { CandidateUserCreateRequestDto } from '../dtos/request/candidate.create.request.dto';
import { IResponse } from '@/common/response/interfaces/response.interface';
import { DatabaseIdResponseDto } from '@/common/database/dtos/response/database.id.response.dto';
import { HiringService } from '../services/hiring.services';

@ApiTags('modules.hiring.public')
@Controller({
  version: '1',
  path: '/hiring/candidate',
})
export class CandidatePublicController {
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
      const hiring = await this.hiringService.findOneById(String(body.hiring));
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
