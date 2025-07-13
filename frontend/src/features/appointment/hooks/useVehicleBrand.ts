"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { vehicleBrandActions } from "@/features/vehicle-brand/store/vehicle-brand-slice";

export const useVehicleBrand = () => {
  const dispatch = useDispatch();
  const { list: vehicleBrands, loadingList: loadingVehicleBrands } =
    useSelector((state: RootState) => state.vehicleBrand);

  useEffect(() => {
    dispatch(
      vehicleBrandActions.getVehicleBrands({
        search: "",
        page: 1,
        perPage: 100,
      })
    );
  }, [dispatch]);

  const vehicleBrandOptions =
    vehicleBrands.map((m) => ({
      label: m.name,
      value: m._id,
    })) || [];

  return {
    vehicleBrands,
    loadingVehicleBrands,
    vehicleBrandOptions,
  };
};
