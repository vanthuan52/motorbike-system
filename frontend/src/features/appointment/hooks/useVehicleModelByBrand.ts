import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { vehicleModelActions } from "@/features/vehicle-model/store/vehicle-model-slice";
import {
  ENUM_VEHICLE_MODEL_FUEL_TYPE,
  ENUM_VEHICLE_MODEL_TYPE,
} from "@/features/vehicle-model/types";

export const useVehicleModelByBrand = (
  vehicleBrandId?: string,
  filters?: {
    search?: string;
    engineDisplacement?: number;
    modelYear?: number;
    fuelType?: ENUM_VEHICLE_MODEL_FUEL_TYPE;
    type?: ENUM_VEHICLE_MODEL_TYPE;
  }
) => {
  const dispatch = useDispatch();

  const { list: vehicleModels, loadingList: loadingVehicleModels } =
    useSelector((state: RootState) => state.vehicleModel);

  useEffect(() => {
    if (vehicleBrandId) {
      dispatch(
        vehicleModelActions.getVehicleModels({
          search: filters?.search,
          vehicleBrand: vehicleBrandId,
          page: 1,
          perPage: 100,
          engineDisplacement: filters?.engineDisplacement,
          modelYear: filters?.modelYear,
          fuelType: filters?.fuelType,
          type: filters?.type,
        })
      );
    } else {
      dispatch(vehicleModelActions.resetState());
    }
  }, [vehicleBrandId, dispatch, filters]);

  const vehicleModelOptions =
    vehicleModels.map((m) => ({
      label: m.name,
      value: m._id,
      year: m.modelYear,
      displacement: m.engineDisplacement,
      image: m.photo,
    })) || [];

  return {
    vehicleModels,
    loadingVehicleModels,
    vehicleModelOptions,
  };
};
