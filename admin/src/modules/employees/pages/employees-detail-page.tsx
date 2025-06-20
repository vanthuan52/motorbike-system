"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Breadcrumb, Form } from "antd";
import moment from "moment";
import * as vietnamProvinces from "vietnam-provinces";
import { BiHome } from "react-icons/bi";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// import { EmployeeType } from "../types";
import { useDispatch } from "react-redux";
import { employeesActions } from "../store/employees-slice";
import { mockDataTableManageEmployees } from "../mocks/employees";

import EmployeeAvatar from "../components/employeeAvatar";
import EmployeeHeader from "../components/employeeHeader";
import EmployeeForm from "../components/employeeDetailForm";
import EmployeeActions from "../components/employeeActions";
import EmployeeJobInfo from "../components/employeeJobInfo";

const EmployeeDetails: React.FC = () => {
  const params = useParams();
  const employeeId = params.id;

  const employeeData = mockDataTableManageEmployees.find(
    (employee) => employee.id === employeeId
  );

  if (!employeeData) {
    return (
      <div className="text-center text-red-500">
        Không tìm thấy dữ liệu nhân viên
      </div>
    );
  }

  const breadcrumbItems = [
    {
      label: "Home",
      href: "/admin",
      icon: <BiHome className="text-xs" />,
    },
    {
      label: "Quản lý người dùng",
      href: "/admin/users-management/customers",
    },
    {
      label: "Nhân viên",
    },
    {
      label: `${employeeData.first_name} ${employeeData.last_name}`,
    },
  ];

  const [status, setStatus] = useState(employeeData.status || "ACTIVE");
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState(
    employeeData.city || ""
  );
  const [selectedDistrict, setSelectedDistrict] = useState(
    employeeData.district || ""
  );
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  const [form] = Form.useForm();
  const provinces = vietnamProvinces.getProvinces();
  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedProvince) {
      const provinceCode = provinces.find(
        (p) => p.name === selectedProvince
      )?.code;
      const result = provinceCode
        ? vietnamProvinces.getDistricts(provinceCode)
        : [];
      setDistricts(result);
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedDistrict) {
      const districtCode = districts.find(
        (d) => d.name === selectedDistrict
      )?.code;
      const result = districtCode
        ? vietnamProvinces.getWards(districtCode)
        : [];
      setWards(result);
    }
  }, [selectedDistrict, districts]);

  useEffect(() => {
    form.setFieldsValue({
      ...employeeData,
      dob: employeeData.dob ? moment(employeeData.dob) : undefined,
    });
    setSelectedProvince(employeeData.city || "");
    setSelectedDistrict(employeeData.district || "");
  }, [employeeData, form]);

  const handleFinish = (values: any) => {
    dispatch(
      employeesActions.updateEmployeeRequest({
        id: employeeData.id,
        data: {
          ...values,
          dob: values.dob ? values.dob.format("YYYY-MM-DD") : "",
        },
      })
    );
    setIsEditing(false);
  };

  return (
    <div className="p-4 space-y-6 w-full">
      <Breadcrumb items={breadcrumbItems} />
      <ToastContainer />

      <EmployeeActions
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        form={form}
        employeeData={employeeData}
        onSave={() => form.submit()}
      />

      <div className="flex flex-col md:flex-row items-center gap-6">
        <EmployeeAvatar
          photo={
            typeof employeeData.photo === "string"
              ? employeeData.photo
              : undefined
          }
        />
        <EmployeeHeader
          firstName={form.getFieldValue("first_name")}
          lastName={form.getFieldValue("last_name")}
          status={form.getFieldValue("status")}
        />
      </div>

      <hr className="border-t border-gray-300 my-4" />

      <EmployeeForm
        form={form}
        isEditing={isEditing}
        provinces={provinces}
        districts={districts}
        wards={wards}
        setSelectedProvince={setSelectedProvince}
        setSelectedDistrict={setSelectedDistrict}
        status={status}
        setStatus={setStatus}
        employeeData={employeeData}
        handleFinish={handleFinish}
      />

      <div className="mt-10">
        <EmployeeJobInfo employee={employeeData} />
      </div>
    </div>
  );
};

export default EmployeeDetails;
