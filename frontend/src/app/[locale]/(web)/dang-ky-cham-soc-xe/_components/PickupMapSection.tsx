import { Card, Typography } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";
const { Text } = Typography;

export default function PickupMapSection() {
  return (
    <Card className="mb-4 bg-gray-100 border border-gray-300">
      <div className="flex items-center gap-2 mb-2">
        <EnvironmentOutlined className="text-xl text-yellow-400" />
        <Text className="text-black font-semibold">
          Địa chỉ cửa hàng: 123 Đường Lớn, Quận 1, TP.HCM
        </Text>
      </div>
      <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
        <span className="text-gray-500">
          [Bản đồ cửa hàng sẽ hiển thị ở đây]
        </span>
      </div>
    </Card>
  );
}
