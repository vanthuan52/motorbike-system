/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { ColumnsType } from "antd/es/table";
import { Skeleton, Space, Tag } from "antd";
import { Eye, Pencil } from "lucide-react";
import {
  mockDataTableManageCustomers,
  mockDataTableManageEmployees,
} from "@/data/TableData";
import { PageHeaderReuse } from "@/components/ui/Admin/PageHeaderReuse";
import { SearchInputReuse } from "@/components/ui/SearchInputReuse";
import TableReuse from "@/components/ui/Table/Table";
import SelectField from "@/components/ui/SelectField";
import { CustomLink } from "@/components/CustomerLink/CustomLink";
import { toast } from "react-toastify";
import { EmployeeType } from "@/types/Employees";
import EmployeesModal from "./EmployeesModal";

export default function Employees() {
  const [dataSource, setDataSource] = useState<any[]>(
    mockDataTableManageEmployees
  );
  const [isEdit, setIsEdit] = useState(false);
  const [assignVisible, setAssignVisible] = useState(false);
  const [selected, setSelected] = useState<EmployeeType | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [payload, setPayload] = useState({
    gender: "",
    status: "",
  });
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);
  const openCreate = () => {
    setIsEdit(false);
    setSelected(undefined);
    setAssignVisible(true);
  };

  const openEdit = (record: any) => {
    setIsEdit(true);
    setSelected(record);
    setAssignVisible(true);
  };
  const handleAssignSubmit = (values: any) => {
    if (isEdit && selected) {
      setDataSource((prev) =>
        prev.map((item) => (item.id === selected.id ? values : item))
      );
      toast.success("Cập nhật nhân viên thành công");
    } else {
      const newId = Math.max(...dataSource.map((d) => d.id), 0) + 1;
      setDataSource((prev) => [...prev, { ...values, id: newId }]);
      toast.success("Tạo nhân viên mới thành công");
    }
    setAssignVisible(false);
  };
  const columns: ColumnsType<(typeof mockDataTableManageCustomers)[0]> = [
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
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: (_: any, record: any) => (
        <span className="capitalize">{record.role.toLocaleLowerCase()}</span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: EmployeeType["status"]) => (
        <span>
          {status === "ACTIVE" && <Tag color="green">Còn hoạt động</Tag>}
          {status === "INACTIVE" && (
            <Tag color="yellow">Không còn hoạt động</Tag>
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
      render: (_, record: any) => (
        <Space>
          <CustomLink
            href={`/admin/employees/employee-details?id=${record.id}`}
          >
            <Eye size={24} />
          </CustomLink>
          <Pencil
            color="#FFD43B"
            size={24}
            className="cursor-pointer"
            onClick={() => openEdit(record)}
          />
        </Space>
      ),
    },
  ];
  return (
    <div className="sm:px-4">
      <PageHeaderReuse
        title="Danh sách nhân viên"
        addButtonLabel="Thêm nhân viên"
        onClickAdd={openCreate}
      />
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="mb-4 flex flex-col sm:flex-row gap-4 sm:max-h-[40px] w-full">
          <SearchInputReuse
            onChange={(text) =>
              setDataSource(
                mockDataTableManageEmployees.filter((item) =>
                  item.first_name.toLowerCase().includes(text.toLowerCase())
                )
              )
            }
          />
          <div className="flex gap-3 w-full">
            <SelectField
              value={payload.gender || ""}
              onChange={(e) =>
                setPayload({ ...payload, gender: e.target.value })
              }
              options={["Nam", "Nữ"]}
              values={["MALE", "FEMALE"]}
              optionLabel="Giới tính"
              rootClass="!w-[200px]"
            />
            <SelectField
              value={payload.status}
              onChange={(e) =>
                setPayload({ ...payload, status: e.target.value })
              }
              options={["Hoạt động", "Ngưng hoạt động"]}
              values={["ACTIVE", "INACTIVE"]}
              optionLabel="Trạng thái"
              rootClass="!w-[200px]"
            />
          </div>
        </div>

        {loading ? (
          <div className="space-y-4 w-full">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="flex gap-4">
                <Skeleton.Input active style={{ width: 185, height: 32 }} />
                <Skeleton.Input active style={{ width: 185, height: 32 }} />
                <Skeleton.Input active style={{ width: 185, height: 32 }} />
                <Skeleton.Input active style={{ width: 185, height: 32 }} />
                <Skeleton.Input active style={{ width: 185, height: 32 }} />
                <Skeleton.Input active style={{ width: 185, height: 32 }} />
                <Skeleton.Input active style={{ width: 185, height: 32 }} />
                <Skeleton.Input active style={{ width: 185, height: 32 }} />
              </div>
            ))}
          </div>
        ) : (
          <TableReuse
            dataSource={dataSource}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 5 }}
          />
        )}
        <EmployeesModal
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
