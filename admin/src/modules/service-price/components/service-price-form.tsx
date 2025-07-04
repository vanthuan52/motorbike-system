import { useEffect } from "react";
import { Form } from "antd";
import { useAppDispatch, useAppSelector } from "@/store";
import { ENUM_PAGE_MODE } from "@/types/app.type";
import { ServicePrice } from "../types";
import { servicePriceActions } from "../store/service-price-slice";
import BasicInfoSection from "./basic-info-section";
import DateSection from "./date-section";
import Button from "@/components/ui/button";
import { useVehicleOptions } from "../hooks/use-service-price-options";

type ServicePriceFormProps = {
  mode: ENUM_PAGE_MODE;
  initialValues?: ServicePrice | null;
  onSuccess: () => void;
};

const ServicePriceForm = ({
  mode,
  initialValues,
  onSuccess,
}: ServicePriceFormProps) => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();

  const isEdit = mode === ENUM_PAGE_MODE.EDIT;
  const isCreate = mode === ENUM_PAGE_MODE.CREATE;

  const { create, update } = useAppSelector((state) => state.servicePrice);

  const {
    vehicleServiceOptions,
    vehicleModelOptions,
    loadingVehicleServices,
    loadingVehicleModels,
  } = useVehicleOptions();

  useEffect(() => {
    form.resetFields();
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [form, initialValues]);

  const handleCancel = () => {
    onSuccess();
  };

  const handleSubmit = (values: ServicePrice) => {
    const payload = {
      ...values,
      price: Number(values.price),
      dateStart: values.dateStart.toString(),
      dateEnd: values.dateEnd ? values.dateEnd.toString() : null,
    };

    if (isCreate) {
      dispatch(
        servicePriceActions.createServicePrice({ servicePrice: payload })
      );
      if (create.success) {
        onSuccess();
      }
    } else if (isEdit && initialValues?._id) {
      dispatch(
        servicePriceActions.updateServicePrice({
          servicePriceId: initialValues._id,
          servicePrice: payload,
        })
      );
      if (update.success) {
        onSuccess();
      }
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <div className="grid grid-cols-1 gap-6">
        <BasicInfoSection
          mode={mode}
          vehicleServiceOptions={vehicleServiceOptions}
          loadingVehicleServiceOptions={loadingVehicleServices}
          vehicleModelOptions={vehicleModelOptions}
          loadingVehicleModelOptions={loadingVehicleModels}
        />
        <DateSection mode={mode} />
      </div>

      {(isCreate || isEdit) && (
        <div className="flex justify-start gap-4 mt-6">
          <Button
            type="submit"
            variant="primary"
            className="w-35 !text-white bg-black hover:bg-gray-700"
            loading={create.loading || update.loading}
          >
            {isCreate ? "Tạo mới" : "Lưu thay đổi"}
          </Button>

          <Button
            className="w-20 !text-red-600"
            variant="outline-destructive"
            type="reset"
            onClick={handleCancel}
          >
            Hủy
          </Button>
        </div>
      )}
    </Form>
  );
};

export default ServicePriceForm;
