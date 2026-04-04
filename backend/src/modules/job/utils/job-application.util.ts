import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { JobApplicationResponseDto } from '../dtos/job-application.response.dto';
import { JobApplicationModel } from '../models/job-application.model';

@Injectable()
export class JobApplicationUtil {
  mapList(jobApplications: JobApplicationModel[]): JobApplicationResponseDto[] {
    return plainToInstance(JobApplicationResponseDto, jobApplications);
  }

  mapOne(jobApplication: JobApplicationModel): JobApplicationResponseDto {
    return plainToInstance(JobApplicationResponseDto, jobApplication);
  }
}
