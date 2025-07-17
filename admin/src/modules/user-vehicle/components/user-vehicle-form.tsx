import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form } from "antd";
import { UserVehicle } from "../types";
import { ENUM_PAGE_MODE } from "@/types/app.type";
import { useAppDispatch } from "@/store";
import { UserVehicleActions } from "../store/user-vehicle-slice";
import BasicInfoSection from "./basic-info-section";
import OtherInfoSection from "./other-info-section";
import Button from "@/components/ui/button";
import PhotoUploadSection from "./photo-section";
import { useUserVehicleOptions } from "../hooks/use-user-vehicle-option";

type UserVehicleFormProps = {
  mode: ENUM_PAGE_MODE;
  initialValues?: UserVehicle | null;
};
const UserVehicleForm = ({
  mode,
  initialValues: userVehicle,
}: UserVehicleFormProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);

  const isEdit = mode === ENUM_PAGE_MODE.EDIT;
  const isCreate = mode === ENUM_PAGE_MODE.CREATE;

  const {
    vehicleModelOptions,
    customerOptions,
    loadingVehicleModel,
    loadingCustomer,
  } = useUserVehicleOptions();

  useEffect(() => {
    if (isCreate) {
      form.resetFields();
      setFileList([]);
    }
  }, [mode, id, form]);
  useEffect(() => {
    if (userVehicle && isEdit) {
      form.setFieldsValue({
        ...userVehicle,
        vehicleModel: userVehicle.vehicleModel._id,
      });
      if (userVehicle.photo) {
        setFileList([
          {
            uid: "-1",
            name: "user-vehicle-photo.png",
            status: "done",
            url: userVehicle.photo,
          } as any,
        ]);
      } else {
        setFileList([]);
      }
    }
  }, [userVehicle, form, mode]);

  const handleCancel = () => {
    navigate(-1);
  };

  const handleSubmit = async (values: UserVehicle) => {
    const submitValues = {
      ...values,
      photo:
        fileList.length > 0
          ? fileList[0].originFileObj || fileList[0].url || undefined
          : undefined,
    };
    if (isCreate) {
      dispatch(
        UserVehicleActions.createUserVehicle({
          userVehicle: submitValues,
        })
      );
    } else if (isEdit && id) {
      dispatch(
        UserVehicleActions.updateUserVehicle({
          userVehicleId: id,
          UserVehicle: submitValues,
        })
      );
    }
  };
  const handleDelete = () => {
    if (isEdit && id) {
      dispatch(UserVehicleActions.deleteUserVehicle({ userVehicleId: id }));
    }
  };
  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <BasicInfoSection
            mode={mode}
            vehicleModelOptions={vehicleModelOptions}
            loadingVehicleModel={loadingVehicleModel}
            customerOptions={customerOptions}
            loadingCustomer={loadingCustomer}
          />
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

export default UserVehicleForm;
