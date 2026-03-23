import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import slugify from 'slugify';
import { StoreListResponseDto } from '../dtos/response/store.list.response.dto';
import { StoreDto } from '../dtos/store.dto';
import { Store } from '@/generated/prisma-client';

@Injectable()
export class StoreUtil {
  constructor(private readonly configService: ConfigService) {}

  mapList(stores: Store[]): StoreListResponseDto[] {
    return plainToInstance(StoreListResponseDto, stores);
  }

  mapOne(store: Store): StoreDto {
    return plainToInstance(StoreDto, store);
  }

  createSlug(name: string): string {
    return slugify(name, {
      lower: true,
      strict: true,
      locale: 'vi',
    });
  }
}
