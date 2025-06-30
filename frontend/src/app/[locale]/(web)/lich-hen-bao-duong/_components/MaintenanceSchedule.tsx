"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  HourglassOutlined,
  DeleteOutlined,
  SearchOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { DatePicker, Select, Popconfirm, Tooltip, Button } from "antd";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import clsx from "clsx";

import { MaintenanceSchedule } from "../types/types";
import { MaintenanceScheduleMocks } from "../mocks/maintenance-schedule-data";
import EditScheduleModal from "./EditMaintenanceSchedule";

import { TRANSLATION_FILES } from "@/lib/i18n";

dayjs.extend(isBetween);
const { RangePicker } = DatePicker;
const { Option } = Select;

const MaintenanceScheduleList = () => {
  const t = useTranslations(TRANSLATION_FILES.MAINTENANCE);
  const statusConfig = {
    confirmed: {
      label: t("status.confirmed"),
      icon: <CheckCircleOutlined style={{ fontSize: 16 }} />,
      color: "bg-green-100 text-green-700",
    },
    pending: {
      label: t("status.pending"),
      icon: <HourglassOutlined style={{ fontSize: 16 }} />,
      color: "bg-yellow-100 text-yellow-700",
    },
    cancelled: {
      label: t("status.cancelled"),
      icon: <CloseCircleOutlined style={{ fontSize: 16 }} />,
      color: "bg-red-100 text-red-700",
    },
  };
  const [data, setData] = useState<MaintenanceSchedule[]>([]);
  const [filteredData, setFilteredData] = useState<MaintenanceSchedule[]>([]);
  const [dateRange, setDateRange] = useState<any>(null);
  const [editingItem, setEditingItem] = useState<MaintenanceSchedule | null>(
    null
  );
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setData(MaintenanceScheduleMocks);
      setFilteredData(MaintenanceScheduleMocks);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleDelete = (id: number) => {
    const updated = data.filter((item) => item.id !== id);
    setData(updated);
    setFilteredData(updated);
    toast.success("Đã xóa lịch hẹn bảo dưỡng thành công");
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

    setFilteredData(filtered);
  };

  const openEditModal = (item: MaintenanceSchedule) => {
    setEditingItem(item);
    setOpenModal(true);
  };

  const handleEditSubmit = (updatedItem: MaintenanceSchedule) => {
    const updatedList = data.map((item) =>
      item.id === updatedItem.id ? updatedItem : item
    );
    setData(updatedList);
    setFilteredData(updatedList);
    setOpenModal(false);
    toast.success("Cập nhật lịch hẹn thành công");
  };

  return (
    <div className="py-8 min-h-screen bg-gradient-to-r">
      <div className="mb-6 flex items-center gap-3">
        <h2 className="text-xl font-semibold text-gray-800">{t("title")}</h2>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <RangePicker
          format="YYYY-MM-DD"
          onChange={(values) => setDateRange(values)}
          className="w-full sm:w-auto"
          placeholder={[t("filter.startDate"), t("filter.endDate")]}
        />

        <Button icon={<SearchOutlined />} onClick={handleFilter} type="primary">
          {t("filter.button")}
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredData.length > 0 ? (
          filteredData.map((item) => {
            const status =
              statusConfig[item.status as keyof typeof statusConfig] ||
              statusConfig.pending;

            return (
              <div
                key={item.id}
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg hover:shadow-2xl transition duration-300 ease-in-out transform hover:scale-105"
              >
                <div className="lg:my-4 sm:my-2">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {item.first_name} {item.last_name}
                  </h3>
                  <p className="text-md text-gray-500">
                    {t(`service_type.${item.service_type}`)}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                  <ClockCircleOutlined
                    style={{ fontSize: 16, color: "#3B82F6" }}
                  />
                  {item.time}
                </div>

                <div
                  className={clsx(
                    "inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full",
                    status.color
                  )}
                >
                  {status.icon}
                  {status.label}
                </div>

                <div className="mt-4 text-gray-500 text-sm space-y-1">
                  <p>
                    {t("info.phone")}: {item.phone_number}
                  </p>
                  <p>
                    {t("info.email")}: {item.email}
                  </p>
                  <p>
                    {t("info.vehicle_type")}: {item.vehicle_type} -{" "}
                    {item.vehicle_brand}
                  </p>
                  <p>
                    {t("info.vehicle_number")}: {item.vehicle_number}
                  </p>
                  <p>
                    {t("info.address")}: {item.address}
                  </p>
                  {item.note && (
                    <p className="italic">
                      {t("info.note")}: {item.note}
                    </p>
                  )}
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <Tooltip title={t("actions.edit")}>
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => openEditModal(item)}
                    >
                      <EditOutlined style={{ fontSize: 20 }} />
                    </button>
                  </Tooltip>
                  <Popconfirm
                    title={t("confirmDelete.title")}
                    okText={t("confirmDelete.ok")}
                    cancelText={t("confirmDelete.cancel")}
                  >
                    <Tooltip title={t("actions.delete")}>
                      <button className="text-red-500 hover:text-red-700">
                        <DeleteOutlined style={{ fontSize: 20 }} />
                      </button>
                    </Tooltip>
                  </Popconfirm>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center text-gray-500">
            {t("empty")}
          </div>
        )}
      </div>

      <EditScheduleModal
        open={openModal}
        onCancel={() => setOpenModal(false)}
        initialData={editingItem}
        onSubmit={handleEditSubmit}
      />
    </div>
  );
};

export default MaintenanceScheduleList;
