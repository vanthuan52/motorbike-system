import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { vehicleModelActions } from "@/modules/vehicle-model/store/vehicle-model-slice";
import { vehicleServiceActions } from "@/modules/vehicle-service/store/vehicle-service-slice";

export function useVehicleOptions() {
  const dispatch = useAppDispatch();

  const { list: vehicleServices, loadingList: loadingVehicleServices } =
    useAppSelector((state) => state.vehicleService);
  const { list: vehicleModels, loadingList: loadingVehicleModels } =
    useAppSelector((state) => state.vehicleModel);

  useEffect(() => {
    if (!vehicleServices?.length) {
      dispatch(
        vehicleServiceActions.getVehicleServices({ page: 1, perPage: 1000 })
      );
    }
  }, [dispatch, vehicleServices]);

  useEffect(() => {
    if (!vehicleModels?.length) {
      dispatch(
        vehicleModelActions.getVehicleModels({ page: 1, perPage: 1000 })
      );
    }
  }, [dispatch, vehicleModels]);

  const vehicleServiceOptions = useMemo(
    () =>
      vehicleServices.map((s) => ({
        value: s._id,
        label: s.name,
      })),
    [vehicleServices]
  );

  const vehicleModelOptions = useMemo(
    () =>
      vehicleModels.map((m) => ({
        value: m._id,
        label: m.fullName,
      })),
    [vehicleModels]
  );

  return {
    vehicleServiceOptions,
    loadingVehicleServices,
    vehicleModelOptions,
    loadingVehicleModels,
  };
}
