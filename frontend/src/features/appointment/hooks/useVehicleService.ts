"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { vehicleServiceActions } from "@/features/vehicle-service/store/vehicle-service-slice";
import { RootState } from "@/store";

export const useVehicleService = () => {
  const dispatch = useDispatch();
  const { list: vehicleServices, loadingList: loadingVehicleServices } =
    useSelector((state: RootState) => state.vehicleService);

  useEffect(() => {
    dispatch(
      vehicleServiceActions.getVehicleServices({
        search: "",
        page: 1,
        perPage: 100,
      })
    );
  }, [dispatch]);

  const vehicleServiceOptions =
    vehicleServices.map((m) => ({
      label: m.name,
      value: m._id,
    })) || [];

  return {
    vehicleServices,
    loadingVehicleServices,
    vehicleServiceOptions,
  };
};
