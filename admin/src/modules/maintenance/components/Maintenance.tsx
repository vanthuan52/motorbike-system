import moment from "moment";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { ColumnsType } from "antd/es/table";
import { Button, Popconfirm, Tooltip } from "antd";

import { formatVND } from "@/helpers/formatVND";
import TableReuse from "@/components/ui/table/table";
import { MaintenanceManagementTypes } from "@/types/maintenance";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { SearchInputReuse } from "@/components/ui/SearchInputReuse";
import { PageHeading } from "@/components/page-heading";

import { mockDataTableMaintenance } from "../data/mockMaintenance";

import MaintenanceModal from "./MaintenanceModal";
import SkeletonTable from "@/components/ui/SkeletonTable";

export default function Maintenance() {
  const [dataSource, setDataSource] = useState<MaintenanceManagementTypes[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [assignVisible, setAssignVisible] = useState(false);
  const [selected, setSelected] = useState<MaintenanceManagementTypes | null>(
    null
  );
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDataSource(
        mockDataTableMaintenance.map(
          (item) =>
            ({
              ...item,
              id: String(item.id),
              phone: item.phone,
            }) as MaintenanceManagementTypes
        )
      );
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const openCreate = () => {
    setIsEdit(false);
    setSelected(null);
    setAssignVisible(true);
  };

  const openEdit = (record: MaintenanceManagementTypes) => {
    setIsEdit(true);
    setSelected(record);
    setAssignVisible(true);
  };

  const handleDelete = (id: string) => {
    setDataSource((prev) => prev.filter((item) => item.id !== id));
    toast.success("Xóa đơn bảo dưỡng thành công");
  };

  const handleAssignSubmit = (values: any) => {
    if (isEdit && selected) {
      setDataSource((prev) =>
        prev.map((item) => (item.id === selected.id ? values : item))
      );
      toast.success("Cập nhật đơn bảo dưỡng thành công");
    } else {
      const newId = Math.max(...dataSource.map((d) => Number(d.id)), 0) + 1;
      setDataSource((prev) => [...prev, { ...values, id: newId }]);
      toast.success("Tạo đơn bảo dưỡng mới thành công");
    }
    setAssignVisible(false);
  };

  const columns: ColumnsType<MaintenanceManagementTypes> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Khách hàng",
      dataIndex: "customer",
      key: "customer",
      render: (customer: string) => customer,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Nhân viên",
      dataIndex: "staff",
      key: "staff",
      render: (staff: any) => staff?.name,
    },
    {
      title: "Ngày bảo dưỡng",
      dataIndex: "maintenance_date",
      key: "maintenance_date",
      render: (maintenance_date: string) =>
        moment(maintenance_date).format("DD-MM-YYYY"),
    },
    {
      title: "Tổng chi phí",
      dataIndex: "total_cost",
      key: "total_cost",
      render: (total_cost: number) => `${formatVND(total_cost)}`,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (s) => s,
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <>
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
          title="Quản lý đơn bảo dưỡng"
          onClick={openCreate}
          addButtonLabel="Tạo đơn bảo dưỡng"
        />
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="mb-4 px-5 pt-4">
          <SearchInputReuse
            onChange={(text) =>
              setDataSource(
                mockDataTableMaintenance
                  .filter((item) =>
                    item.customer?.toLowerCase().includes(text.toLowerCase())
                  )
                  .map((item) => ({
                    ...item,
                    id: String(item.id),
                    phone: item.phone,
                  }))
              )
            }
          />
        </div>

        {loading ? (
          <SkeletonTable
            columns={[
              { title: "ID", width: 50 },
              { title: "KHÁCH HÀNG", width: 100 },
              { title: "SỐ ĐIỆN THOẠI", width: 100 },
              { title: "NHÂN VIÊN", width: 100 },
              { title: "NGÀY BẢO DƯỠNG", width: 100 },
              { title: "TỔNG CHI PHÍ", width: 100 },
              { title: "TRẠNG THÁI", width: 100 },
              { title: "HÀNH ĐỘNG", width: 100 },
            ]}
            rows={5}
          />
        ) : (
          <TableReuse
            dataSource={dataSource}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 5 }}
          />
        )}

        <MaintenanceModal
          visible={assignVisible}
          mode={isEdit ? "edit" : "create"}
          initialData={selected}
          onCancel={() => setAssignVisible(false)}
          onSubmit={handleAssignSubmit}
        />
      </div>
    </div>
  );
}
