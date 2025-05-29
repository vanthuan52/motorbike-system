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

export function PaginationFilterStringContainPipe(
  field: string,
  options?: IPaginationFilterOptions,
): Type<PipeTransform> {
  @Injectable({ scope: Scope.REQUEST })
  class MixinPaginationFilterContainPipe implements PipeTransform {
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

      value = value.trim();

      this.addToRequestInstance(value);
      return this.databaseService.filterContain(field, value);
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

  return mixin(MixinPaginationFilterContainPipe);
}
