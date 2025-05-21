import { Modal, Descriptions, Divider } from "antd";
import { Appointment } from "@/types/Appointment";
import VehicleConditionForm from "./VehicleConditionForm";
import ServicePartsSelector from "./ServicePartsSelector";
import { Vehicle } from "@/types/Vehicle";
import { CustomerType } from "@/types/Customers";

interface Props {
  open: boolean;
  onClose: () => void;
  order: Appointment | null;
  vehicle: Vehicle | null;
  customer: CustomerType | null;
  onSaveCondition: (condition: string) => void;
  onSaveServices: (services: string[], parts: string[]) => void;
}

export default function MaintenanceOrderDetailModal({
  open,
  onClose,
  order,
  vehicle,
  customer,
  onSaveCondition,
  onSaveServices,
}: Props) {
  if (!order || !vehicle || !customer) return null;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title="Chi tiết Đơn Bảo dưỡng"
      footer={null}
      width={900}
      centered
    >
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 min-w-[260px]">
          <Descriptions
            title="Thông tin khách hàng"
            bordered
            size="small"
            column={1}
          >
            <Descriptions.Item label="Họ tên">
              {customer.first_name} {customer.last_name}
            </Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">
              {customer.phone}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {customer.email}
            </Descriptions.Item>
          </Descriptions>
          <Divider />
          <Descriptions title="Thông tin xe" bordered size="small" column={1}>
            <Descriptions.Item label="Biển số">
              {vehicle.license_plate}
            </Descriptions.Item>
            <Descriptions.Item label="Model">
              {vehicle.vehicle_model}
            </Descriptions.Item>
            <Descriptions.Item label="Màu">{vehicle.color}</Descriptions.Item>
            <Descriptions.Item label="Số máy">
              {vehicle.engine_number}
            </Descriptions.Item>
            <Descriptions.Item label="Số khung">
              {vehicle.chassis_number}
            </Descriptions.Item>
          </Descriptions>
        </div>
        <div className="flex-1 min-w-[320px]">
          <VehicleConditionForm
            initialValue={order.vehicle_condition || ""}
            onSave={onSaveCondition}
          />
          <Divider />
          <ServicePartsSelector
            initialServices={order.services || []}
            initialParts={order.parts || []}
            onSave={onSaveServices}
          />
        </div>
      </div>
    </Modal>
  );
}
