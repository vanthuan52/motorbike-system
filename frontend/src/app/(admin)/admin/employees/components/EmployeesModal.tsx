/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Form, Modal } from "antd";
import { EmployeeType } from "@/types/Employees";
import { useEffect } from "react";

import EmployeesForm from "./EmployeesForm";

interface EmployeesFormProps {
  initialData?: EmployeeType;
  onCancel: () => void;
  onSubmit: (values: EmployeeType) => void;
  mode: string;
  visible: boolean;
}

export default function EmployeesModal({
  initialData,
  onCancel,
  onSubmit,
  mode,
  visible,
}: EmployeesFormProps) {
  const [form] = Form.useForm<EmployeeType>();
  useEffect(() => {
    if (visible) {
      if (mode === "edit" && initialData) {
        const fields: any = { ...initialData };
        fields.photo =
          initialData.photo && typeof initialData.photo === "string"
            ? [
                {
                  uid: "-1",
                  name: "avatar.png",
                  status: "done",
                  url: initialData.photo,
                },
              ]
            : Array.isArray(initialData.photo)
            ? initialData.photo
            : [];
        form.setFieldsValue(fields);
      }
    } else {
      form.resetFields();
    }
  }, [visible, form, initialData, mode]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const submitValues = {
        ...values,
        photo:
          Array.isArray(values.photo) && values.photo.length > 0
            ? values.photo[0].originFileObj ||
              values.photo[0].url ||
              values.photo[0].thumbUrl ||
              null
            : null,
      };
      onSubmit(submitValues);
    } catch (errorInfo) {
      console.log("Failed:", errorInfo);
    }
  };
  return (
    <Modal
      title={mode === "edit" ? "Chỉnh sửa nhân viên" : "Thêm nhân viên"}
      open={visible}
      onCancel={onCancel}
      onOk={handleOk}
      destroyOnClose
      width={1200}
      centered
    >
      <EmployeesForm form={form} />
    </Modal>
  );
}
