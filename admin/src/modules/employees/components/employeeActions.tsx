import React from "react";
import { Button, FormInstance } from "antd";
import {
  ArrowLeftOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { EmployeeType } from "../types";
import { useNavigate } from "react-router-dom";

interface Props {
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  form: FormInstance;
  employeeData: EmployeeType;
  onSave: () => void;
}

const EmployeeActions: React.FC<Props> = ({
  isEditing,
  setIsEditing,
  form,
  employeeData,
  onSave,
}) => {
  const navigate = useNavigate();

  const handleCancel = () => {
    setIsEditing(false);
    form.setFieldsValue({
      ...employeeData,
      dob: employeeData.dob ? moment(employeeData.dob) : undefined,
    });
  };

  return (
    <div className="flex flex-row justify-between items-center mb-6 w-full gap-4 flex-wrap">
      {/* Nút quay lại bên trái */}
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
        type="default"
        className="!bg-white !text-gray-700 hover:!bg-gray-100 hover:!text-black font-semibold px-5 py-2.5 rounded-xl border border-gray-300 shadow-sm transition-all duration-200"
      >
        <span className="hidden sm:inline">Quay lại</span>
      </Button>

      {/* Các hành động chỉnh sửa / lưu / hủy bên phải */}
      <div className="flex flex-row gap-3">
        {isEditing ? (
          <>
            <Button
              icon={<SaveOutlined />}
              onClick={onSave}
              type="default"
              className="!bg-green-500 !text-white hover:!bg-green-600 font-medium px-5 py-2.5 rounded-xl shadow-sm transition"
            >
              <span className="hidden sm:inline">Lưu</span>
            </Button>
            <Button
              icon={<CloseOutlined />}
              onClick={handleCancel}
              type="default"
              className="!bg-red-500 !text-white hover:!bg-red-600 font-medium px-5 py-2.5 rounded-xl shadow-sm transition"
            >
              <span className="hidden sm:inline">Hủy</span>
            </Button>
          </>
        ) : (
          <Button
            icon={<EditOutlined />}
            onClick={() => setIsEditing(true)}
            type="default"
            className="!bg-blue-500 !text-white hover:!bg-blue-600 font-medium px-5 py-2.5 rounded-xl shadow-sm transition"
          >
            <span className="hidden sm:inline">Chỉnh sửa</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default EmployeeActions;
