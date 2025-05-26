/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Form, Input, Select } from "antd";
import { Ref } from "react";

export default function TimezoneForm({ ref }: { ref: Ref<any> }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-6 sm:gap-4 px-2">
      <div className="md:col-span-1">
        <h3 className="text-xl font-semibold">Múi giờ & tùy chọn</h3>
        <p className="text-sm text-gray-500 mt-1">
          Cho chúng tôi biết múi giờ và định dạng thời gian của bạn
        </p>
      </div>
      <div className="md:col-span-2 grid gap-6">
        <Form layout="vertical" ref={ref}>
          <div className="grid md:grid-cols-2 gap-4">
            <Form.Item
              label={<span className="text-sm font-medium">Thành phố</span>}
              name="city"
              className="mb-0"
              rules={[{ required: true, message: "Vui lòng nhập thành phố" }]}
            >
              <Input
                placeholder="Hà Nội"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:!ring-0 hover:!border-gray-400"
              />
            </Form.Item>
            <Form.Item
              label={<span className="text-sm font-medium">Múi giờ</span>}
              name="timezone"
              className="mb-0"
              rules={[{ required: true, message: "Vui lòng chọn múi giờ" }]}
            >
              <Select
                className="w-full"
                options={[
                  { value: "gmt7", label: "UTC/GMT +7 giờ" },
                  { value: "gmt8", label: "UTC/GMT +8 giờ" },
                  { value: "gmt9", label: "UTC/GMT +9 giờ" },
                ]}
                placeholder="Chọn múi giờ"
              />
            </Form.Item>
          </div>
          <Form.Item
            label={
              <span className="text-sm font-medium">Định dạng ngày & giờ</span>
            }
            name="dateFormat"
            className="mb-0 "
            rules={[
              { required: true, message: "Vui lòng chọn định dạng ngày & giờ" },
            ]}
          >
            <Select
              className="w-full"
              options={[
                { value: "ddmmyyyy", label: "DD/MM/YYYY HH:MM" },
                { value: "mmddyyyy", label: "MM/DD/YYYY HH:MM" },
                { value: "yyyymmdd", label: "YYYY/MM/DD HH:MM" },
              ]}
              placeholder="Chọn định dạng ngày & giờ"
            />
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
