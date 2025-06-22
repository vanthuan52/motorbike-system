import moment from "moment";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { Button, message, Popconfirm, Tooltip } from "antd";

import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

import TableReuse from "@/components/ui/table/table";
import { SearchInputReuse } from "@/components/ui/SearchInputReuse";
import { PageHeading } from "@/components/page-heading";

import { mockScheduleList, ScheduleType } from "../data/mockSchedule";

import ScheduleAssignModal from "./ScheduleAssignModal";
import ScheduleDetailModal from "./ScheduleDetailModal";
import SkeletonTable from "@/components/ui/SkeletonTable";

export default function ScheduleList() {
  const [dataSource, setDataSource] = useState<ScheduleType[]>([]);
  const [loading, setLoading] = useState(true);
  const [assignVisible, setAssignVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [selected, setSelected] = useState<ScheduleType | null>(null);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDataSource(mockScheduleList);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const openCreate = () => {
    setIsEdit(false);
    setSelected(null);
    setAssignVisible(true);
  };

  const openEdit = (record: ScheduleType) => {
    setIsEdit(true);
    setSelected(record);
    setAssignVisible(true);
  };

  const openDetail = (record: ScheduleType) => {
    setSelected(record);
    setDetailVisible(true);
  };

  const handleDelete = (id: number) => {
    setDataSource((prev) => prev.filter((item) => item.id !== id));
    message.success("Xóa lịch bảo dưỡng thành công");
  };

  const handleAssignSubmit = (values: ScheduleType) => {
    if (isEdit && selected) {
      setDataSource((prev) =>
        prev.map((item) => (item.id === selected.id ? values : item))
      );
      message.success("Cập nhật lịch bảo dưỡng thành công");
    } else {
      const newId = Math.max(...dataSource.map((d) => d.id), 0) + 1;
      setDataSource((prev) => [...prev, { ...values, id: newId }]);
      message.success("Tạo lịch bảo dưỡng mới thành công");
    }
    setAssignVisible(false);
  };

  const columns: ColumnsType<ScheduleType> = [
    { title: "ID", dataIndex: "id", key: "id", render: (_, __, i) => i + 1 },
    { title: "Khách hàng", dataIndex: "customer", key: "customer" },
    { title: "SĐT", dataIndex: "phone", key: "phone" },
    { title: "Nhân viên", dataIndex: ["staff", "name"], key: "staff" },
    {
      title: "Ngày",
      dataIndex: "schedule_date",
      key: "schedule_date",
      render: (d) => moment(d).format("DD-MM-YYYY"),
    },
    { title: "Khung giờ", dataIndex: "time_slot", key: "time_slot" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (s) => (s ? "Hoàn thành" : "Đang chờ"),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <>
          <Tooltip title="Chi tiết" className="mr-1">
            <Button icon={<EyeOutlined />} onClick={() => openDetail(record)} />
          </Tooltip>

          <Tooltip title="Sửa" className="mr-1">
            <Button icon={<EditOutlined />} onClick={() => openEdit(record)} />
          </Tooltip>

          <Popconfirm
            title="Xác nhận xóa?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Tooltip title="Xóa">
              <Button icon={<DeleteOutlined />} danger />
            </Tooltip>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div className="sm:px-4 pt-8 sm:pt-0">
      <div className="lg:my-4 sm:my-2">
        <PageHeading
          title="Quản lý lịch bảo dưỡng"
          onClick={openCreate}
          addButtonLabel="Tạo lịch bảo dưỡng"
        />
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="mb-4 px-5 pt-4">
          <SearchInputReuse
            onChange={(text) =>
              setDataSource(
                mockScheduleList.filter((item) =>
                  item.customer.toLowerCase().includes(text.toLowerCase())
                )
              )
            }
          />
        </div>

        {loading ? (
          <SkeletonTable
            columns={[
              { title: "ID", width: 50 },
              { title: "KHÁCH HÀNG", width: 100 },
              { title: "SĐT", width: 100 },
              { title: "NHÂN VIÊN", width: 100 },
              { title: "NGÀY", width: 100 },
              { title: "KHUNG GIỜ", width: 100 },
              { title: "TRẠNG THÁI", width: 100 },
            ]}
            rows={5}
          />
        ) : (
          <TableReuse
            columns={columns}
            dataSource={dataSource}
            rowKey="id"
            pagination={{ pageSize: 5 }}
          />
        )}
      </div>

      <ScheduleAssignModal
        visible={assignVisible}
        mode={isEdit ? "edit" : "create"}
        initialData={selected}
        onCancel={() => setAssignVisible(false)}
        onSubmit={handleAssignSubmit}
      />

      <ScheduleDetailModal
        visible={detailVisible}
        data={selected}
        onCancel={() => setDetailVisible(false)}
      />
    </div>
  );
}
