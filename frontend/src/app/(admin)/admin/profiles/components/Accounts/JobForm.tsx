/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Ref } from "react";
import { Form, Input } from "antd";
import { employeeData } from "@/data/EmployeeData";

export default function JobForm({ ref }: { ref: Ref<any> }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-6 sm:gap-4 px-2">
      <div className="md:col-span-1">
        <h3 className="text-xl font-semibold">Thông tin công việc</h3>
        <p className="text-sm text-gray-500 mt-1">
          Thông tin về vị trí của bạn
        </p>
      </div>
      <div className="md:col-span-2 grid gap-6">
        <Form layout="vertical" ref={ref} initialValues={employeeData}>
          <div className="grid md:grid-cols-2 gap-4">
            <Form.Item
              label={<span className="text-sm font-medium">Mã nhân viên</span>}
              name="employee_code"
              className="mb-0"
            >
              <Input
                disabled
                placeholder="ID"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:!ring-0 hover:!border-gray-400"
              />
            </Form.Item>
            <Form.Item
              label={<span className="text-sm font-medium">Vị trí</span>}
              name="position"
              className="mb-0"
            >
              <Input
                disabled
                placeholder="Vị trí"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:!ring-0 hover:!border-gray-400"
              />
            </Form.Item>
            <Form.Item
              label={<span className="text-sm font-medium">Vai trò</span>}
              name="role"
              className="mb-0"
            >
              <Input
                disabled
                placeholder="Vai trò"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:!ring-0 hover:!border-gray-400"
              />
            </Form.Item>
            <Form.Item
              label={<span className="text-sm font-medium">Ngày bắt đầu</span>}
              name="start_date"
              className="mb-0"
            >
              <Input
                disabled
                placeholder="Ngày bắt đầu"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:!ring-0 hover:!border-gray-400"
              />
            </Form.Item>
          </div>
        </Form>
      </div>
    </div>
  );
}
