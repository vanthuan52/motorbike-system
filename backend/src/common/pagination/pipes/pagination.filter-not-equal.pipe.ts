import {
  Inject,
  Injectable,
  mixin,
  PipeTransform,
  Scope,
  Type,
} from '@nestjs/common';
import { IPaginationFilterEqualOptions } from '../interfaces/pagination.interface';
import { REQUEST } from '@nestjs/core';
import { IRequestApp } from '@/common/request/interfaces/request.interface';
import { DatabaseService } from '@/common/database/services/database.service';
import { ResponsePagingMetadataPaginationRequestDto } from '@/common/response/dtos/response.paging.dto';

export function PaginationFilterNotEqualPipe(
  field: string,
  options?: IPaginationFilterEqualOptions,
): Type<PipeTransform> {
  @Injectable({ scope: Scope.REQUEST })
  class MixinPaginationFilterEqualPipe implements PipeTransform {
    constructor(
      @Inject(REQUEST) protected readonly request: IRequestApp,
      private readonly databaseService: DatabaseService,
    ) {}

    async transform(value: string): Promise<any> {
      if (!value) {
        return;
      }

      if (options?.raw) {
        this.addToRequestInstance(value);
        return {
          [field]: value,
        };
      }

      const finalValue: string | number = options?.isNumber
        ? Number.parseInt(value)
        : value.trim();

      this.addToRequestInstance(finalValue);
      return this.databaseService.filterNotEqual(field, finalValue);
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

  return mixin(MixinPaginationFilterEqualPipe);
}
