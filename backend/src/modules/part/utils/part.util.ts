import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import slugify from 'slugify';
import { PartListResponseDto } from '../dtos/response/part.list.response.dto';
import { PartDto } from '../dtos/part.dto';
import { PartGetFullResponseDto } from '../dtos/response/part.full.response.dto';
import { Part } from '@/generated/prisma-client';

@Injectable()
export class PartUtil {
  mapList(parts: Part[]): PartListResponseDto[] {
    return plainToInstance(PartListResponseDto, parts);
  }

  mapOne(part: Part): PartDto {
    return plainToInstance(PartDto, part);
  }

  mapGetPopulate(part: Part): PartGetFullResponseDto {
    return plainToInstance(PartGetFullResponseDto, part);
  }

  createSlug(name: string): string {
    return slugify(name, {
      lower: true,
      strict: true,
      locale: 'vi',
    });
  }
}
