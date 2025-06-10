"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import AuthCard from "./AuthCard";
import Button from "@/components/ui/Button/Button";
import { LoginCredentials } from "@/features/auth/types";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  LoginCredentialsFormType,
  loginCredentialsSchema,
} from "@/features/auth/validations/auth.schema";
import { authActions } from "@/features/auth/store/auth-slice";
import { Form, FormItem } from "@/components/ui/Form";
import CustomInput from "@/components/CustomInput";

export default function LoginPage() {
  const router = useRouter();

  const dispatch = useAppDispatch();
  const { isAuthenticated, loading, error } = useAppSelector(
    (state) => state.auth
  );

  const form = useForm<LoginCredentials>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(loginCredentialsSchema),
  });

  const onSubmit: SubmitHandler<LoginCredentialsFormType> = async (values) => {
    dispatch(authActions.loginCredentials(values));
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
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="my-10 flex gap-4 flex-col"
              >
                <FormItem>
                  <CustomInput
                    control={form.control}
                    label="Email"
                    type="email"
                    name="email"
                    placeholder="example@gmail.com"
                  />
                </FormItem>
                <FormItem>
                  <CustomInput
                    control={form.control}
                    label="Mật khẩu"
                    type="password"
                    name="password"
                    placeholder="Nhập mật khẩu"
                  />
                </FormItem>
                <span>
                  {error && <p className="text-[16px] text-red-500">{error}</p>}
                </span>
                <Button
                  label="Đăng Nhập"
                  type="submit"
                  className="w-full h-[45px] cursor-pointer"
                  disabled={loading}
                />
              </form>
            </Form>

            <p className="text-base lg:text-lg mt-4 text-center font-semibold text-gray-500">
              Bạn chưa có tài khoản?{" "}
              <Link
                href="/register"
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
