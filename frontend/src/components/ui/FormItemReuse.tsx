/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input, Select, Checkbox, Radio, Upload } from "antd";
import React from "react";
import { GreenSwitch } from "./Switch";
import { UploadIcon, X } from "lucide-react";
import Image from "next/image";

const { TextArea } = Input;
const { Option } = Select;

type FormItemType =
  | "input"
  | "textarea"
  | "select"
  | "checkbox"
  | "radio"
  | "switch"
  | "file"
  | "date";
interface OptionType {
  label: string;
  value: string | number;
}

interface FormItemReuseProps {
  label: string;
  required?: boolean;
  type?: FormItemType;
  placeholder?: string;
  value?: any;
  onChange?: (value: any) => void;
  options?: OptionType[];
  error?: string | null;
  handlePreview?: (file: any) => void;
  fileList?: any[];
  handleRemovePreview?: (file: any) => void;
}

export const FormItemReuse = ({
  label,
  required = false,
  type = "input",
  placeholder = "",
  value,
  onChange,
  options = [],
  error,
  handlePreview,
  fileList = [],
  handleRemovePreview,
}: FormItemReuseProps) => {
  return (
    <div
      className={`mb-4 ${
        type === "switch" ? "flex items-center justify-between" : ""
      }`}
    >
      <label className="block font-semibold mb-1">
        {required && <span className="text-red-500 mr-1">*</span>}
        {label}
      </label>

      {type === "textarea" && (
        <TextArea
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="!font-semibold"
          required={required}
          status={error ? "error" : undefined}
        />
      )}

      {type === "input" && (
        <Input
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="!font-semibold"
          required={required}
          status={error ? "error" : undefined}
        />
      )}

      {type === "select" && (
        <Select
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full"
          status={error ? "error" : undefined}
        >
          {options.map((opt) => (
            <Option key={opt.value} value={opt.value}>
              {opt.label}
            </Option>
          ))}
        </Select>
      )}

      {type === "checkbox" && (
        <Checkbox
          checked={value}
          onChange={(e) => onChange?.(e.target.checked)}
          required={required}
        >
          {placeholder}
        </Checkbox>
      )}

      {type === "radio" && (
        <Radio.Group onChange={(e) => onChange?.(e.target.value)} value={value}>
          {options.map((opt) => (
            <Radio key={opt.value} value={opt.value}>
              {opt.label}
            </Radio>
          ))}
        </Radio.Group>
      )}

      {type === "switch" && <GreenSwitch checked={value} onChange={onChange} />}
      {type === "file" && (
        <>
          <Upload.Dragger
            name="file"
            accept="image/*"
            listType="picture-card"
            showUploadList={false}
            onChange={onChange}
            beforeUpload={() => false}
            onPreview={handlePreview}
            fileList={fileList}
          >
            <div className=" w-full h-[120px] flex flex-col items-center justify-center cursor-pointer hover:border-gray-500 transition">
              <UploadIcon className="text-gray-400" size={40} />
              <p className="text-gray-400 mt-2">Kéo và thả hình ảnh vào đây</p>
            </div>
          </Upload.Dragger>
          {fileList.length > 0 && (
            <div className="mt-2 relative">
              <X
                className="absolute top-0 right-0 text-red-500 cursor-pointer"
                onClick={() => handleRemovePreview?.(fileList[0])}
              />
              <Image
                src={fileList[0].preview}
                alt="preview"
                className="w-full h-32 object-cover rounded-md"
                width={100}
                height={100}
              />
            </div>
          )}
        </>
      )}
      {type === "date" && (
        <Input
          type="date"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="!font-semibold"
          required={required}
          status={error ? "error" : undefined}
        />
      )}
      {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
    </div>
  );
};
