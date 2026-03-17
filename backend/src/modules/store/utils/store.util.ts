import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { Document } from 'mongoose';
import slugify from 'slugify';
import { IStoreDoc, IStoreEntity } from '../interfaces/store.interface';
import { StoreDoc } from '../entities/store.entity';
import { StoreListResponseDto } from '../dtos/response/store.list.response.dto';
import { StoreDto } from '../dtos/store.dto';

@Injectable()
export class StoreUtil {
  constructor(private readonly configService: ConfigService) {}

  mapList(
    stores: IStoreDoc[] | IStoreEntity[] | StoreDoc[],
  ): StoreListResponseDto[] {
    return plainToInstance(
      StoreListResponseDto,
      stores.map((s: IStoreDoc | IStoreEntity | StoreDoc) =>
        s instanceof Document ? s.toObject() : s,
      ),
    );
  }

  mapOne(store: IStoreDoc | IStoreEntity | StoreDoc): StoreDto {
    return plainToInstance(
      StoreDto,
      store instanceof Document ? store.toObject() : store,
    );
  }

  createSlug(name: string): string {
    return slugify(name, {
      lower: true,
      strict: true,
      locale: 'vi',
    });
  }
}
