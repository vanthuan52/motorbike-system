import { useEffect } from "react";
import { Form } from "antd";
import { ServiceChecklist } from "../types";
import { ENUM_PAGE_MODE } from "@/types/app.type";
import { useAppDispatch } from "@/store";
import { serviceChecklistActions } from "../store/service-checklist-slice";
import BasicInfoSection from "./basic-info-section";
import OtherInfoSection from "./other-info-section";
import Button from "@/components/ui/button";

type ServiceChecklistFormProps = {
  mode: ENUM_PAGE_MODE;
  initialValues?: ServiceChecklist | null;
  onSuccess: () => void;
};
const ServiceChecklistForm = ({
  mode,
  initialValues,
  onSuccess,
}: ServiceChecklistFormProps) => {
  const dispatch = useAppDispatch();

  const [form] = Form.useForm();

  const isEdit = mode === ENUM_PAGE_MODE.EDIT;
  const isCreate = mode === ENUM_PAGE_MODE.CREATE;

  useEffect(() => {
    form.resetFields();
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [mode, initialValues]);

  const handleCancel = () => {
    onSuccess();
  };

  const handleSubmit = async (values: ServiceChecklist) => {
    const submitValues = {
      ...values,
    };
    if (isCreate) {
      dispatch(
        serviceChecklistActions.createServiceChecklist({
          serviceChecklist: submitValues,
        })
      );
    } else if (isEdit && initialValues?._id) {
      dispatch(
        serviceChecklistActions.updateServiceChecklist({
          serviceChecklistId: initialValues._id,
          serviceChecklist: submitValues,
        })
      );
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <div className="flex flex-col gap-4">
        <BasicInfoSection mode={mode} />
        <OtherInfoSection mode={mode} />

        {(isCreate || isEdit) && (
          <div className="flex justify-end gap-4 mt-6">
            <Button
              type="submit"
              variant={"primary"}
              className="w-35 !text-white bg-black hover:bg-gray-700"
            >
              {isCreate ? "Tạo mới" : "Lưu thay đổi"}
            </Button>

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
};

export default ServiceChecklistForm;
