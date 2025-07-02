import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form } from "antd";
import { ENUM_VEHICLE_BRAND_STATUS, VehicleBrand } from "../types";
import { ENUM_PAGE_MODE } from "@/types/app.type";
import { useAppDispatch } from "@/store";
import { vehicleBrandActions } from "../store/vehicle-brand-slice";
import BasicInfoSection from "./basic-info-section";
import OtherInfoSection from "./other-info-section";
import Button from "@/components/ui/button";
import PhotoUploadSection from "./photo-section";
import StatusSection from "./status-section";

type VehicleBrandFormProps = {
  mode: ENUM_PAGE_MODE;
  initialValues?: VehicleBrand | null;
};
const VehicleBrandForm = ({
  mode,
  initialValues: vehicleBrand,
}: VehicleBrandFormProps) => {
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
    if (vehicleBrand && isEdit) {
      form.setFieldsValue({
        ...vehicleBrand,
      });
      if (vehicleBrand.photo) {
        setFileList([
          {
            uid: "-1",
            name: "vehicle-brand-photo.png",
            status: "done",
            url: vehicleBrand.photo,
          } as any,
        ]);
      } else {
        setFileList([]);
      }
    }
  }, [vehicleBrand, form, mode]);

  const handleCancel = () => {
    navigate(-1);
  };

  const handleSubmit = async (values: VehicleBrand) => {
    const submitValues = {
      ...values,
      photo:
        fileList.length > 0
          ? fileList[0].originFileObj || fileList[0].url || undefined
          : undefined,
    };
    if (isCreate) {
      dispatch(
        vehicleBrandActions.createVehicleBrand({
          vehicleBrand: submitValues,
        })
      );
    } else if (isEdit && id) {
      dispatch(
        vehicleBrandActions.updateVehicleBrand({
          vehicleBrandId: id,
          vehicleBrand: submitValues,
        })
      );
    }
  };
  const handleDelete = () => {
    if (isEdit && id) {
      dispatch(vehicleBrandActions.deleteVehicleBrand({ vehicleBrandId: id }));
    }
  };
  const handleStatusChange = (newStatus: ENUM_VEHICLE_BRAND_STATUS) => {
    form.setFieldsValue({
      status: newStatus,
    });

    if (isEdit && id) {
      dispatch(
        vehicleBrandActions.updateVehicleBrandStatus({
          vehicleBrandId: id,
          status: newStatus,
        })
      );
    }
  };
  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <BasicInfoSection mode={mode} />
          <OtherInfoSection mode={mode} />
        </div>
        <div className="flex flex-col gap-6">
          <PhotoUploadSection
            mode={mode}
            fileList={fileList}
            onUpload={(file) => {
              setFileList([file]);
              form.setFieldsValue({ photo: file });
            }}
            onRemove={() => {
              setFileList([]);
              form.setFieldsValue({ photo: undefined });
            }}
          />
          <StatusSection mode={mode} onStatusChange={handleStatusChange} />
        </div>
      </div>
      {(isCreate || isEdit) && (
        <div className="flex justify-start gap-4 mt-6">
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
    </Form>
  );
};

export default VehicleBrandForm;
