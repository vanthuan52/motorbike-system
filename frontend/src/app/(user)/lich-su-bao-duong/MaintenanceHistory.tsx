"use client";

import { useState } from "react";
import { Card, Select, Typography, Space, DatePicker, Tag, Empty } from "antd";
import {
  FilterOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { mockScheduleList } from "@/app/(admin)/admin/maintenance-schedule/data/mockSchedule";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

export default function MaintenanceHistory() {
  const fakeId = 1;
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);

  const filteredSchedules = mockScheduleList.filter((schedule) => {
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "completed" && schedule.status) ||
      (statusFilter === "pending" && !schedule.status);

    let matchesDate = true;
    if (dateRange && dateRange[0] && dateRange[1]) {
      const scheduleDate = new Date(schedule.schedule_date).getTime();
      const startDate = new Date(dateRange[0]).getTime();
      const endDate = new Date(dateRange[1]).getTime();
      matchesDate = scheduleDate >= startDate && scheduleDate <= endDate;
    }

    return matchesStatus && matchesDate;
  });

  return (
    <section className="relative bg-white overflow-hidden">
      <div className="container py-10">
        <div className="!border-none !p-0">
          <div className="mb-6">
            <Title level={3}>Lịch sử bảo dưỡng của bạn</Title>
            <Text type="secondary">
              Xem lại các lần bảo dưỡng xe máy của bạn
            </Text>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <RangePicker
              className="w-full md:w-auto"
              placeholder={["Từ ngày", "Đến ngày"]}
              onChange={(dates, dateStrings) => {
                if (dates) {
                  setDateRange([dateStrings[0], dateStrings[1]]);
                } else {
                  setDateRange(null);
                }
              }}
            />

            <Select
              className="w-full md:w-48"
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { value: "all", label: "Tất cả" },
                { value: "completed", label: "Đã hoàn thành" },
                { value: "pending", label: "Chưa hoàn thành" },
              ]}
              suffixIcon={<FilterOutlined />}
            />
          </div>

          {filteredSchedules.length === 0 ? (
            <Empty description="Bạn chưa có lịch sử bảo dưỡng nào" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSchedules
                .filter((schedule) => schedule.id === fakeId)
                .map((schedule) => (
                  <Card
                    key={schedule.id}
                    className="border rounded-lg shadow-sm"
                  >
                    <Space direction="vertical" className="w-full">
                      <Text strong>
                        <CalendarOutlined className="mr-1" />
                        Ngày:{" "}
                        {new Date(schedule.schedule_date).toLocaleDateString(
                          "vi-VN"
                        )}
                      </Text>
                      <Text>
                        <ClockCircleOutlined className="mr-1" />
                        Khung giờ: {schedule.time_slot}
                      </Text>
                      <Tag color={schedule.status ? "green" : "orange"}>
                        {schedule.status ? "Đã hoàn thành" : "Chưa hoàn thành"}
                      </Tag>
                    </Space>
                  </Card>
                ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
