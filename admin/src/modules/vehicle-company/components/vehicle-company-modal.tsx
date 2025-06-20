import { useEffect } from "react";
import { Modal, Form, Input, Select, message } from "antd";
import { VehicleCompanyTypes } from "../types";
import { useDispatch } from "react-redux";
import { vehicleCompanyActions } from "../store/vehicleCompany-slice";

interface FormValues {
  name: string;
  description: string;
  status: boolean;
}

interface Props {
  visible: boolean;
  mode: "create" | "edit";
  initialData?: VehicleCompanyTypes | null;
  onCancel: () => void;
}

export default function VehicleCompanyModal({
  visible,
  mode,
  initialData,
  onCancel,
}: Props) {
  const dispatch = useDispatch();
  const [form] = Form.useForm<FormValues>();

  useEffect(() => {
    if (visible) {
      if (mode === "edit" && initialData) {
        form.setFieldsValue({
          name: initialData.name,
          description: initialData.description,
          status: initialData.status,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({ status: true });
      }
    }
  }, [visible, form, initialData, mode]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      if (mode === "create") {
        dispatch(
          vehicleCompanyActions.createCompanyRequest({
            name: values.name,
            description: values.description,
            status: values.status,
          })
        );
      } else if (mode === "edit" && initialData?.id) {
        dispatch(
          vehicleCompanyActions.updateCompanyRequest({
            id: initialData.id,
            data: {
              name: values.name,
              description: values.description,
              status: values.status,
            },
          })
        );
      }

      onCancel(); // Đóng modal sau khi dispatch
    } catch {
      message.error("Vui lòng kiểm tra lại thông tin.");
    }
  };

  return (
    <Modal
      title={mode === "edit" ? "Chỉnh sửa hãng xe" : "Thêm hãng xe mới"}
      open={visible}
      onCancel={onCancel}
      onOk={handleOk}
      destroyOnClose
      centered
      okText={mode === "edit" ? "Lưu" : "Thêm"}
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Tên hãng xe"
          rules={[{ required: true, message: "Nhập tên hãng xe" }]}
        >
          <Input placeholder="Nhập tên hãng xe" />
        </Form.Item>
        <Form.Item name="description" label="Mô tả">
          <Input.TextArea placeholder="Nhập mô tả" rows={3} />
        </Form.Item>
        <Form.Item
          name="status"
          label="Trạng thái"
          rules={[{ required: true, message: "Chọn trạng thái" }]}
        >
          <Select>
            <Select.Option value={true}>Đang hoạt động</Select.Option>
            <Select.Option value={false}>Ngừng hoạt động</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}
