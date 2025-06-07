import { useEffect, useState } from "react";
import { ColumnsType } from "antd/es/table";
import { toast } from "react-toastify";
import { Button, Popconfirm, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { mockDataTableVehicleCompany } from "../mocks/vehicle-company";
import { VehicleCompanyTypes } from "../types";
import { GreenSwitch } from "@/components/ui/switch";
import { PageHeading } from "@/components/page-heading";
import { SearchInput } from "@/components/ui/search-input";
import Table from "@/components/ui/table/table";
import VehicleCompanyModal from "../components/vehicle-company-modal";
import SkeletonTable from "@/components/ui/SkeletonTable";

export default function VehicleCompany() {
  const [dataSource, setDataSource] = useState<VehicleCompanyTypes[]>([]);
  const [isEdit, setIsEdit] = useState(false);
  const [assignVisible, setAssignVisible] = useState(false);
  const [selected, setSelected] = useState<VehicleCompanyTypes | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDataSource(mockDataTableVehicleCompany);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);
  const openCreate = () => {
    setIsEdit(false);
    setSelected(undefined);
    setAssignVisible(true);
  };

  const openEdit = (record: VehicleCompanyTypes) => {
    setIsEdit(true);
    setSelected(record);
    setAssignVisible(true);
  };
  const handleAssignSubmit = (values: VehicleCompanyTypes) => {
    if (isEdit && selected) {
      setDataSource((prev) =>
        prev.map((item) => (item.id === selected.id ? values : item))
      );
      toast.success("Cập nhật hãng xe thành công");
    } else {
      const newId = (() => {
        const ids = dataSource
          .map((item) => Number(item.id.replace("vc-", "")))
          .filter((num) => !isNaN(num));
        const max = ids.length ? Math.max(...ids) : 0;
        return `vc-${max + 1}`;
      })();
      setDataSource((prev) => [...prev, { ...values, id: newId }]);
      toast.success("Tạo hãng xe mới thành công");
    }
    setAssignVisible(false);
  };
  const handleDelete = (id: string) => {
    setDataSource((prev) => prev.filter((item) => item.id !== id));
    toast.success("Xóa hãng xe thành công");
  };
  const columns: ColumnsType<(typeof mockDataTableVehicleCompany)[0]> = [
    {
      title: "STT",
      dataIndex: "id",
      key: "id",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Tên hãng xe",
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
      render: (status: boolean, record: VehicleCompanyTypes) => (
        <GreenSwitch
          checked={status}
          onChange={() => {
            setDataSource((prev: VehicleCompanyTypes[]) =>
              prev.map((item: VehicleCompanyTypes) =>
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
        title="Hãng xe"
        onClickAdd={openCreate}
        addButtonLabel="Thêm hãng xe"
      />
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="mb-4">
          <SearchInput
            onChange={(text) =>
              setDataSource(
                mockDataTableVehicleCompany.filter((item) =>
                  item.name.toLowerCase().includes(text.toLowerCase())
                )
              )
            }
          />
        </div>

        {loading ? (
          <SkeletonTable columns={
            [
              { title: "STT", width: 60, height: 20 },
              { title: "Tên hãng xe" },
              { title: "Mô tả" },
              { title: "Trạng thái" },
              { title: "Hành động" },
            ]
          } rows={5} />
        ) : (
          <Table
            dataSource={dataSource}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 5 }}
          />
        )}

        <VehicleCompanyModal
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
