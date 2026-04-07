import { Card, Typography } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";
const { Text } = Typography;

export default function PickupMapSection() {
  return (
    <Card className="mb-4 bg-surface-alt border border-border">
      <div className="flex items-center gap-2 mb-2">
        <EnvironmentOutlined className="text-xl text-warning" />
        <Text className="text-black font-semibold">
          Địa chỉ cửa hàng: 123 Đường Lớn, Quận 1, TP.HCM
        </Text>
      </div>
      <div className="w-full h-48 bg-secondary-100 rounded-[var(--radius-lg)] flex items-center justify-center">
        <span className="text-text-muted">
          [Bản đồ cửa hàng sẽ hiển thị ở đây]
        </span>
      </div>
    </Card>
  );
}
