import { useState } from "react";
import { useDispatch } from "react-redux";
import { servicePriceActions } from "../store/service-price-slice";
import { RootState, useAppSelector } from "@/store";

export function useModelServicePriceModal() {
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);
  const [id, setId] = useState<string | null>(null);

  const { listHistory, loadingList } = useAppSelector(
    (state: RootState) => state.servicePrice
  );

  const openCreate = () => {
    setId(null);
    setIsOpen(true);
  };

  const openEdit = (vehicleServiceId: string, vehicleModelId: string) => {
    setIsOpen(true);
    dispatch(
      servicePriceActions.getServicePricesHistory({
        vehicleServiceId,
        vehicleModelId,
      })
    );
  };

  const close = () => {
    setIsOpen(false);
    setId(null);
    dispatch(servicePriceActions.resetServicePricesHistory());
  };

  return {
    isOpen,
    openCreate,
    openEdit,
    close,
    id,
    listHistory,
    loading: loadingList,
  };
}
