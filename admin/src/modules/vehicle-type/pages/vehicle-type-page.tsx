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
  const columns: ColumnsType<(typeof mockDataTableVehicleType)[0]> = [
    {
      title: "STT",
      dataIndex: "id",
      key: "id",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Mã hãng xe",
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
      title: "Tên loại xe",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Trạng thái",
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
      <PageHeading
        title="Loại xe"
        onClickAdd={openCreate}
        addButtonLabel="Thêm loại xe"
      />
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="mb-4">
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
              { title: "Mã hãng xe", width: 100, height: 50 },
              { title: "Tên loại xe", width: 100, height: 50 },
              { title: "Mô tả", width: 100, height: 50 },
              { title: "Trạng thái", width: 100, height: 50 },
              { title: "Hành động", width: 100, height: 50 },
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
