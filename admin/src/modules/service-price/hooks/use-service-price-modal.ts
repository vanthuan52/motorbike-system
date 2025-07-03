import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import dayjs from "dayjs";
import { servicePriceActions } from "../store/service-price-slice";
import { ENUM_PAGE_MODE } from "@/types/app.type";

export function useServicePriceModal(
  servicePriceDetail: any,
  loadingSingle: boolean
) {
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);
  const [id, setId] = useState<string | null>(null);
  const [initialValues, setInitialValues] = useState<any | null>(null);

  const mode = id ? ENUM_PAGE_MODE.EDIT : ENUM_PAGE_MODE.CREATE;

  const openCreate = () => {
    setId(null);
    setIsOpen(true);
    dispatch(servicePriceActions.resetServicePriceDetail());
  };

  const openEdit = (servicePriceId: string) => {
    setId(servicePriceId);
    setIsOpen(true);
    dispatch(servicePriceActions.getServicePriceDetail({ servicePriceId }));
    setInitialValues(null);
  };

  const close = () => {
    setIsOpen(false);
    setId(null);
    setInitialValues(null);
    dispatch(servicePriceActions.resetServicePriceDetail());
  };

  useEffect(() => {
    if (
      mode === ENUM_PAGE_MODE.EDIT &&
      servicePriceDetail &&
      servicePriceDetail._id === id
    ) {
      setInitialValues({
        ...servicePriceDetail,
        vehicleService: servicePriceDetail.vehicleService?._id,
        vehicleModel: servicePriceDetail.vehicleModel?._id,
        dateStart: servicePriceDetail.dateStart
          ? dayjs(servicePriceDetail.dateStart)
          : null,
        dateEnd: servicePriceDetail.dateEnd
          ? dayjs(servicePriceDetail.dateEnd)
          : null,
      });
    } else if (mode === ENUM_PAGE_MODE.CREATE) {
      setInitialValues(null);
    }
  }, [mode, id, servicePriceDetail]);

  return {
    isOpen,
    openCreate,
    openEdit,
    close,
    id,
    mode,
    initialValues,
    loading: loadingSingle,
  };
}
