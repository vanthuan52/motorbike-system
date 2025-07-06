import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { vehicleBrandActions } from "@/modules/vehicle-brand/store/vehicle-brand-slice";
import { partTypeActions } from "@/modules/part-types/store/part-types-slice";

export function useVehiclePartOptions() {
  const dispatch = useAppDispatch();

  const { list: vehicleBrands, loadingList: loadingVehicleBrands } =
    useAppSelector((state) => state.vehicleBrand);
  const { partTypes, loadingList: loadingPartTypes } = useAppSelector(
    (state) => state.partTypes
  );

  useEffect(() => {
    if (!vehicleBrands?.length) {
      dispatch(
        vehicleBrandActions.getVehicleBrands({ page: 1, perPage: 1000 })
      );
    }
  }, [dispatch]);

  useEffect(() => {
    if (!partTypes?.length) {
      dispatch(partTypeActions.getPartType({ page: 1, perPage: 1000 }));
    }
  }, [dispatch]);
  const vehicleBrandOptions = useMemo(
    () =>
      vehicleBrands.map((s) => ({
        value: s._id,
        label: s.name,
      })),
    [vehicleBrands]
  );

  const partTypeOptions = useMemo(
    () =>
      partTypes.map((s) => ({
        value: s._id,
        label: s.name,
      })),
    [partTypes]
  );
  return {
    vehicleBrandOptions,
    loadingVehicleBrands,
    partTypeOptions,
    loadingPartTypes,
  };
}
