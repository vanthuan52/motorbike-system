import { useMemo } from "react";
import { useFilters } from "@/hooks/use-filters";
import { DEFAULT_PAGINATION_QUERY } from "@/constants/pagination";
import usePagination from "@/hooks/use-pagination";

export function useServicePriceFilters(queryParams: any) {
  const { page: pageParam, perPage: limitParam, ...restParams } = queryParams;

  const { pagination, handlePaginationChange } = usePagination({
    page: Number(pageParam) || DEFAULT_PAGINATION_QUERY.page,
    perPage: Number(limitParam) || DEFAULT_PAGINATION_QUERY.perPage,
  });

  const { filters, mappedFilters, handleFiltersChange } =
    useFilters(restParams);

  const memoizedMappedFilters = useMemo(
    () => mappedFilters,
    [JSON.stringify(mappedFilters)]
  );

  return {
    filters,
    mappedFilters: memoizedMappedFilters,
    handleFiltersChange,
    pagination,
    handlePaginationChange,
  };
}
