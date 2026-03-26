import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import slugify from 'slugify';
import { StoreListResponseDto } from '../dtos/response/store.list.response.dto';
import { StoreDto } from '../dtos/store.dto';
import { StoreModel } from '../models/store.model';

@Injectable()
export class StoreUtil {
  constructor(private readonly configService: ConfigService) {}

  mapList(stores: StoreModel[]): StoreListResponseDto[] {
    return plainToInstance(StoreListResponseDto, stores);
  }

  mapOne(store: StoreModel): StoreDto {
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
