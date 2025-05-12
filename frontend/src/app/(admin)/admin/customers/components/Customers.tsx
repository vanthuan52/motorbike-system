"use client";
import React, { useEffect, useState } from "react";
import { ColumnsType } from "antd/es/table";
import { Skeleton, Space, Tag } from "antd";
import { mockDataTableManageCustomers } from "@/data/TableData";
import { PageHeaderReuse } from "@/components/ui/Admin/PageHeaderReuse";
import { SearchInputReuse } from "@/components/ui/SearchInputReuse";
import TableReuse from "@/components/ui/Table/Table";

import SelectField from "@/components/ui/SelectField";
import { CustomLink } from "@/shared/components/CustomerLink/CustomLink";
import { Eye } from "lucide-react";
export default function Customers() {
  const [dataSource, setDataSource] = useState(mockDataTableManageCustomers);
  const [loading, setLoading] = useState(false);
  const [payload, setPayload] = useState({
    gender: "",
  });
  // fake loading
  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

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
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      render: (_, record) => (record.gender === "MALE" ? "Nam" : "Nữ"),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (_, record) => (
        <span>
          {record.status === "ACTIVE" && <Tag color="green">Còn hoạt động</Tag>}
          {record.status === "INACTIVE" && (
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
      render: (_, record) => (
        <Space>
          <CustomLink
            href={`/admin/customers/customer-details?id=${record.id}`}
          >
            <Eye />
          </CustomLink>
        </Space>
      ),
    },
  ];

  return (
    <div className="sm:px-4">
      <PageHeaderReuse title="Danh sách khách hàng" disabledButton />
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="mb-4 flex gap-4 max-h-[40px] w-full">
          <SearchInputReuse
            onChange={(text) =>
              setDataSource(
                mockDataTableManageCustomers.filter((item) =>
                  item.first_name.toLowerCase().includes(text.toLowerCase())
                )
              )
            }
          />
          <SelectField
            value={payload.gender}
            onChange={(event) => {
              const value = event.target.value;
              setDataSource(
                value === "Tất cả"
                  ? mockDataTableManageCustomers
                  : mockDataTableManageCustomers.filter(
                      (item) =>
                        item.gender === (value === "Nam" ? "MALE" : "FEMALE")
                    )
              );
              setPayload({ ...payload, gender: value });
            }}
            options={["Tất cả", "Nam", "Nữ"]}
            optionLabel="Giới tính"
            rootClass="!w-[200px]"
          />
        </div>

        {loading ? (
          <div className="space-y-4 w-full">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="flex gap-4">
                <Skeleton.Input active style={{ width: 300, height: 32 }} />
                <Skeleton.Input active style={{ width: 300, height: 32 }} />
                <Skeleton.Input active style={{ width: 300, height: 32 }} />
                <Skeleton.Input active style={{ width: 300, height: 32 }} />
                <Skeleton.Input active style={{ width: 300, height: 32 }} />
                <Skeleton.Input active style={{ width: 300, height: 32 }} />
                <Skeleton.Input active style={{ width: 300, height: 32 }} />
                <Skeleton.Input active style={{ width: 300, height: 32 }} />
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
      </div>
    </div>
  );
}
