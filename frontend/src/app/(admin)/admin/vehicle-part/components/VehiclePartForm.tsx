/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
  message,
  Button,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import { GreenSwitch } from "@/components/ui/Switch";

interface FormValues {
  vehicle_type_id: number | null;
  name: string;
  code: string;
  average_life: number;
  unit_price: number;
  quantity: number;
  status: boolean;
  image?: string;
}

export interface VehiclePart {
  id: number;
  vehicle_type_id: number | null;
  name: string;
  code: string;
  average_life: number;
  unit_price: number;
  quantity: number;
  status: boolean;
  image?: string;
}

interface Props {
  visible: boolean;
  mode: "create" | "edit";
  initialData?: VehiclePart | null;
  onCancel: () => void;
  onSubmit: (values: VehiclePart) => void;
}

const vehicleTypeOptions = [
  { label: "Kawasaki", value: 0 },
  { label: "Yamaha", value: 1 },
  { label: "Honda", value: 2 },
  { label: "Suzuki", value: 3 },
  { label: "SYM", value: 4 },
  { label: "Ducati", value: 5 },
];

export default function VehiclePartModal({
  visible,
  mode,
  initialData,
  onCancel,
  onSubmit,
}: Props) {
  const [form] = Form.useForm<FormValues>();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    if (visible) {
      if (mode === "edit" && initialData) {
        form.setFieldsValue({
          vehicle_type_id: initialData.vehicle_type_id,
          name: initialData.name,
          code: initialData.code,
          average_life: initialData.average_life,
          unit_price: initialData.unit_price,
          quantity: initialData.quantity,
          status: initialData.status,
        });

        if (initialData.image) {
          setFileList([
            {
              uid: "-1",
              name: "image.jpg",
              status: "done",
              url: initialData.image,
            },
          ]);
        } else {
          setFileList([]);
        }
      } else {
        form.resetFields();
        form.setFieldsValue({ status: true });
        setFileList([]);
      }
    }
  }, [visible, form, initialData, mode]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      const imageUrl =
        fileList.length > 0
          ? fileList[0].url || fileList[0].response?.url
          : undefined;

      const part: VehiclePart = {
        id: initialData?.id ?? 0,
        vehicle_type_id: values.vehicle_type_id,
        name: values.name,
        code: values.code,
        average_life: values.average_life,
        unit_price: values.unit_price,
        quantity: values.quantity,
        status: values.status,
        image: imageUrl,
      };

      onSubmit(part);
    } catch {
      message.error("Vui lòng kiểm tra lại thông tin.");
    }
  };
  return (
    <Modal
      title={mode === "edit" ? "Chỉnh sửa phụ tùng" : "Thêm phụ tùng mới"}
      open={visible}
      onCancel={onCancel}
      onOk={handleOk}
      destroyOnClose
      centered
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="vehicle_type_id"
          label="Loại xe"
          rules={[{ required: true, message: "Chọn loại xe" }]}
        >
          <Select placeholder="Chọn loại xe">
            {vehicleTypeOptions.map((opt) => (
              <Select.Option key={opt.value} value={opt.value}>
                {opt.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="name"
          label="Tên phụ tùng"
          rules={[{ required: true, message: "Nhập tên phụ tùng" }]}
        >
          <Input placeholder="Nhập tên" />
        </Form.Item>
        <Form.Item
          name="code"
          label="Mã phụ tùng"
          rules={[{ required: true, message: "Nhập mã phụ tùng" }]}
        >
          <Input placeholder="Nhập mã" />
        </Form.Item>
        <Form.Item
          name="average_life"
          label="Tuổi thọ trung bình (km)"
          rules={[{ required: true, message: "Nhập tuổi thọ" }]}
        >
          <InputNumber min={0} style={{ width: "100%" }} placeholder="10000" />
        </Form.Item>
        <Form.Item
          name="unit_price"
          label="Đơn giá (VNĐ)"
          rules={[{ required: true, message: "Nhập đơn giá" }]}
        >
          <InputNumber min={0} style={{ width: "100%" }} placeholder="500000" />
        </Form.Item>
        <Form.Item
          name="quantity"
          label="Số lượng tồn kho"
          rules={[{ required: true, message: "Nhập số lượng" }]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          name="image"
          label="Hình ảnh"
          valuePropName="fileList"
          getValueFromEvent={(e) => {
            if (Array.isArray(e)) return e;
            return e?.fileList || [];
          }}
        >
          <Upload
            name="logo"
            listType="picture-card"
            maxCount={1}
            beforeUpload={() => false}
          >
            <Button icon={<UploadOutlined />}></Button>
          </Upload>
        </Form.Item>
        <Form.Item name="status" label="Trạng thái" valuePropName="checked">
          <GreenSwitch checked />
        </Form.Item>
      </Form>
    </Modal>
  );
}
