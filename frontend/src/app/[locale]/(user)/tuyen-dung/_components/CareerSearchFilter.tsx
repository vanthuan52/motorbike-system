"use client";

import { ConfigProvider, Input, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const { Option } = Select;

export default function CareerSearchFilter({
  search,
  handleSearch,
  type,
  setType,
}: {
  search: string;
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type: string;
  setType: (v: string) => void;
}) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#000",
          colorText: "#111",
          colorBorder: "#d9d9d9",
          colorBgContainer: "#fff",
        },
        components: {
          Input: {
            borderRadius: 8,
            colorTextPlaceholder: "#aaa",
          },
          Select: {
            borderRadius: 8,
            colorTextPlaceholder: "#999",
            colorBgElevated: "#fff",
            colorText: "#111",
            optionSelectedBg: "#f5f5f5",
            optionActiveBg: "#f0f0f0",
          },
        },
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="flex flex-col">
          <label className="text-sm text-gray-700 mb-1">Tìm kiếm</label>
          <Input
            placeholder="Tìm kiếm công việc"
            prefix={<SearchOutlined />}
            value={search}
            onChange={handleSearch}
            allowClear
            size="large"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm text-gray-700 mb-1">Loại công việc</label>
          <Select
            placeholder="Chọn loại công việc"
            value={type}
            onChange={(value) => setType(value)}
            size="large"
            allowClear
          >
            <Option value="">Tất cả</Option>
            <Option value="Full-time">Toàn thời gian</Option>
            <Option value="Part-time">Bán thời gian</Option>
          </Select>
        </div>
      </div>
    </ConfigProvider>
  );
}
