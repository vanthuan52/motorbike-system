// VehicleTypes.tsx
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ColumnsType } from "antd/es/table";
import { Button, Popconfirm, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { mockDataTableVehicleType } from "../mocks/vehicle-type";
import { VehicleType } from "../types";
import { GreenSwitch } from "@/components/ui/switch";
import { PageHeading } from "@/components/page-heading";
import { SearchInput } from "@/components/ui/search-input";
import Table from "@/components/ui/table/table";
import VehicleTypeModal from "../components/vehicle-type-modal";
import { mockDataTableVehicleCompany } from "@/modules/vehicle-company/mocks/vehicle-company";
import SkeletonTable from "@/components/ui/SkeletonTable";

export default function VehicleTypes() {
  const [dataSource, setDataSource] = useState<VehicleType[]>([]);
  const [isEdit, setIsEdit] = useState(false);
  const [assignVisible, setAssignVisible] = useState(false);
  const [selected, setSelected] = useState<VehicleType | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDataSource(mockDataTableVehicleType);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const openCreate = () => {
    setIsEdit(false);
    setSelected(undefined);
    setAssignVisible(true);
  };

  const openEdit = (record: VehicleType) => {
    setIsEdit(true);
    setSelected(record);
    setAssignVisible(true);
  };

  const handleAssignSubmit = (values: VehicleType) => {
    if (isEdit && selected) {
      setDataSource((prev) =>
        prev.map((item) => (item.id === selected.id ? values : item))
      );
      toast.success("Cập nhật loại xe thành công");
    } else {
      const newId = (() => {
        const ids = dataSource
          .map((item) => Number(item.id.replace("vt-", "")))
          .filter((num) => !isNaN(num));
        const max = ids.length ? Math.max(...ids) : 0;
        return `vt-${max + 1}`;
      })();
      setDataSource((prev) => [...prev, { ...values, id: newId }]);
      toast.success("Tạo loại xe mới thành công");
    }
    setAssignVisible(false);
  };

  const handleDelete = (id: string) => {
    setDataSource((prev) => prev.filter((item) => item.id !== id));
    toast.success("Xóa loại xe thành công");
  };

  const columns: ColumnsType<VehicleType> = [
    {
      title: "STT",
      dataIndex: "id",
      key: "id",
      render: (_, __, index) => index + 1,
    },
    {
      title: "MÃ HÃNG XE",
      dataIndex: "company_id",
      key: "company_id",
      render: (company_id: string) => {
        const company = mockDataTableVehicleCompany.find(
          (item) => String(item.id) === String(company_id)
        );
        return company ? company.name : "N/A";
      },
    },
    {
      title: "TÊN LOẠI XE",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "MÔ TẢ",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "TRẠNG THÁI",
      dataIndex: "status",
      key: "status",
      render: (status: boolean, record: VehicleType) => (
        <GreenSwitch
          checked={status}
          onChange={() => {
            setDataSource((prev: VehicleType[]) =>
              prev.map((item: VehicleType) =>
                item.id === record.id ? { ...item, status: !item.status } : item
              )
            );
          }}
        />
      ),
    },
    {
      title: "HÀNH ĐỘNG",
      key: "action",
      render: (_, record) => (
        <div className="flex gap-1 justify-center">
          <Tooltip title="Sửa">
            <Button
              icon={<EditOutlined />}
              size="small"
              onClick={() => openEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Xác nhận xóa?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Tooltip title="Xóa">
              <Button icon={<DeleteOutlined />} danger size="small" />
            </Tooltip>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="sm:px-4 pt-8 sm:pt-0">
      <div style={{ marginBottom: 16 }}>
        <PageHeading
          title="Loại xe"
          onClick={openCreate}
          addButtonLabel="Thêm loại xe"
        />
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="mb-4 px-5 pt-4">
          <SearchInput
            onChange={(text) =>
              setDataSource(
                mockDataTableVehicleType.filter((item) =>
                  item.name.toLowerCase().includes(text.toLowerCase())
                )
              )
            }
          />
        </div>

        {loading ? (
          <SkeletonTable
            columns={[
              { title: "STT", width: 100, height: 50 },
              { title: "MÃ HÃNG XE", width: 100, height: 50 },
              { title: "TÊN LOẠI XE", width: 100, height: 50 },
              { title: "MÔ TẢ", width: 100, height: 50 },
              { title: "TRẠNG THÁI", width: 100, height: 50 },
              { title: "HÀNH ĐỘNG", width: 100, height: 50 },
            ]}
            rows={5}
          />
        ) : (
          <Table
            dataSource={dataSource}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 5 }}
          />
        )}

        <VehicleTypeModal
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
