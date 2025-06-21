import { Link } from "react-router-dom";
import { ColumnsType } from "antd/es/table";
import { Button, Tag, Tooltip, Popconfirm } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { ROUTER_PATH } from "@/constants/router-path";
import { mockDataTableManageCustomers } from "@/modules/customer-management/mocks/customer-data";
import { ENUM_USER_STATUS, User } from "@/modules/user/types";

export const columns = (
  openEdit: (user: User) => void,
  handleDelete: (id: string) => void
): ColumnsType<(typeof mockDataTableManageCustomers)[0]> => [
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
    render: (_, record) => (
      <span>
        {record.status === ENUM_USER_STATUS.ACTIVE && (
          <Tag color="green">Còn hoạt động</Tag>
        )}
        {record.status === ENUM_USER_STATUS.INACTIVE && (
          <Tag color="yellow">Không còn hoạt động</Tag>
        )}
        {record.status === ENUM_USER_STATUS.BLOCKED && (
          <Tag color="red">Blocked</Tag>
        )}
      </span>
    ),
  },
  {
    title: "Địa chỉ",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "Hành động",
    dataIndex: "action",
    key: "action",
    render: (_, record) => (
      <div className="flex items-center justify-center gap-1">
        <Tooltip title="Xem chi tiết">
          <Link
            to={`${ROUTER_PATH.CUSTOMERS_DETAIL.replace(":id", record._id)}`}
          >
            <Button icon={<EyeOutlined />} size="small" />
          </Link>
        </Tooltip>
        <Tooltip title="Chỉnh sửa">
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => openEdit(record)}
          />
        </Tooltip>
        <Popconfirm
          title="Bạn chắc chắn muốn xóa khách hàng này?"
          onConfirm={() => handleDelete(record._id)}
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
