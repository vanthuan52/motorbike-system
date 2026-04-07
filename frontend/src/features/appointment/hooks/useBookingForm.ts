"use client";

import { useEffect, useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import dayjs from "dayjs";

import { RootState, useAppDispatch, useAppSelector } from "@/store";
import { appointmentActions } from "@/features/appointment/store/appointment-slice";
import {
  bookingFormSchema,
  BookingFormValues,
} from "@/features/appointment/validations/booking.schema";

export const useBookingForm = () => {
  const dispatch = useAppDispatch();
  const [serviceType, setServiceType] = useState<"store" | "pickup">("store");
  const { create } = useAppSelector((state: RootState) => state.appointment);

  const form: UseFormReturn<BookingFormValues> = useForm<BookingFormValues>({
    resolver: yupResolver(bookingFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      vehicleBrand: "",
      vehicleModel: "",
      licensePlate: "",
      vehicleServices: [],
      date: "",
      time: "",
      address: "",
      note: "",
    },
  });

  const handleTabChange = (key: string) => {
    setServiceType(key as "store" | "pickup");
  };

  const handleFinish = (values: BookingFormValues) => {
    const { date, time, ...rest } = values;

    const appointmentDate = dayjs(date)
      .hour(parseInt(time.split(":")[0]))
      .minute(parseInt(time.split(":")[1]))
      .second(0)
      .toDate();

    dispatch(
      appointmentActions.createAppointment({
        appointment: {
          ...rest,
          appointmentDate,
        } as any,
      })
    );
  };

  useEffect(() => {
    if (create.success) {
      form.reset();
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
