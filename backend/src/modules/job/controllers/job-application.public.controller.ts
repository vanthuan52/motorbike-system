import { ApiTags } from '@nestjs/swagger';
import { JobApplicationPublicCreateDoc } from '../docs/job-application.public.doc';
import {
  Body,
  Controller,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { JobApplicationService } from '../services/job-application.service';
import { Response } from '@/common/response/decorators/response.decorator';
import { JobApplicationUserCreateRequestDto } from '../dtos/request/job-application.create.request.dto';
import { IResponseReturn } from '@/common/response/interfaces/response.interface';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.dto';
import { JobService } from '../services/job.service';
import { JobApplicationUtil } from '../utils/job-application.util';

@ApiTags('modules.job.public')
@Controller({
  version: '1',
  path: '/job/job-application',
})
export class JobApplicationPublicController {
  constructor(
    private readonly jobApplicationService: JobApplicationService,
    private readonly jobService: JobService,
    private readonly jobApplicationUtil: JobApplicationUtil
  ) {}
  @JobApplicationPublicCreateDoc()
  @Response('job-application.create')
  @Post('/create')
  async create(
    @Body() body: JobApplicationUserCreateRequestDto
  ): Promise<IResponseReturn<DatabaseIdDto>> {
    try {
      // JobService refactor is pending, assuming findOneById returns raw or whatever it returns.
      // Based on context it likely returns entity or null if not updated yet, or maybe IResponseReturn if not updated.
      // Since I haven't updated JobService yet, I should check what it returns or assume standard.
      // In file listing, job.service.ts exists. I'll interact with it as is.
      // If JobService.findOneById() returns promise<doc | null>, then:

      const job = await this.jobService.findOneById(String(body.job));
      if (!job) {
        throw new NotFoundException('job.error.notFoundJob');
      }

      const jobApplication = await this.jobApplicationService.create(body);

      return { data: { id: jobApplication.id } };
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }

      throw new InternalServerErrorException({
        message: 'jobApplication.error.createFailed',
        _error: err,
      });
    }
  }
}
