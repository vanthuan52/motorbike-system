import { useNavigate, useParams } from "react-router-dom";
import { Form } from "antd";
import { useEffect } from "react";
import dayjs from "dayjs";
import { ENUM_PAGE_MODE } from "@/types/app.type";
import {
  ENUM_APPOINTMENTS_STATUS,
  Appointments,
  FormValuesAppointments,
} from "../types";
import { useAppDispatch } from "@/store";
import { AppointmentsActions } from "../store/appointment-slice";
import Button from "@/components/ui/button";
import BasicInfoSection from "./basic-info-section";
import OtherInfoSection from "./other-info-section";
import { useAppointmentOptions } from "../hooks/appointment-options";

type AppointmentsFormProps = {
  mode: ENUM_PAGE_MODE;
  initialValues?: Appointments | null;
};
export default function AppointmentsForm({
  mode,
  initialValues: Appointments,
}: AppointmentsFormProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [form] = Form.useForm();

  const isEdit = mode === ENUM_PAGE_MODE.EDIT;
  const isCreate = mode === ENUM_PAGE_MODE.CREATE;

  useEffect(() => {
    if (isCreate) {
      form.resetFields();
    }
  }, [mode, id, form]);

  useEffect(() => {
    if (Appointments && isEdit) {
      const appointmentDate = dayjs(Appointments.appointmentDate);

      form.setFieldsValue({
        ...Appointments,
        userVehicle: Appointments.userVehicle?._id,
        vehicleModel: Appointments.vehicleModel?._id,
        vehicleServices: Appointments.vehicleServices?.map((item) => item._id),
        date: appointmentDate.startOf("day"),
        time: appointmentDate,
        status: Appointments.status,
      });
    } else {
      form.resetFields();
    }
  }, [Appointments, isEdit]);

  const {
    serviceCategoryOptions,
    vehicleModelOptions,
    loadingServiceCategory,
    loadingVehicleModels,
  } = useAppointmentOptions();

  const handleCancel = () => {
    navigate(-1);
  };

  const handleSubmit = async (values: FormValuesAppointments) => {
    const { date, time, vehicleServices, status, ...rest } = values;

    const statusMap: Record<
      keyof typeof ENUM_APPOINTMENTS_STATUS,
      ENUM_APPOINTMENTS_STATUS
    > = {
      PENDING: ENUM_APPOINTMENTS_STATUS.PENDING,
      UPCOMING: ENUM_APPOINTMENTS_STATUS.UPCOMING,
      DONE: ENUM_APPOINTMENTS_STATUS.DONE,
    };

    const statusKey = (status ?? "pending") as keyof typeof statusMap;
    const finalStatus = statusMap[statusKey];

    const appointmentDate = dayjs(date)
      .hour(dayjs(time).hour())
      .minute(dayjs(time).minute())
      .second(0)
      .toDate();

    const normalizedVehicleServices = Array.isArray(vehicleServices)
      ? vehicleServices
      : [vehicleServices];

    const submitValues = {
      ...rest,
      status: finalStatus,
      vehicleServices: normalizedVehicleServices,
      appointmentDate,
    };

    if (isCreate) {
      dispatch(
        AppointmentsActions.createAppointment({ Appointments: submitValues })
      );
    } else if (isEdit && id) {
      dispatch(
        AppointmentsActions.updateAppointment({
          appointmentId: id,
          appointment: submitValues,
        })
      );
    }
  };

  const handleDelete = () => {
    if (isEdit && id) {
      dispatch(
        AppointmentsActions.deleteAppointment({
          appointmentId: id,
        })
      );
    }
  };
  const handleStatusChange = (newStatus: ENUM_APPOINTMENTS_STATUS) => {
    form.setFieldsValue({
      status: newStatus,
    });

    if (isEdit && id) {
      dispatch(
        AppointmentsActions.updateAppointmentStatus({
          appointmentId: id,
          status: newStatus,
        })
      );
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <div className="flex flex-col gap-4">
        <BasicInfoSection mode={mode} onStatusChange={handleStatusChange} />
        <OtherInfoSection
          mode={mode}
          vehicleModelOptions={vehicleModelOptions}
          serviceCategoryOptions={serviceCategoryOptions}
          loadingServiceCategory={loadingServiceCategory}
          loadingVehicleModels={loadingVehicleModels}
        />

        {(isCreate || isEdit) && (
          <div className="flex justify-end gap-4 mt-6">
            <Button
              type="submit"
              variant={"primary"}
              className="w-35 !text-white bg-black hover:bg-gray-700"
            >
              {isCreate ? "Tạo mới" : "Lưu thay đổi"}
            </Button>
            {!isCreate && (
              <Button
                className="w-20 !text-white"
                variant={"destructive"}
                type="reset"
                onClick={handleDelete}
              >
                Xóa
              </Button>
            )}

            <Button
              className="w-20 !text-red-600"
              variant={"outline-destructive"}
              type="reset"
              onClick={handleCancel}
            >
              Hủy
            </Button>
          </div>
        )}
      </div>
    </Form>
  );
}
