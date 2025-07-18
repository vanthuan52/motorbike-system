import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { vehicleModelActions } from "@/modules/vehicle-model/store/vehicle-model-slice";
import { CareRecordChecklistActions } from "@/modules/care-record-checklist/store/care-record-checklist-slice";

export function useCareRecordOptions(careRecordId?: string) {
  const dispatch = useAppDispatch();

  const { list: vehicleModels, loadingList: loadingVehicleModels } =
    useAppSelector((state) => state.vehicleModel);
  const {
    list: careRecordChecklists,
    loadingList: loadingCareRecordChecklists,
  } = useAppSelector((state) => state.careRecordChecklists);
  useEffect(() => {
    if (!vehicleModels?.length) {
      dispatch(
        vehicleModelActions.getVehicleModels({ page: 1, perPage: 1000 })
      );
    }
  }, [dispatch]);

  useEffect(() => {
    if (careRecordId) {
      dispatch(
        CareRecordChecklistActions.getCareRecordChecklists({
          page: 1,
          perPage: 1000,
          careRecord: careRecordId,
        })
      );
    }
  }, [dispatch, careRecordId]);

  const vehicleModelOptions = useMemo(
    () =>
      vehicleModels.map((m) => ({
        value: m._id,
        label: m.fullName,
      })),
    [vehicleModels]
  );

  const vehicleModelMap = useMemo(() => {
    const map: Record<string, string> = {};
    vehicleModelOptions.forEach((item) => {
      map[item.value] = item.label;
    });
    return map;
  }, [vehicleModelOptions]);
  return {
    vehicleModelOptions,
    loadingVehicleModels,
    vehicleModelMap,
    careRecordChecklists,
    loadingCareRecordChecklists,
  };
}
