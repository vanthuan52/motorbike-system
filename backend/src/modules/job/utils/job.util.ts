import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import slugify from 'slugify';
import { JobModel } from '../models/job.model';
import { JobResponseDto } from '../dtos/job.response.dto';

@Injectable()
export class JobUtil {
  mapList(job: JobModel[]): JobResponseDto[] {
    return plainToInstance(JobResponseDto, job);
  }

  mapOne(job: JobModel): JobResponseDto {
    return plainToInstance(JobResponseDto, job);
  }

  createSlug(name: string): string {
    return slugify(name, {
      lower: true,
      strict: true,
      locale: 'vi',
    });
  }
}
