import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form } from "antd";
import dayjs from "dayjs";
import { useAppDispatch } from "@/store";
import { customerActions } from "../store/customer-slice";
import Button from "@/components/ui/button";
import GeneralInfoSection from "./general-info-section";
import AddressSection from "./address-section";
import AvatarUploadSection from "./avatar-upload-section";
import GenderSection from "./gender-section";
import StatusSection from "./status-section";
import { ENUM_PAGE_MODE } from "@/types/app.type";
import { ENUM_USER_STATUS, User } from "@/modules/user/types";

type CustomerFormProps = {
  mode: ENUM_PAGE_MODE;
  initialValue: User | null;
};

const CustomerForm = ({ mode, initialValue: customer }: CustomerFormProps) => {
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
    if (customer && isEdit) {
      form.setFieldsValue({
        ...customer,
        dob: customer.dob ? dayjs(customer.dob) : undefined,
      });

      if (customer.photo) {
        setFileList([
          {
            uid: "-1",
            name: "customer-photo.png",
            status: "done",
            url: customer.photo,
          } as any,
        ]);
      } else {
        setFileList([]);
      }
    }
  }, [customer, form, mode]);

  const handleCancel = () => {
    navigate(-1);
  };

  const handleSubmit = (values: User) => {
    const submitValues = {
      ...values,
      dob: values.dob ? dayjs(values.dob).toISOString() : undefined,
      photo:
        fileList.length > 0
          ? fileList[0].originFileObj || fileList[0].url || undefined
          : undefined,
    };

    if (isCreate) {
      dispatch(customerActions.createCustomer({ customer: submitValues }));
    } else if (isEdit && id) {
      dispatch(
        customerActions.updateCustomer({
          customerId: id,
          customer: submitValues,
        })
      );
    }
  };

  const handleDelete = () => {
    if (isEdit && id) {
      dispatch(customerActions.deleteCustomer({ customerId: id }));
    }
  };

  const handleStatusChange = (newStatus: ENUM_USER_STATUS) => {
    form.setFieldsValue({ status: newStatus });

    if (isEdit && id) {
      dispatch(
        customerActions.updateCustomerStatus({
          customerId: id,
          status: newStatus,
        })
      );
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit} className="">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <GeneralInfoSection mode={mode} />
          <AddressSection mode={mode} />
        </div>

        <div className="flex flex-col gap-6">
          <AvatarUploadSection
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
          <GenderSection mode={mode} />
          <StatusSection mode={mode} onStatusChange={handleStatusChange} />
        </div>
      </div>
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
    </Form>
  );
};

export default CustomerForm;
