import { ColumnsType } from "antd/es/table";
import { Button, Tag, Tooltip, Popconfirm } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { ROUTER_PATH } from "@/constants/router-path";
import { mockDataTableManageCustomers } from "@/modules/customer-management/mocks/customer-data";

export const columns = (
  openEdit: (record: (typeof mockDataTableManageCustomers)[0]) => void,
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
    render: (_, record) => `${record.first_name} ${record.last_name}`,
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
    title: "Giới tính",
    dataIndex: "gender",
    key: "gender",
    render: (_, record) => (record.gender === "MALE" ? "Nam" : "Nữ"),
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    key: "status",
    render: (_, record) => (
      <span>
        {record.status === "ACTIVE" && <Tag color='green'>Còn hoạt động</Tag>}
        {record.status === "INACTIVE" && (
          <Tag color='yellow'>Không còn hoạt động</Tag>
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
      <div className='flex items-center justify-center gap-1'>
        <Tooltip title='Xem chi tiết'>
          <Link to={`${ROUTER_PATH.CUSTOMERS}/${record.id}`}>
            <Button icon={<EyeOutlined />} size='small' />
          </Link>
        </Tooltip>
        <Tooltip title='Chỉnh sửa'>
          <Button
            icon={<EditOutlined />}
            size='small'
            onClick={() => openEdit(record)}
          />
        </Tooltip>
        <Popconfirm
          title='Bạn chắc chắn muốn xóa khách hàng này?'
          onConfirm={() => handleDelete(record.id)}
          okText='Xóa'
          cancelText='Hủy'
        >
          <Tooltip title='Xóa'>
            <Button icon={<DeleteOutlined />} size='small' danger />
          </Tooltip>
        </Popconfirm>
      </div>
    ),
  },
];
