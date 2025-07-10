import { useEffect, useState } from "react";
import { Form } from "antd";
import { RootState, useAppDispatch, useAppSelector } from "@/store";
import { maintenanceScheduleActions } from "@/features/maintenance-schedule/store/maintenance-schedule-slice";
import { MaintenanceSchedule } from "@/features/maintenance-schedule/types";

export const useBookingForm = () => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const [serviceType, setServiceType] = useState<"store" | "pickup">("store");
  const { create } = useAppSelector(
    (state: RootState) => state.maintenanceSchedule
  );
  const handleTabChange = (key: string) => {
    setServiceType(key as "store" | "pickup");
  };

  const handleFinish = (values: MaintenanceSchedule) => {
    dispatch(
      maintenanceScheduleActions.createMaintenanceSchedule({
        maintenanceSchedule: values,
      })
    );
  };

  useEffect(() => {
    if (create.success) {
      form.resetFields();
    }
  }, [create.success, form]);

  return {
    form,
    serviceType,
    handleTabChange,
    handleFinish,
    submitLoading: create.loading,
  };
};
