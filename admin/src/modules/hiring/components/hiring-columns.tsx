import { ColumnsType } from "antd/es/table";
import { Button, Tooltip, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { Hiring, ENUM_HIRING_STATUS } from "../types";

export function getHiringColumns({
  openEdit,
  handleDeleteHiring,
  onView,
}: {
  openEdit: (record: Hiring) => void;
  handleDeleteHiring: (id: string) => void;
  onView: (id: string) => void;
}): ColumnsType<Hiring> {
  const ENUM_HIRING_STATUS_LABEL: Record<ENUM_HIRING_STATUS, string> = {
    [ENUM_HIRING_STATUS.DRAFT]: "Bản nháp",
    [ENUM_HIRING_STATUS.PUBLISHED]: "Đã đăng",
    [ENUM_HIRING_STATUS.ARCHIVED]: "Lưu trữ",
  };
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
      render: (_: string, record: Hiring) => (
        <span>{ENUM_HIRING_STATUS_LABEL[record.status]}</span>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: Hiring) => (
        <div className="flex items-center justify-center gap-1">
          <Tooltip title="Xem danh sách ứng viên">
            <Button
              icon={<EyeOutlined />}
              size="small"
              onClick={() => onView(record._id)}
            />
          </Tooltip>
          <Tooltip title="Sửa">
            <Button icon={<EditOutlined />} onClick={() => openEdit(record)} />
          </Tooltip>
          <Popconfirm
            title="Xác nhận xóa?"
            onConfirm={() => handleDeleteHiring(record._id)}
          >
            <Tooltip title="Xóa">
              <Button icon={<DeleteOutlined />} danger />
            </Tooltip>
          </Popconfirm>
        </div>
      ),
    },
  ];
}
