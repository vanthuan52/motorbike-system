import { Card, Button, Tag } from "antd";
import { EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import { VehicleCardProps } from "../types";

export default function VehicleCard({
  id,
  photo,
  name,
  licensePlate,
  color,
  onView,
  onDelete,
}: VehicleCardProps) {
  return (
    <Card
      hoverable
      cover={
        <img
          alt={licensePlate}
          src={photo || "/images/image-holder-icon.png"}
          className="h-40 object-cover"
        />
      }
      className="rounded-xl shadow-md hover:shadow-xl transition-all"
      actions={[
        <Button key="view" icon={<EyeOutlined />} onClick={() => onView(id)}>
          Chi tiết
        </Button>,
        <Button
          key="delete"
          icon={<DeleteOutlined />}
          danger
          onClick={() => onDelete(id)}
        >
          Xoá
        </Button>,
      ]}
    >
      <Card.Meta
        title={<span className="font-semibold">{name}</span>}
        description={
          <div className="text-gray-600 text-sm">
            <p>Biển số: {licensePlate}</p>
            {color && <Tag color="blue">{color}</Tag>}
          </div>
        }
      />
    </Card>
  );
}
