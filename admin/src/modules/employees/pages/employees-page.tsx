"use client";

import { useEffect, useState } from "react";
import { ColumnsType } from "antd/es/table";
import { Button, Space, Tag } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { mockDataTableManageEmployees } from "../mocks/employees";
import Table from "@/components/ui/table/table";
import { EmployeeType } from "../types";
import SelectField from "@/components/ui/select-field";
import { SearchInput } from "@/components/ui/search-input";
import SkeletonTable from "@/components/ui/SkeletonTable";
import { PageHeading } from "@/components/page-heading";
import { Link } from "react-router-dom";

export default function EmployeesPage() {
  const [dataSource, setDataSource] = useState(mockDataTableManageEmployees);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [payload, setPayload] = useState({
    gender: "Tất cả",
    status: "Tất cả",
  });

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      setDataSource(mockDataTableManageEmployees);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    let filtered = [...mockDataTableManageEmployees];

    if (searchText) {
      filtered = filtered.filter((item) =>
        (item.first_name ?? "").toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (payload.gender !== "Tất cả") {
      filtered = filtered.filter(
        (item) => item.gender === (payload.gender === "Nam" ? "MALE" : "FEMALE")
      );
    }

    if (payload.status !== "Tất cả") {
      filtered = filtered.filter(
        (item) =>
          item.status ===
          (payload.status === "Hoạt động" ? "ACTIVE" : "INACTIVE")
      );
    }

    setDataSource(filtered);
  }, [searchText, payload.gender, payload.status]);

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
          <Link to={`/employees/employee-details/${record.id}`}>
            <Button icon={<EyeOutlined />} />
          </Link>
        </Space>
      ),
    },
  ];

  return (
    <div className="sm:px-4 pt-8 sm:pt-0">
      <div className="flex flex-col gap-5">
        <div style={{ marginBottom: 16 }}>
          <PageHeading title="Danh sách nhân viên" />
        </div>
        <div className="bg-white rounded-lg shadow-md">
          <div className="mb-4 px-5 pt-4 flex flex-col sm:flex-row gap-4 sm:max-h-[55px] w-full">
            <SearchInput onChange={setSearchText} />
            <div className="flex gap-3 w-full">
              <SelectField
                value={payload.gender}
                onChange={(e: any) =>
                  setPayload({ ...payload, gender: e.target.value })
                }
                options={["Tất cả", "Nam", "Nữ"]}
                optionLabel="Giới tính"
                rootClass="!w-[200px]"
              />
              <SelectField
                value={payload.status}
                onChange={(e: any) =>
                  setPayload({ ...payload, status: e.target.value })
                }
                options={["Tất cả", "Hoạt động", "Ngưng hoạt động"]}
                optionLabel="Trạng thái"
                rootClass="!w-[200px]"
              />
            </div>
          </div>

          {loading ? (
            <SkeletonTable
              columns={[
                { title: "STT", width: 100, height: 50 },
                { title: "HỌ TÊN", width: 150, height: 50 },
                { title: "SỐ ĐIỆN THOẠI", width: 150, height: 50 },
                { title: "EMAIL", width: 150, height: 50 },
                { title: "VAI TRÒ", width: 100, height: 50 },
                { title: "TRẠNG THÁI", width: 130, height: 50 },
                { title: "ĐỊA CHỈ", width: 200, height: 50 },
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
        </div>
      </div>
    </div>
  );
}
