import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { vehicleModelActions } from "@/modules/vehicle-model/store/vehicle-model-slice";
import { vehicleBrandActions } from "@/modules/vehicle-brand/store/vehicle-brand-slice";
import { serviceCategoryActions } from "@/modules/service-category/store/service-category-slice";

export function useAppointmentOptions() {
  const dispatch = useAppDispatch();

  const { list: serviceCategory, loadingList: loadingServiceCategory } =
    useAppSelector((state) => state.serviceCategory);
  const { list: vehicleModels, loadingList: loadingVehicleModels } =
    useAppSelector((state) => state.vehicleModel);
  const { list: vehicleBrands, loadingList: loadingVehicleBrands } =
    useAppSelector((state) => state.vehicleBrand);
  useEffect(() => {
    if (!serviceCategory?.length) {
      dispatch(
        serviceCategoryActions.getServiceCategories({ page: 1, perPage: 1000 })
      );
    }
  }, [dispatch]);

  useEffect(() => {
    if (!vehicleModels?.length) {
      dispatch(
        vehicleModelActions.getVehicleModels({ page: 1, perPage: 1000 })
      );
    }
  }, [dispatch]);

  useEffect(() => {
    if (!vehicleBrands?.length) {
      dispatch(
        vehicleBrandActions.getVehicleBrands({ page: 1, perPage: 1000 })
      );
    }
  }, [dispatch]);
  const serviceCategoryOptions = useMemo(
    () =>
      serviceCategory.map((s) => ({
        value: s._id,
        label: s.name,
      })),
    [serviceCategory]
  );

  const vehicleModelOptions = useMemo(
    () =>
      vehicleModels.map((m) => ({
        value: m._id,
        label: m.fullName,
      })),
    [vehicleModels]
  );

  const vehicleBrandOptions = useMemo(
    () =>
      vehicleBrands.map((b) => ({
        value: b._id,
        label: b.name,
      })),
    [vehicleBrands]
  );
  return {
    serviceCategoryOptions,
    loadingServiceCategory,
    vehicleModelOptions,
    loadingVehicleModels,
    vehicleBrandOptions,
    loadingVehicleBrands,
  };
}
