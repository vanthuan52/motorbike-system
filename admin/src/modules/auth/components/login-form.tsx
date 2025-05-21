import React, { useState, useEffect, useCallback } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { LoginFormType, loginSchema } from "../schemas/auth-schema";
import Button from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store";
import { authActions } from "../store/auth-slice";
import { FormInput } from "./form-input/form-input";
import { ROUTER_PATH } from "@/constants/router-path";

const LoginForm = () => {
  const { isAuthenticated, isLoading, error } = useAppSelector(
    (state) => state.auth
  );
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormType>({
    defaultValues: {
      email: "admin@example.com",
      password: "Abc@12345",
    },
    resolver: yupResolver(loginSchema),
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTER_PATH.INDEX, { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      if (error) {
        dispatch(authActions.clearAuthError());
      }
    };
  }, [dispatch, error]);

  const onSubmit: SubmitHandler<LoginFormType> = useCallback(
    (data) => {
      if (!isLoading) {
        dispatch(authActions.login(data));
      }
    },
    [dispatch, isLoading]
  );

  return (
    <div className="p-8">
      <h1 className="text-[24px] lg:text-[30px] font-medium mb-1">Xin chào</h1>
      <p className="text-base lg:text-lg text-gray-400 mb-6">
        Chào mừng bạn đã quay trở lại
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="my-10">
        <FormInput<LoginFormType>
          name="email"
          label="Email"
          type="email"
          placeholder="joe@email.com"
          register={register}
          error={errors.email}
          required
        />

        <FormInput<LoginFormType>
          name="password"
          label="Password"
          type="password"
          placeholder="Enter your password"
          register={register}
          error={errors.password}
          required
        />
        <Button
          label="Đăng Nhập"
          type="submit"
          className="w-full h-[45px] cursor-pointer"
          loading={isLoading}
        />
      </form>
      <p className="text-base lg:text-lg mt-4 text-center font-semibold text-gray-500">
        Bạn chưa có tài khoản?{" "}
        <a
          href="/register"
          className=" font-bold hover:transform hover:scale-105 duration-200"
        >
          Đăng Ký
        </a>
      </p>
    </div>
  );
};

export default LoginForm;
