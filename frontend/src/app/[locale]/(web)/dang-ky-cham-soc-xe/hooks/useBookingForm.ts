import { useEffect, useState } from "react";
import { Form } from "antd";
import { RootState, useAppDispatch, useAppSelector } from "@/store";
import { AppointmentsActions } from "@/features/appointment/store/appointment-slice";
import { Appointments } from "@/features/appointment/types";

export const useBookingForm = () => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const [serviceType, setServiceType] = useState<"store" | "pickup">("store");
  const { create } = useAppSelector((state: RootState) => state.appointments);
  const handleTabChange = (key: string) => {
    setServiceType(key as "store" | "pickup");
  };

  const handleFinish = (values: Appointments) => {
    dispatch(
      AppointmentsActions.createAppointments({
        appointments: values,
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
