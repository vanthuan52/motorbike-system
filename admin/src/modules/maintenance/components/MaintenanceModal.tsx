/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  message,
  InputNumber,
} from "antd";
import  { useEffect } from "react";
import moment from "moment";
import type { Moment } from "moment";
import { MaintenanceManagementTypes } from "@/types/maintenance";

interface FormValues {
  customer: string;
  phone: string;
  maintenance_date: Moment;
  time_slot: string;
  staffId: number;
  status: string;
  total_cost: number | null;
}

interface Props {
  visible: boolean;
  mode: "create" | "edit";
  initialData?: MaintenanceManagementTypes | null;
  onCancel: () => void;
  onSubmit: (values: MaintenanceManagementTypes) => void;
}
const staffList = [
  { id: 1, name: "Nguyen Van A" },
  { id: 2, name: "Tran Thi B" },
];

export default function MaintenanceModal({
  visible,
  mode,
  initialData,
  onCancel,
  onSubmit,
}: Props) {
  const [form] = Form.useForm<FormValues>();

  useEffect(() => {
    if (visible) {
      if (mode === "edit" && initialData) {
        form.setFieldsValue({
          customer: (initialData.customer as any) ?? "",
          phone: String(initialData.phone),
          maintenance_date: moment(initialData.maintenance_date),
          time_slot: (initialData as any).time_slot ?? "",
          staffId: (initialData.staff as any)?.id ?? undefined,
          total_cost: Number(initialData.total_cost) ?? null,
          status: initialData.status,
        });
      } else {
        form.resetFields();
      }
    }
  }, [visible, form, initialData, mode]);

  const handleOk = async () => {
    try {
      const vals = await form.validateFields();

      const staff = staffList.find((s) => s.id === vals.staffId) ?? null;
      const maintenance: MaintenanceManagementTypes = {
        id: initialData?.id ?? Date.now().toString(),
        customer: vals.customer,
        phone: Number(vals.phone),
        maintenance_date: vals.maintenance_date.format("YYYY-MM-DD"),
        total_cost: initialData?.total_cost ?? null,
        staff: staff ? { id: staff.id, name: staff.name } : null,
        status: vals.status,
      };
      onSubmit(maintenance);
    } catch (err) {
      message.error("Vui lòng kiểm tra lại thông tin.");
    }
  };

  return (
    <Modal
      title={
        mode === "edit" ? "Chỉnh sửa lịch bảo dưỡng" : "Tạo lịch bảo dưỡng"
      }
      open={visible}
      onCancel={onCancel}
      onOk={handleOk}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="customer"
          label="Khách hàng"
          rules={[{ required: true, message: "Nhập tên khách hàng" }]}
        >
          <Input placeholder="Nhập tên khách hàng" />
        </Form.Item>
        <Form.Item
          name="phone"
          label="Số điện thoại"
          rules={[{ required: true, message: "Nhập số điện thoại" }]}
        >
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>
        <Form.Item
          name="maintenance_date"
          label="Ngày bảo dưỡng"
          rules={[{ required: true, message: "Chọn ngày bảo dưỡng" }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          name="total_cost"
          label="Tổng chi phí"
          rules={[{ required: true, message: "Nhập tổng chi phí" }]}
        >
          <InputNumber placeholder="Nhập tổng chi phí" className="!w-full" />
        </Form.Item>
        <Form.Item
          name="staffId"
          label="Nhân viên"
          rules={[{ required: true, message: "Chọn nhân viên" }]}
        >
          <Select placeholder="Chọn nhân viên">
            {staffList.map((s) => (
              <Select.Option key={s.id} value={s.id}>
                {s.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="status" label="Trạng thái">
          <Select placeholder="Chọn trạng thái">
            <Select.Option value="Đang chờ">Đang chờ</Select.Option>
            <Select.Option value="Hoàn thành">Hoàn thành</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}
