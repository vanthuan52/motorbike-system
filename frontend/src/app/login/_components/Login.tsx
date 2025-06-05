"use client";

import React, { useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import InputField from "@/components/ui/InputField";
import { validateLogin } from "@/utils/validation/Login";
import { LoginType } from "@/types/Login";
import AuthCard from "@/app/login/_components/AuthCard";
import AuthCard from "./AuthCard";
import Button from "@/components/ui/Button/Button";

export default function LoginPage() {
  const [formData, setFormData] = useState<LoginType>({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof LoginType, string>>
  >({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof LoginType
  ) => {
    const value = e.target.value;
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);

    const fieldError = validateLogin(updatedData)[field];
    setErrors({ ...errors, [field]: fieldError });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateLogin(formData);
    if (validationErrors.email || validationErrors.password) {
      setErrors(validationErrors);
      return;
    }
    try {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        toast.success("Đăng nhập thành công!");
      }, 1000);
    } catch {
      toast.error("Đăng nhập không thành công. Vui lòng thử lại.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-300 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-lg flex flex-col lg:flex-row w-full max-w-4xl">
        <div className="w-full lg:w-1/2 p-6">
          <div className="p-8">
            <h1 className="text-[24px] lg:text-[30px] font-medium mb-1">
              Xin chào
            </h1>
            <p className="text-base lg:text-lg text-gray-400 mb-6">
              Chào mừng bạn đã quay trở lại
            </p>
            <form onSubmit={handleSubmit} className="my-10">
              <InputField
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) => handleChange(e, "email")}
                placeholder="example@gmail.com"
                error={errors.email}
                className="font-semibold"
              />
              <InputField
                label="Mật khẩu"
                type="password"
                name="password"
                value={formData.password}
                onChange={(e) => handleChange(e, "password")}
                placeholder="Nhập mật khẩu"
                error={errors.password}
                className="font-semibold"
              />
              <Button
                label="Đăng Nhập"
                type="submit"
                className="w-full h-[45px] cursor-pointer"
                loading={loading}
              />
            </form>
            <p className="text-base lg:text-lg mt-4 text-center font-semibold text-gray-500">
              Bạn chưa có tài khoản?{" "}
              <Link
                href="register"
                className=" font-bold hover:transform hover:scale-105 duration-200"
              >
                Đăng Ký
              </Link>
            </p>
          </div>
        </div>
        <div className="w-full lg:w-1/2 p-6 hidden lg:block">
          <AuthCard />
        </div>
      </div>
    </div>
  );
}
