"use client";

import React, { useEffect, useState } from "react";
import { Button, DatePicker, Popconfirm, Select, Tooltip } from "antd";
import { useTranslations } from "next-intl";
import {
  DeleteOutlined,
  SearchOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { toast } from "sonner";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { MaintenanceHistoryCustomer } from "../types/types";
import { maintenanceHistoryCustomers as initialData } from "../mocks/maintenance-history";
import TableReuse from "@/components/ui/Table/Table";
import type { RangePickerProps } from "antd/es/date-picker";
import SkeletonTable from "@/components/ui/SkeletonTable";
import { TRANSLATION_FILES } from "@/lib/i18n";

dayjs.extend(isBetween);

const { RangePicker } = DatePicker;
const { Option } = Select;

const MaintenanceHistory = () => {
  const t = useTranslations(TRANSLATION_FILES.MAINTENANCE_HISTORY);
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
    toast.success(t("toast.deleteSuccess"));
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

  const columns = [
    {
      title: t("table.vehicleName"),
      dataIndex: "vehicle_name",
    },
    {
      title: t("table.licensePlate"),
      dataIndex: "license_plate",
    },
    {
      title: t("table.date"),
      dataIndex: "date",
    },
    {
      title: t("table.timeSlot"),
      dataIndex: "time_slot",
    },
    {
      title: t("table.status"),
      dataIndex: "status",
    },
    {
      title: t("table.totalCost"),
      dataIndex: "total_cost",
      render: (cost: number) => cost.toLocaleString() + " ₫",
    },
    {
      title: t("table.actions"),
      key: "actions",
      align: "center" as const,
      render: (_: any, record: MaintenanceHistoryCustomer) =>
        record.status === t("filter.completed") ? (
          <Popconfirm
            title={t("table.confirmDelete")}
            onConfirm={() => handleDelete(record.id)}
            okText={t("table.delete")}
            cancelText="Hủy"
          >
            <Tooltip title={t("table.delete")}>
              <Button danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        ) : (
          <Tooltip title={t("table.cannotDelete")}>
            <StopOutlined className="text-text-muted text-lg" />
          </Tooltip>
        ),
    },
  ];

  return (
    <div className="py-8">
      <div className="container">
        <h2 className="text-xl font-semibold text-text-primary mb-4">
          {t("title")}
        </h2>

        <div className="flex flex-wrap gap-2 sm:gap-4 mb-4">
          <RangePicker
            format="YYYY-MM-DD"
            onChange={(values) => setDateRange(values)}
            className="w-full sm:w-auto"
            placeholder={[t("filter.from"), t("filter.to")]}
          />
          <Select
            placeholder={t("filter.status")}
            allowClear
            onChange={(value) => setStatusFilter(value)}
            className="w-full sm:w-[150px]"
          >
            <Option value={t("filter.completed")}>
              {t("filter.completed")}
            </Option>
            <Option value={t("filter.incomplete")}>
              {t("filter.incomplete")}
            </Option>
          </Select>
          <Button
            icon={<SearchOutlined />}
            onClick={handleFilter}
            type="primary"
          >
            {t("filter.search")}
          </Button>
        </div>

        <div className="bg-surface rounded-[var(--radius-lg)] p-4 border border-border">
          {loading ? (
            <SkeletonTable
              columns={[
                { title: t("table.vehicleName"), width: 150 },
                { title: t("table.licensePlate"), width: 100 },
                { title: t("table.date"), width: 120 },
                { title: t("table.timeSlot"), width: 120 },
                { title: t("table.status"), width: 120 },
                { title: t("table.totalCost"), width: 120 },
                { title: t("table.actions"), width: 100 },
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
