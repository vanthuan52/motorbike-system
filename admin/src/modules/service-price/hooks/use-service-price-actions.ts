import { useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { servicePriceActions } from "../store/service-price-slice";
import { ServicePricePaginationQuery } from "../types";

interface UseServicePriceActionsProps {
  pagination: any;
  mappedFilters: any;
}

export function useServicePriceActions({
  pagination,
  mappedFilters,
}: UseServicePriceActionsProps) {
  const dispatch = useAppDispatch();
  const { create, update, deletion } = useAppSelector(
    (state) => state.servicePrice
  );

  const fetchServicePrices = useCallback(() => {
    dispatch(
      servicePriceActions.getServicePrices({
        page: pagination.page,
        perPage: pagination.perPage,
        orderBy: "dateStart",
        orderDirection: "desc",
        ...mappedFilters,
      } as ServicePricePaginationQuery)
    );
  }, [dispatch, pagination, mappedFilters]);

  useEffect(() => {
    fetchServicePrices();
  }, [fetchServicePrices, deletion.success, create.success, update.success]);

  return { fetchServicePrices };
}
