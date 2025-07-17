import { customerActions } from "@/modules/customer-management/store/customer-slice";
import { User } from "@/modules/user/types";
import { vehicleModelActions } from "@/modules/vehicle-model/store/vehicle-model-slice";
import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect, useMemo } from "react";

export function useUserVehicleOptions() {
  const dispatch = useAppDispatch();

  const { list: vehicleModel, loadingList: loadingVehicleModel } =
    useAppSelector((state) => state.vehicleModel);
  const { users: customer, loadingList: loadingCustomer } = useAppSelector(
    (state) => state.customer
  );

  useEffect(() => {
    if (!vehicleModel?.length) {
      dispatch(
        vehicleModelActions.getVehicleModels({ page: 1, perPage: 1000 })
      );
    }
  }, [dispatch]);

  useEffect(() => {
    if (!customer?.length) {
      dispatch(customerActions.getCustomers({ page: 1, perPage: 1000 }));
    }
  }, [dispatch]);

  const vehicleModelOptions = useMemo(
    () =>
      vehicleModel.map((s) => ({
        value: s._id,
        label: s.name,
      })),
    [vehicleModel]
  );

  const customerOptions = useMemo(
    () =>
      customer.map((s: User) => ({
        value: s._id,
        label: s.name,
      })),
    [customer]
  );

  return {
    vehicleModelOptions,
    customerOptions,
    loadingVehicleModel,
    loadingCustomer,
    customer,
  };
}
