import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { vehiclePartActions } from "../store/part-slice";
import dayjs from "dayjs";
import { ENUM_PAGE_MODE } from "@/types/app.type";

export function usePartModal(partDetail: any, loadingSingle: boolean) {
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);
  const [id, setId] = useState<string | null>(null);
  const [initialValues, setInitialValues] = useState<any | null>(null);

  const mode = id ? ENUM_PAGE_MODE.EDIT : ENUM_PAGE_MODE.CREATE;

  const openCreate = () => {
    setId(null);
    setIsOpen(true);
  };

  const openEdit = (partId: string) => {
    setId(partId);
    setIsOpen(true);
    dispatch(vehiclePartActions.getPartDetail({ partId }));
    setInitialValues(null);
  };

  const close = () => {
    setIsOpen(false);
    setId(null);
    setInitialValues(null);
  };

  useEffect(() => {
    if (mode === ENUM_PAGE_MODE.EDIT && partDetail && partDetail._id === id) {
      setInitialValues({
        ...partDetail,
        partType: partDetail.partType?._id,
        vehicleBrand: partDetail.vehicleBrand?._id,
        createdAt: dayjs(partDetail.createdAt),
        updatedAt: dayjs(partDetail.updatedAt),
      });
    } else if (mode === ENUM_PAGE_MODE.CREATE) {
      setInitialValues(null);
    }
  }, [mode, id, partDetail]);

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
