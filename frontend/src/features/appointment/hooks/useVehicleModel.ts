"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { vehicleModelActions } from "@/features/vehicle-model/store/vehicle-model-slice";
import { RootState } from "@/store";

export const useVehicleModel = () => {
  const dispatch = useDispatch();

  const { list: vehicleModels, loadingList: loadingVehicleModels } =
    useSelector((state: RootState) => state.vehicleModel);

  useEffect(() => {
    dispatch(
      vehicleModelActions.getVehicleModels({
        page: 1,
        perPage: 100,
      })
    );
  }, [dispatch]);

  const vehicleModelOptions =
    vehicleModels.map((m) => ({
      label: m.fullName || m.name,
      value: m._id,
    })) || [];

  return {
    vehicleModels,
    loadingVehicleModels,
    vehicleModelOptions,
  };
};
