import { useEffect } from "react";
import { Form } from "antd";
import { ENUM_PAGE_MODE } from "@/types/app.type";
import { VehiclePart } from "../types";
import { useAppDispatch, useAppSelector } from "@/store";
import { useVehiclePartOptions } from "../hooks/use-vehicle-part-options";
import { vehiclePartActions } from "../store/part-slice";
import BasicInfoSection from "./basic-info-section";
import Button from "@/components/ui/button";

type VehiclePartFormProps = {
  mode: ENUM_PAGE_MODE;
  initialValues?: VehiclePart | null;
  onSuccess: () => void;
};
export default function VehiclePartForm({
  mode,
  initialValues,
  onSuccess,
}: VehiclePartFormProps) {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();

  const isEdit = mode === ENUM_PAGE_MODE.EDIT;
  const isCreate = mode === ENUM_PAGE_MODE.CREATE;

  const { create, update } = useAppSelector((state) => state.vehicleParts);

  const {
    vehicleBrandOptions,
    loadingVehicleBrands,
    partTypeOptions,
    loadingPartTypes,
  } = useVehiclePartOptions();

  useEffect(() => {
    form.resetFields();
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [form, initialValues]);

  const handleCancel = () => {
    onSuccess();
  };

  const handleSubmit = (values: VehiclePart) => {
    const payload = {
      ...values,
    };
    if (isCreate) {
      dispatch(vehiclePartActions.createPart({ part: payload }));
      if (create.success) {
        onSuccess();
      }
    } else if (isEdit && initialValues?._id) {
      dispatch(
        vehiclePartActions.updatePart({
          partId: initialValues._id,
          part: payload,
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
          partTypeOptions={partTypeOptions}
          vehicleBrandOptions={vehicleBrandOptions}
          loadingPartTypeOptions={loadingPartTypes}
          loadingVehicleBrandOptions={loadingVehicleBrands}
        />
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
}
