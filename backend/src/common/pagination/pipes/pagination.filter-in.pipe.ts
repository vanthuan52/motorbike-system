import {
  Inject,
  Injectable,
  mixin,
  PipeTransform,
  Scope,
  Type,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { IPaginationFilterOptions } from '../interfaces/pagination.interface';
import { IRequestApp } from '@/common/request/interfaces/request.interface';
import { DatabaseService } from '@/common/database/services/database.service';
import { HelperArrayService } from '@/common/helper/services/helper.array.service';
import { ResponsePagingMetadataPaginationRequestDto } from '@/common/response/dtos/response.paging.dto';

export function PaginationFilterInPipe<T>(
  field: string,
  options?: IPaginationFilterOptions,
): Type<PipeTransform> {
  @Injectable({ scope: Scope.REQUEST })
  class MixinPaginationFilterInPipe implements PipeTransform {
    constructor(
      @Inject(REQUEST) protected readonly request: IRequestApp,
      private readonly databaseService: DatabaseService,
      private readonly helperArrayService: HelperArrayService,
    ) {}

    async transform(value: any) {
      if (!value) {
        return {};
      }
      
      if (options?.raw) {
        this.addToRequestInstance(value);

        return { [field]: value };
      }

      const finalValue: T[] = this.helperArrayService.unique<T>(
        value.split(',') as T[],
      );

      return this.databaseService.filterIn<T>(field, finalValue);
    }

    addToRequestInstance(value: any): void {
      this.request.__pagination = {
        ...this.request.__pagination,
        filters: this.request.__pagination?.filters
          ? {
              ...this.request.__pagination?.filters,
              [field]: value,
            }
          : { [field]: value },
      } as ResponsePagingMetadataPaginationRequestDto;
    }
  }

  return mixin(MixinPaginationFilterInPipe);
}
