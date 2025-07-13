import { useEffect, useState } from "react";
import { Form } from "antd";
import dayjs from "dayjs";
import { RootState, useAppDispatch, useAppSelector } from "@/store";
import { AppointmentsActions } from "@/features/appointment/store/appointment-slice";
import { FormValuesAppointments } from "@/features/appointment/types";

export const useBookingForm = () => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const [serviceType, setServiceType] = useState<"store" | "pickup">("store");
  const { create } = useAppSelector((state: RootState) => state.appointments);
  const handleTabChange = (key: string) => {
    setServiceType(key as "store" | "pickup");
  };

  const handleFinish = (values: FormValuesAppointments) => {
    const { date, time, ...rest } = values;

    const appointmentDate = dayjs(date)
      .hour(dayjs(time).hour())
      .minute(dayjs(time).minute())
      .second(0)
      .toDate();
    console.log(values);

    dispatch(
      AppointmentsActions.createAppointments({
        appointments: {
          ...rest,
          appointmentDate,
        },
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
