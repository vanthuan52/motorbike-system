import { Table, Button, Space } from "antd";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdDelete, MdEdit } from "react-icons/md";

const recentOrders = Array(7).fill({
  customer: "Jenny Wilson",
  date: "28 - 03 - 2025",
  staff: "Nguyễn Văn A",
  status: "Completed",
});

const columns = [
  {
    title: "Khách hàng",
    dataIndex: "customer",
    key: "customer",
    align: "left" as const,
    render: (text: string) => <span className="font-medium">{text}</span>,
  },
  {
    title: "Ngày bảo dưỡng",
    dataIndex: "date",
    key: "date",
    align: "center" as const,
  },
  {
    title: "Nhân viên phụ trách",
    dataIndex: "staff",
    key: "staff",
    align: "center" as const,
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    key: "status",
    align: "center" as const,
  },
  {
    title: "Hành động",
    key: "action",
    align: "center" as const,
    render: () => (
      <Space>
        <Button type="text" icon={<MdEdit size={20} color="#F97316" />} />
        <Button type="text" icon={<MdDelete size={20} color="red" />} />
      </Space>
    ),
  },
];

export default function RecentOrders() {
  return (
    <div className="h-full rounded-lg border border-[#E8E8E8] bg-white p-4">
      <div className="flex items-center justify-between py-4">
        <h3 className="font-semibold text-lg">Top danh mục</h3>
        <Button type="text" icon={<BsThreeDotsVertical />} />
      </div>
      <Table
        columns={columns}
        dataSource={recentOrders.map((o, idx) => ({ ...o, key: idx }))}
        pagination={false}
        size="middle"
        bordered={false}
      />
    </div>
  );
}
