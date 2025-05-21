import { Vehicle } from '@/types/Vehicle';
import { Descriptions, Image, Modal } from "antd";
import { mockDataTableVehicleType } from '@/data/TableData';

type props = {
  vehicle: Vehicle | null;
  open: boolean;
  onClose: () => void;
}
export default function ViewVehicleModal({
  vehicle,
  open,
  onClose,
}:props) {
  if (!vehicle) return null;
  const vehicleType = mockDataTableVehicleType.find((type) => type.id === vehicle.vehicle_type_id);
  return (
     <Modal open={open} onCancel={onClose} footer={null} width={1200}>
      <div className="flex flex-row gap-6 items-center ">
        <div className="flex flex-col items-center justify-center min-w-[160px]">
          <Image
            src={vehicle.image_file_name ?? undefined}
            alt="Avatar"
            fallback="/images/image-holder-icon.png"
          />
        </div>
        <div className="flex-1 w-full">
          <Descriptions
            title="Thông tin xe"
            size="small"
            column={1}
            styles={{ label: { color: '#333', fontWeight: 500 } }}
          >
            <Descriptions.Item label="Biển số">
              {vehicle.license_plate}
            </Descriptions.Item>
            <Descriptions.Item label="Loại xe">
              {vehicle.vehicle_model}
            </Descriptions.Item>
            <Descriptions.Item label="Màu sắc">
              {vehicle.color}
            </Descriptions.Item>
            <Descriptions.Item label="Số máy">
              {vehicle.engine_number}
            </Descriptions.Item>
            <Descriptions.Item label="Số khung">
              {vehicle.chassis_number}
            </Descriptions.Item>
            <Descriptions.Item label="Loại xe">
              {vehicleType?.name}
            </Descriptions.Item>
          </Descriptions>
        </div>
      </div>
     </Modal>
  )
}
