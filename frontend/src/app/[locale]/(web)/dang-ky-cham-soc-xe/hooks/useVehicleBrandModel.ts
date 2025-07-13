import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { vehicleModelActions } from "@/features/vehicle-model/store/vehicle-model-slice";
import { RootState } from "@/store";

export const useVehicleBrandModel = () => {
  const dispatch = useDispatch();

  const { list: vehicleModels, loadingList: loadingVehicleModels } =
    useSelector((state: RootState) => state.vehicleModel);

  useEffect(() => {
    dispatch(
      vehicleModelActions.getVehicleModels({
        search: "",
        page: 1,
        perPage: 100,
      })
    );
  }, [dispatch]);

  const modelOptions =
    vehicleModels.map((m) => ({
      label: m.fullName || m.name,
      value: m._id,
    })) || [];

  return {
    vehicleModels,
    loadingVehicleModels,
    modelOptions,
  };
};
