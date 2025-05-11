import React, { useEffect } from "react";
import { Modal, Form, Input, DatePicker, Select, message } from "antd";
import type { Moment } from "moment";
import type { ScheduleType } from "./data/mockSchedule";
import moment from "moment";

interface FormValues {
  customer: string;
  phone: string;
  schedule_date: Moment;
  time_slot: string;
  staffId: number;
  status: boolean;
}

interface Props {
  visible: boolean;
  mode: "create" | "edit";
  initialData?: ScheduleType | null;
  onCancel: () => void;
  onSubmit: (values: ScheduleType) => void;
}

const timeSlots = [
  "08:00 - 10:00",
  "10:00 - 12:00",
  "13:00 - 15:00",
  "15:00 - 17:00",
];
const staffList = [
  { id: 1, name: "Nguyen Van A" },
  { id: 2, name: "Tran Thi B" },
];

export default function ScheduleAssignModal({
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
          customer: initialData.customer,
          phone: initialData.phone,
          schedule_date: moment(initialData.schedule_date),
          time_slot: initialData.time_slot,
          staffId: initialData.staff?.id ?? 0,
          status: initialData.status,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({ status: false });
      }
    }
  }, [visible, form, initialData, mode]);

  const handleOk = async () => {
    try {
      const vals = await form.validateFields();
      const staff = staffList.find((s) => s.id === vals.staffId) ?? null;
      const schedule: ScheduleType = {
        id: initialData?.id ?? 0,
        customer: vals.customer,
        phone: vals.phone,
        schedule_date: vals.schedule_date.format("YYYY-MM-DD"),
        time_slot: vals.time_slot,
        staff: staff,
        status: vals.status,
      };
      onSubmit(schedule);
    } catch {
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
          <Input placeholder="Nhập tên" />
        </Form.Item>
        <Form.Item
          name="phone"
          label="Số điện thoại"
          rules={[{ required: true, message: "Nhập số điện thoại" }]}
        >
          <Input placeholder="Nhập SĐT" />
        </Form.Item>
        <Form.Item
          name="schedule_date"
          label="Ngày bảo dưỡng"
          rules={[{ required: true, message: "Chọn ngày bảo dưỡng" }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          name="time_slot"
          label="Khung giờ"
          rules={[{ required: true, message: "Chọn khung giờ" }]}
        >
          <Select placeholder="Chọn khung giờ">
            {timeSlots.map((ts) => (
              <Select.Option key={ts} value={ts}>
                {ts}
              </Select.Option>
            ))}
          </Select>
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
        <Form.Item name="status" label="Trạng thái" valuePropName="value">
          <Select>
            <Select.Option value={false}>Đang chờ</Select.Option>
            <Select.Option value={true}>Hoàn thành</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}
