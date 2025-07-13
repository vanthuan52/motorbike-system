import { useNavigate, useParams } from "react-router-dom";
import { Form } from "antd";
import { useEffect } from "react";
import dayjs from "dayjs";
import { ENUM_PAGE_MODE } from "@/types/app.type";
import { ENUM_APPOINTMENTS_STATUS, Appointments } from "../types";
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
      form.setFieldsValue({
        ...Appointments,
        vehicleBrand: Appointments.vehicleBrand?._id,
        vehicleModel: Appointments.vehicleModel?._id,
        serviceCategory: Appointments.serviceCategory?.map((item) => item._id),
        scheduleDate: dayjs(Appointments.scheduleDate),
        status: Appointments.status,
      });
    } else {
      form.resetFields();
    }
  }, [Appointments, isEdit]);

  const {
    serviceCategoryOptions,
    vehicleModelOptions,
    vehicleBrandOptions,
    loadingServiceCategory,
    loadingVehicleModels,
    loadingVehicleBrands,
  } = useAppointmentOptions();

  const handleCancel = () => {
    navigate(-1);
  };

  const handleSubmit = async (values: Appointments) => {
    let status: ENUM_APPOINTMENTS_STATUS;

    switch (values.status) {
      case "pending":
        status = ENUM_APPOINTMENTS_STATUS.PENDING;
        break;
      case "upcoming":
        status = ENUM_APPOINTMENTS_STATUS.UPCOMING;
        break;
      case "done":
        status = ENUM_APPOINTMENTS_STATUS.DONE;
        break;
      default:
        status = ENUM_APPOINTMENTS_STATUS.PENDING;
    }

    const submitValues = {
      ...values,
      status,
      staff: "b4424043-e82e-4e70-9b95-f7712f2301e9", // TODO: get current staff
      serviceCategory: Array.isArray(values.serviceCategory)
        ? values.serviceCategory
        : [values.serviceCategory],
    };

    if (isCreate) {
      dispatch(
        AppointmentsActions.createAppointment({
          Appointments: submitValues,
        })
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
          vehicleBrandOptions={vehicleBrandOptions}
          vehicleModelOptions={vehicleModelOptions}
          serviceCategoryOptions={serviceCategoryOptions}
          loadingServiceCategory={loadingServiceCategory}
          loadingVehicleModels={loadingVehicleModels}
          loadingVehicleBrands={loadingVehicleBrands}
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
