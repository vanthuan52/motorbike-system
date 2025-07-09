import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { vehicleBrandActions } from "@/features/vehicle-brand/store/vehicle-brand-slice";
import { vehicleModelActions } from "@/features/vehicle-model/store/vehicle-model-slice";
import { RootState } from "@/store";

export const useVehicleBrandModel = () => {
  const dispatch = useDispatch();
  const [selectedBrand, setSelectedBrand] = useState<string>();

  const { list: vehicleBrands, loadingList: loadingVehicleBrands } =
    useSelector((state: RootState) => state.vehicleBrand);
  const { list: vehicleModels, loadingList: loadingVehicleModels } =
    useSelector((state: RootState) => state.vehicleModel);

  useEffect(() => {
    dispatch(
      vehicleBrandActions.getVehicleBrands({
        search: "",
        page: 1,
        perPage: 100,
      })
    );
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      vehicleModelActions.getVehicleModels({
        search: "",
        page: 1,
        perPage: 100,
        vehicleBrand: selectedBrand,
      })
    );
  }, [dispatch, selectedBrand]);

  const handleBrandChange = (value: string) => {
    setSelectedBrand(value);
  };

  const modelOptions =
    vehicleModels
      .filter((m) => m.vehicleBrand._id === selectedBrand)
      .map((m) => ({
        label: m.fullName || m.name,
        value: m._id,
      })) || [];

  return {
    selectedBrand,
    setSelectedBrand,
    vehicleBrands,
    loadingVehicleBrands,
    vehicleModels,
    loadingVehicleModels,
    handleBrandChange,
    modelOptions,
  };
};
