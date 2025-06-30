import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import slugify from "slugify";
import { Form } from "antd";
import { ENUM_SERVICE_CATEGORY_STATUS, ServiceCategory } from "../types";
import { ENUM_PAGE_MODE } from "@/types/app.type";
import { useAppDispatch } from "@/store";
import { serviceCategoryActions } from "../store/service-category-slice";
import BasicInfoSection from "./basic-info-section";
import OtherInfoSection from "./other-info-section";
import Button from "@/components/ui/button";

type ServiceCategoryFormProps = {
  mode: ENUM_PAGE_MODE;
  initialValues?: ServiceCategory | null;
};
const ServiceCategoryForm = ({
  mode,
  initialValues: serviceCategory,
}: ServiceCategoryFormProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);

  const isEdit = mode === ENUM_PAGE_MODE.EDIT;
  const isCreate = mode === ENUM_PAGE_MODE.CREATE;

  useEffect(() => {
    if (isCreate) {
      form.resetFields();
      setFileList([]);
    }
  }, [mode, id, form]);

  useEffect(() => {
    if (serviceCategory && isEdit) {
      form.setFieldsValue({
        ...serviceCategory,
        status: serviceCategory.status === ENUM_SERVICE_CATEGORY_STATUS.ACTIVE,
      });
    } else {
      form.resetFields();
      setFileList([]);
    }
  }, [serviceCategory, form, setFileList]);

  const handleCancel = () => {
    navigate(-1);
  };

  const handleValuesChange = (changed: Record<string, unknown>) => {
    if ("name" in changed) {
      //form.setFieldsValue({ slug: slugify(changed.name as string) });
    }
  };

  const handleSubmit = async (values: ServiceCategory) => {
    const submitValues = {
      ...values,
      status: values.status
        ? ENUM_SERVICE_CATEGORY_STATUS.ACTIVE
        : ENUM_SERVICE_CATEGORY_STATUS.INACTIVE,
      photo:
        fileList.length > 0
          ? fileList[0].originFileObj || fileList[0].url || undefined
          : undefined,
    };
    if (isCreate) {
      dispatch(
        serviceCategoryActions.createServiceCategory({
          serviceCategory: submitValues,
        })
      );
    } else if (isEdit && id) {
      dispatch(
        serviceCategoryActions.updateServiceCategory({
          serviceCategoryId: id,
          serviceCategory: submitValues,
        })
      );
    }
  };
  const handleDelete = () => {
    if (isEdit && id) {
      dispatch(
        serviceCategoryActions.deleteServiceCategory({ serviceCategoryId: id })
      );
    }
  };
  const handleStatusChange = (newStatus: ENUM_SERVICE_CATEGORY_STATUS) => {
    form.setFieldsValue({
      status: newStatus === ENUM_SERVICE_CATEGORY_STATUS.ACTIVE,
    });

    if (isEdit && id) {
      dispatch(
        serviceCategoryActions.updateServiceCategoryStatus({
          serviceCategoryId: id,
          status: newStatus,
        })
      );
    }
  };
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      onValuesChange={handleValuesChange}
    >
      <div className="flex flex-col gap-4">
        <BasicInfoSection mode={mode} onStatusChange={handleStatusChange} />
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
};

export default ServiceCategoryForm;
