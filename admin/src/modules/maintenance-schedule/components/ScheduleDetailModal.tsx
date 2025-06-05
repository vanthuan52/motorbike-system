import moment from "moment";
import { Modal, Descriptions } from "antd";

import type { ScheduleType } from "../data/mockSchedule";

interface Props {
  visible: boolean;
  data?: ScheduleType | null;
  onCancel: () => void;
}

export default function ScheduleDetailModal({
  visible,
  data,
  onCancel,
}: Props) {
  return (
    <Modal
      title="Chi tiết lịch bảo dưỡng"
      open={visible}
      footer={null}
      onCancel={onCancel}
    >
      <Descriptions column={1} bordered>
        <Descriptions.Item label="Khách hàng">
          {data?.customer}
        </Descriptions.Item>
        <Descriptions.Item label="SĐT">{data?.phone}</Descriptions.Item>
        <Descriptions.Item label="Nhân viên">
          {data?.staff?.name || "Chưa gán"}
        </Descriptions.Item>
        <Descriptions.Item label="Ngày">
          {data ? moment(data.schedule_date).format("DD-MM-YYYY") : ""}
        </Descriptions.Item>
        <Descriptions.Item label="Khung giờ">
          {data?.time_slot}
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          {data?.status ? "Hoàn thành" : "Đang chờ"}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
}
