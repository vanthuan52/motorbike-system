import { ColumnsType } from "antd/es/table";
import { Button, Select, Tooltip, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Hiring, HiringStatusEnum } from "../types";
import { STATUS_HIRING_OPTIONS } from "../constants/status";

export function getHiringColumns({
  openEdit,
  handleDelete,
  handleChangeStatus,
  updateStatusLoading,
}: {
  openEdit: (record: Hiring) => void;
  handleDelete: (id: string) => void;
  handleChangeStatus: (newStatus: HiringStatusEnum, record: Hiring) => void;
  updateStatusLoading: boolean;
}): ColumnsType<Hiring> {
  return [
    {
      title: "ID",
      dataIndex: "index",
      key: "index",
      render: (_: any, __: Hiring, index: number) => <span>{index + 1}</span>,
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      render: (value: string) => <span className="line-clamp-2">{value}</span>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (value: string, record: Hiring) => (
        <Select
          placeholder="Chọn trạng thái"
          value={value}
          style={{ width: 120 }}
          onChange={(newStatus) =>
            handleChangeStatus(newStatus as HiringStatusEnum, record)
          }
          options={STATUS_HIRING_OPTIONS}
          loading={updateStatusLoading}
        />
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: Hiring) => (
        <>
          <Tooltip title="Sửa" className="mr-1">
            <Button icon={<EditOutlined />} onClick={() => openEdit(record)} />
          </Tooltip>
          <Popconfirm
            title="Xác nhận xóa?"
            onConfirm={() => handleDelete(record._id)}
          >
            <Tooltip title="Xóa">
              <Button icon={<DeleteOutlined />} danger />
            </Tooltip>
          </Popconfirm>
        </>
      ),
    },
  ];
}
