import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { serviceChecklistActions } from "../store/service-checklist-slice";
import { ENUM_PAGE_MODE } from "@/types/app.type";
import { ServiceChecklist } from "../types";

export function useServiceChecklistModal(
  serviceChecklistDetail: ServiceChecklist | null,
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
    dispatch(serviceChecklistActions.resetServiceChecklistDetail());
  };

  const openEdit = (serviceChecklistId: string) => {
    setId(serviceChecklistId);
    setIsOpen(true);
    dispatch(
      serviceChecklistActions.getServiceChecklistDetail({ serviceChecklistId })
    );
    setInitialValues(null);
  };

  const close = () => {
    setIsOpen(false);
    setId(null);
    setInitialValues(null);
    dispatch(serviceChecklistActions.resetServiceChecklistDetail());
  };

  useEffect(() => {
    if (
      mode === ENUM_PAGE_MODE.EDIT &&
      serviceChecklistDetail &&
      serviceChecklistDetail._id === id
    ) {
      setInitialValues({
        ...serviceChecklistDetail,
      });
    } else if (mode === ENUM_PAGE_MODE.CREATE) {
      setInitialValues(null);
    }
  }, [mode, id, serviceChecklistDetail]);

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
