"use client";

import { useEffect, useState } from "react";
import { ColumnsType } from "antd/es/table";
import { Button, Space, Tag } from "antd";
import { Link } from "react-router-dom";
import { SearchInput } from "@/components/ui/search-input";
import Table from "@/components/ui/table/table";
import { mockDataTableVehiclePart } from "@/modules/vehicle-parts/mocks/vehicle-part-data";
import { EyeOutlined } from "@ant-design/icons";
import { ROUTER_PATH } from "@/constants/router-path";

export default function VehiclePartsPage() {
  const [dataSource, setDataSource] = useState(mockDataTableVehiclePart);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setDataSource(mockDataTableVehiclePart);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const columns: ColumnsType<typeof mockDataTableVehiclePart[0]> = [
    {
      title: "STT",
      key: "index",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Mã hãng xe",
      dataIndex: "vehicle_type_id",
      key: "vehicle_type_id",
    },
    {
      title: "Tên phụ tùng",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: boolean) => (
        <Tag color={status ? "green" : "red"}>
          {status ? "Hoạt động" : "Không hoạt động"}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space>
          <Link to={`${ROUTER_PATH.VEHICLE_PART}/view/${record.id}`}>
            <Button icon={<EyeOutlined />} />
          </Link>
        </Space>
      ),
    },
  ];

  return (
    <div className="sm:px-4">
      {/* <PageHeading title="Danh sách phụ tùng" onClickAdd={() => {}} disabledButton={false}>
        <Link to={`${ROUTER_PATH.PARTS}/create`}>Thêm phụ tùng</Link>
      </PageHeading> */}

      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="mb-4">
          <SearchInput onChange={(text) => {
            setDataSource(
              mockDataTableVehiclePart.filter(item =>
                item.name.toLowerCase().includes(text.toLowerCase())
              )
            );
          }} />
        </div>

        <Table
          dataSource={dataSource}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          loading={loading}
        />
      </div>
    </div>
  );
}