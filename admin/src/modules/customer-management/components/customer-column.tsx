import { ColumnsType } from "antd/es/table";
import { Button, Tooltip, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { ENUM_USER_STATUS, User } from "@/modules/user/types";
import CustomerStatusTag from "./customer-status-tag";

interface CustomerColumnProps {
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
}

export const getCustomerColumns = ({
  onEdit,
  onDelete,
  onView,
}: CustomerColumnProps): ColumnsType<User> => [
  {
    title: "STT",
    dataIndex: "id",
    key: "id",
    render: (_, __, index) => index + 1,
  },
  {
    title: "Họ tên",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Số điện thoại",
    dataIndex: "phone",
    key: "phone",
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    key: "status",
    render: (status: ENUM_USER_STATUS) => <CustomerStatusTag status={status} />,
  },
  {
    title: "Địa chỉ",
    dataIndex: "address",
    key: "address",
    responsive: ["lg"],
  },
  {
    title: "Hành động",
    dataIndex: "action",
    key: "action",
    render: (_, record) => (
      <div className="flex items-center justify-center gap-1">
        <Tooltip title="Xem chi tiết">
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => onView(record._id)}
          />
        </Tooltip>
        <Tooltip title="Chỉnh sửa">
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => onEdit(record)}
          />
        </Tooltip>
        <Popconfirm
          title="Bạn chắc chắn muốn xóa khách hàng này?"
          onConfirm={() => onDelete(record._id)}
          okText="Xóa"
          cancelText="Hủy"
        >
          <Tooltip title="Xóa">
            <Button icon={<DeleteOutlined />} size="small" danger />
          </Tooltip>
        </Popconfirm>
      </div>
    ),
  },
];
