import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form } from "antd";
import dayjs from "dayjs";
import { RootState, useAppDispatch, useAppSelector } from "@/store";
import { customerActions } from "../store/customer-slice";
import Button from "@/components/ui/button";
import GeneralInfoSection from "./general-info-section";
import AddressSection from "./address-section";
import AvatarUploadSection from "./avatar-upload-section";
import GenderSection from "./gender-section";
import StatusSection from "./status-section";
import { ENUM_PAGE_MODE } from "@/types/app.type";
import { notificationActions } from "@/modules/notification/store/notification-slice";
import { ENUM_USER_STATUS, User } from "@/modules/user/types";

type CustomerFormProps = {
  mode: ENUM_PAGE_MODE;
};

const CustomerForm = ({ mode }: CustomerFormProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);

  const {
    loading,
    user: customer,
    error,
  } = useAppSelector((state: RootState) => state.customer);

  const isFormFilledRef = useRef(false);

  useEffect(() => {
    if (
      customer &&
      (mode === ENUM_PAGE_MODE.EDIT || mode === ENUM_PAGE_MODE.VIEW) &&
      !isFormFilledRef.current
    ) {
      form.setFieldsValue({
        ...customer,
        dob: customer.dob ? dayjs(customer.dob) : undefined,
      });

      if (customer.photo) {
        setFileList([customer.photo]);
      } else {
        setFileList([]);
      }
      isFormFilledRef.current = true;
    }
  }, [customer, form, mode]);

  useEffect(() => {
    if (mode === ENUM_PAGE_MODE.CREATE) {
      form.resetFields();
      setFileList([]);
      isFormFilledRef.current = false;
    }
  }, [mode, id, form]);

  useEffect(() => {
    if (error) {
      notificationActions.notify({
        type: "error",
        message: "Lỗi",
      });
    }
  }, [error]);

  const handleCancel = () => {
    navigate(-1);
  };

  const handleSubmit = (values: User) => {
    const submitValues = {
      ...values,
      dob: values.dob ? dayjs(values.dob).toISOString() : undefined,
      photo: fileList.length > 0 ? fileList[0] : undefined,
    };
    if (mode === ENUM_PAGE_MODE.CREATE) {
      dispatch(customerActions.createCustomer({ customer: submitValues }));
    } else if (mode === ENUM_PAGE_MODE.EDIT && id) {
      dispatch(
        customerActions.updateCustomer({
          customerId: id,
          customer: submitValues,
        })
      );
    }
  };

  const handleDelete = () => {
    if (mode === ENUM_PAGE_MODE.EDIT && id) {
      dispatch(customerActions.deleteCustomer({ customerId: id }));
    }
  };

  const handleStatusChange = (newStatus: ENUM_USER_STATUS) => {
    form.setFieldsValue({ status: newStatus });

    if (mode === ENUM_PAGE_MODE.EDIT && id) {
      dispatch(
        customerActions.updateCustomerStatus({
          customerId: id,
          status: newStatus,
        })
      );

      dispatch(
        customerActions.updateCustomerDetail({ status: newStatus } as User)
      );
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit} className="">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <GeneralInfoSection mode={mode} />
          <AddressSection mode={mode} />
        </div>

        {/* Right */}
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
      {(mode === ENUM_PAGE_MODE.CREATE || mode === ENUM_PAGE_MODE.EDIT) && (
        <div className="flex justify-start gap-4 mt-4">
          <Button
            type="submit"
            variant={"primary"}
            className="w-35 !text-white bg-black hover:bg-gray-700"
            loading={loading}
          >
            {mode === ENUM_PAGE_MODE.CREATE ? "Tạo mới" : "Lưu thay đổi"}
          </Button>
          {mode !== ENUM_PAGE_MODE.CREATE && (
            <Button
              className="w-20 !text-white"
              variant={"destructive"}
              type="reset"
              disabled={loading}
              onClick={handleDelete}
            >
              Xóa
            </Button>
          )}

          <Button
            className="w-20 !text-red-600"
            variant={"outline-destructive"}
            type="reset"
            disabled={loading}
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
