import { useCallback, useEffect } from "react";
import { useAppDispatch } from "@/store";
import { servicePriceActions } from "../store/service-price-slice";
import { ModelServicePricePaginationQuery } from "../types";

interface UseModelServicePriceActionsProps {
  vehicleServiceId: string;
  pagination: any;
  mappedFilters: any;
}

export function useModelServicePriceActions({
  vehicleServiceId,
  pagination,
  mappedFilters,
}: UseModelServicePriceActionsProps) {
  const dispatch = useAppDispatch();

  const fetchModelServicePrices = useCallback(() => {
    dispatch(
      servicePriceActions.getModelServicePrices({
        vehicleServiceId,
        query: {
          page: pagination.page,
          perPage: pagination.perPage,
          orderBy: "dateStart",
          orderDirection: "desc",
          ...mappedFilters,
        } as ModelServicePricePaginationQuery,
      })
    );
  }, [dispatch, pagination, mappedFilters]);

  useEffect(() => {
    fetchModelServicePrices();
  }, [fetchModelServicePrices]);

  return { fetchModelServicePrices };
}
