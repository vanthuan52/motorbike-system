import { Card, Typography } from "antd";
const { Title } = Typography;

export default function PickupCostSection() {
  return (
    <Card className="mb-4 bg-gray-100 border border-gray-300">
      <Title level={5} className="text-yellow-500 mb-2">
        Thông tin về chi phí giao nhận xe
      </Title>
      <ul className="text-black text-sm pl-4 list-disc space-y-2">
        <li>Miễn phí giao nhận trong phạm vi bán kính 3km.</li>
        <li>
          Phí giao nhận: <b>30.000đ/km</b> (cho khoảng cách lớn hơn 3km) trong
          giờ làm việc.
        </li>
        <li>
          Phí ngoài giờ: <b>45.000đ/km</b> (sau 19h hoặc ngoài khung giờ làm
          việc).
        </li>
      </ul>
    </Card>
  );
}
