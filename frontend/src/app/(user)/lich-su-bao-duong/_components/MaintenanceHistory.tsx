"use client";

import React, { useEffect, useState } from "react";
import { Button, DatePicker, Popconfirm, Select, Tooltip } from "antd";
import {
  DeleteOutlined,
  SearchOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { MaintenanceHistoryCustomer } from "../types/types";
import { maintenanceHistoryCustomers as initialData } from "../mocks/maintenance-history";
import TableReuse from "@/components/ui/Table/Table";
import type { ColumnsType } from "antd/es/table";
import type { RangePickerProps } from "antd/es/date-picker";
import SkeletonTable from "@/components/ui/SkeletonTable";

dayjs.extend(isBetween);

const { RangePicker } = DatePicker;
const { Option } = Select;

const MaintenanceHistory = () => {
  const [data, setData] = useState<MaintenanceHistoryCustomer[]>([]);
  const [filteredData, setFilteredData] = useState<
    MaintenanceHistoryCustomer[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined
  );
  const [dateRange, setDateRange] = useState<RangePickerProps["value"]>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setData(initialData);
      setFilteredData(initialData);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleDelete = (id: number) => {
    const updated = data.filter((item) => item.id !== id);
    setData(updated);
    setFilteredData(updated);
    toast.success("Đã xóa lịch sử bảo dưỡng thành công");
  };

  const handleFilter = () => {
    let filtered = [...data];

    if (dateRange && dateRange[0] && dateRange[1]) {
      const start = dateRange[0].startOf("day");
      const end = dateRange[1].endOf("day");

      filtered = filtered.filter((item) =>
        dayjs(item.date, "YYYY-MM-DD").isBetween(start, end, null, "[]")
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    setFilteredData(filtered);
  };

  const columns: ColumnsType<MaintenanceHistoryCustomer> = [
    {
      title: "Tên xe",
      dataIndex: "vehicle_name",
    },
    {
      title: "Biển số",
      dataIndex: "license_plate",
    },
    {
      title: "Ngày",
      dataIndex: "date",
    },
    {
      title: "Khung giờ",
      dataIndex: "time_slot",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
    },
    {
      title: "Tổng chi phí",
      dataIndex: "total_cost",
      render: (cost: number) => cost.toLocaleString() + " ₫",
    },
    {
      title: "Hành động",
      key: "actions",
      align: "center" as const,
      render: (_: any, record: MaintenanceHistoryCustomer) =>
        record.status === "Hoàn thành" ? (
          <Popconfirm
            title="Xác nhận xóa bản ghi này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Tooltip title="Xóa">
              <Button danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        ) : (
          <Tooltip title="Không thể xóa">
            <StopOutlined className="text-gray-400 text-lg" />
          </Tooltip>
        ),
    },
  ];

  return (
    <div className="py-8">
      <div className="container">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Lịch sử bảo dưỡng
        </h2>

        <div className="flex flex-wrap gap-2 sm:gap-4 mb-4">
          <RangePicker
            format="YYYY-MM-DD"
            onChange={(values) => setDateRange(values)}
            className="w-full sm:w-auto"
            placeholder={["Từ ngày", "Đến ngày"]}
          />
          <Select
            placeholder="Trạng thái"
            allowClear
            onChange={(value) => setStatusFilter(value)}
            className="w-full sm:w-[150px]"
          >
            <Option value="Hoàn thành">Hoàn thành</Option>
            <Option value="Chưa hoàn thành">Chưa hoàn thành</Option>
          </Select>
          <Button
            icon={<SearchOutlined />}
            onClick={handleFilter}
            type="primary"
          >
            Tìm kiếm
          </Button>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          {loading ? (
            <SkeletonTable
              columns={[
                { title: "Tên xe", width: 150 },
                { title: "Biển số", width: 100 },
                { title: "Ngày", width: 120 },
                { title: "Khung giờ", width: 120 },
                { title: "Trạng thái", width: 120 },
                { title: "Tổng chi phí", width: 120 },
                { title: "Hành động", width: 100 },
              ]}
              rows={5}
            />
          ) : (
            <div className="overflow-x-auto">
              <TableReuse
                dataSource={filteredData}
                columns={columns}
                rowKey="id"
                pagination={{ pageSize: 5 }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MaintenanceHistory;
