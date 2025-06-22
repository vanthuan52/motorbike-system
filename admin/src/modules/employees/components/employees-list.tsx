import { useState } from "react";
import { ColumnsType } from "antd/es/table";
import { Space, Tag } from "antd";
import { FiEye } from "react-icons/fi";
import { BiPencil } from "react-icons/bi";
import { mockDataTableManageEmployees } from "../mocks/employees";
import Table from "@/components/ui/table/table";
import { EmployeeType } from "../types";
import SelectField from "@/components/ui/select-field";
import { SearchInput } from "@/components/ui/search-input";

export default function EmployeesList() {
  const [dataSource, setDataSource] = useState<any[]>(
    mockDataTableManageEmployees
  );

  const [payload, setPayload] = useState({
    gender: "",
    status: "",
  });

  const openEdit = (record: any) => {
    // to-do
  };

  const columns: ColumnsType<(typeof mockDataTableManageEmployees)[0]> = [
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
          <a href={`/employees/employee-details/${record.id}`}>
            <FiEye size={24} />
          </a>
          <BiPencil
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
    <div className="bg-white rounded-lg shadow-md">
      <div className="mb-4 px-5 pt-4 flex flex-col sm:flex-row gap-4 sm:max-h-[55px] w-full">
        <SearchInput
          onChange={(text) =>
            setDataSource(
              mockDataTableManageEmployees.filter((item) =>
                item.first_name!.toLowerCase().includes(text.toLowerCase())
              )
            )
          }
        />
        <div className="flex gap-3 w-full">
          <SelectField
            value={payload.gender || ""}
            onChange={(e: any) =>
              setPayload({ ...payload, gender: e.target.value })
            }
            options={["Nam", "Nữ"]}
            values={["MALE", "FEMALE"]}
            optionLabel="Giới tính"
            rootClass="!w-[200px]"
          />
          <SelectField
            value={payload.status}
            onChange={(e: any) =>
              setPayload({ ...payload, status: e.target.value })
            }
            options={["Hoạt động", "Ngưng hoạt động"]}
            values={["ACTIVE", "INACTIVE"]}
            optionLabel="Trạng thái"
            rootClass="!w-[200px]"
          />
        </div>
      </div>

      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
}
