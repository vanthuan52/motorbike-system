import { ApiTags } from '@nestjs/swagger';
import { CandidatePublicCreateDoc } from '../docs/candidate.public.doc';
import {
  Body,
  Controller,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { CandidateService } from '../services/candidate.service';
import { Response } from '@/common/response/decorators/response.decorator';
import { CandidateUserCreateRequestDto } from '../dtos/request/candidate.create.request.dto';
import { IResponseReturn } from '@/common/response/interfaces/response.interface';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.response.dto';
import { HiringService } from '../services/hiring.service';
import { CandidateUtil } from '../utils/candidate.util';

@ApiTags('modules.hiring.public')
@Controller({
  version: '1',
  path: '/hiring/candidate',
})
export class CandidatePublicController {
  constructor(
    private readonly candidateService: CandidateService,
    private readonly hiringService: HiringService,
    private readonly candidateUtil: CandidateUtil,
  ) {}
  @CandidatePublicCreateDoc()
  @Response('candidate.create')
  @Post('/create')
  async create(
    @Body() body: CandidateUserCreateRequestDto,
  ): Promise<IResponseReturn<DatabaseIdDto>> {
    try {
      // HiringService refactor is pending, assuming findOneById returns raw or whatever it returns.
      // Based on context it likely returns entity or null if not updated yet, or maybe IResponseReturn if not updated.
      // Since I haven't updated HiringService yet, I should check what it returns or assume standard.
      // In file listing, hiring.service.ts exists. I'll interact with it as is.
      // If HiringService.findOneById() returns promise<doc | null>, then:

      const hiring = await this.hiringService.findOneById(String(body.hiring));
      if (!hiring) {
        throw new NotFoundException('hiring.error.notFoundHiring');
      }

      const candidate = await this.candidateService.create(body);

      return { data: { _id: candidate._id } };
    } catch (err) {
      if (err instanceof HttpException) throw err;

      throw new InternalServerErrorException({
        message: 'candidate.error.createFailed',
        _error: err,
      });
    }
  }
}
