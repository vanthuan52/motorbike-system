"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { vehicleModelActions } from "@/features/vehicle-model/store/vehicle-model-slice";

export const useVehicleModelByBrand = (vehicleBrandId?: string) => {
  const dispatch = useDispatch();
  const [initialized, setInitialized] = useState(false);

  const { list: vehicleModels, loadingList: loadingVehicleModels } =
    useSelector((state: RootState) => state.vehicleModel);

  useEffect(() => {
    if (vehicleBrandId) {
      dispatch(
        vehicleModelActions.getVehicleModels({
          vehicleBrand: vehicleBrandId,
          page: 1,
          perPage: 100,
        })
      );
      setInitialized(true);
    } else {
      dispatch(vehicleModelActions.resetState());
    }
  }, [vehicleBrandId, dispatch]);

  const vehicleModelOptions =
    vehicleModels.map((m) => ({
      label: m.name,
      value: m._id,
    })) || [];

  return {
    vehicleModels,
    loadingVehicleModels,
    vehicleModelOptions,
  };
};
