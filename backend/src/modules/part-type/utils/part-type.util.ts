import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import slugify from 'slugify';
import { PartTypeListResponseDto } from '../dtos/response/part-type.list.response.dto';
import { PartTypeDto } from '../dtos/part-type.dto';
import { PartType } from '@/generated/prisma-client';

@Injectable()
export class PartTypeUtil {
  mapList(partTypes: PartType[]): PartTypeListResponseDto[] {
    return plainToInstance(PartTypeListResponseDto, partTypes);
  }

  mapOne(partType: PartType): PartTypeDto {
    return plainToInstance(PartTypeDto, partType);
  }

  createSlug(name: string): string {
    return slugify(name, {
      lower: true,
      strict: true,
      locale: 'vi',
    });
  }
}
