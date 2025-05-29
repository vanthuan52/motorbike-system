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
import { ResponsePagingMetadataPaginationRequestDto } from '@/common/response/dtos/response.paging.dto';
import { HelperArrayService } from '@/common/helper/services/helper.array.service';

export function PaginationFilterInBooleanPipe(
  field: string,
  defaultValue: boolean[],
  options?: IPaginationFilterOptions,
): Type<PipeTransform> {
  @Injectable({ scope: Scope.REQUEST })
  class MixinPaginationFilterInBooleanPipe implements PipeTransform {
    constructor(
      @Inject(REQUEST) protected readonly request: IRequestApp,
      private readonly databaseService: DatabaseService,
      private readonly helperArrayService: HelperArrayService,
    ) {}

    async transform(value: string): Promise<any> {
      if (options?.raw) {
        this.addToRequestInstance(value);
        return {
          [field]: value,
        };
      }

      const finalValue: boolean[] = value
        ? this.helperArrayService.unique(
            value.split(',').map((val: string) => val === 'true'),
          )
        : defaultValue;

      this.addToRequestInstance(finalValue);
      return this.databaseService.filterIn<boolean>(field, finalValue);
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

  return mixin(MixinPaginationFilterInBooleanPipe);
}
