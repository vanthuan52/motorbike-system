import { useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { VehiclePartPaginationQuery } from "../types";
import { vehiclePartActions } from "../store/part-slice";

interface UseVehiclePartActionsProps {
  pagination: any;
  mappedFilters: any;
}

export function useVehiclePartActions({
  pagination,
  mappedFilters,
}: UseVehiclePartActionsProps) {
  const dispatch = useAppDispatch();
  const { create, update, deletion } = useAppSelector(
    (state) => state.vehicleParts
  );

  const fetchVehicleParts = useCallback(() => {
    dispatch(
      vehiclePartActions.getPart({
        page: pagination.page,
        perPage: pagination.perPage,
        orderBy: "dateStart",
        orderDirection: "desc",
        ...mappedFilters,
      } as VehiclePartPaginationQuery)
    );
  }, [dispatch, pagination, mappedFilters]);

  useEffect(() => {
    fetchVehicleParts();
  }, [fetchVehicleParts, deletion.success, create.success, update.success]);

  return { fetchVehicleParts };
}
