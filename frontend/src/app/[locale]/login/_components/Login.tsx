"use client";

import React, { useEffect } from "react";
import { useTranslations } from "next-intl";
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
import { ROUTER_PATH } from "@/constant/router-path";
import { CustomLink } from "@/components/CustomerLink/CustomLink";

export default function LoginPage() {
  const t = useTranslations("loginPage.login");
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { isAuthenticated, loading, error } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isAuthenticated) {
      router.push(ROUTER_PATH.HOME);
    }
  }, [isAuthenticated, router]);

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
              {t("title")}
            </h1>
            <p className="text-base lg:text-lg text-gray-400 mb-6">
              {t("subtitle")}
            </p>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="my-10 flex gap-4 flex-col"
              >
                <FormItem>
                  <CustomInput
                    control={form.control}
                    label={t("emailLabel")}
                    type="email"
                    name="email"
                    placeholder={t("emailPlaceholder")}
                  />
                </FormItem>
                <FormItem>
                  <CustomInput
                    control={form.control}
                    label={t("passwordLabel")}
                    type="password"
                    name="password"
                    placeholder={t("passwordPlaceholder")}
                  />
                </FormItem>
                {error && (
                  <span>
                    <p className="text-[16px] text-red-500">{error}</p>
                  </span>
                )}
                <Button
                  label={t("submitButton")}
                  type="submit"
                  className="w-full h-[45px] cursor-pointer"
                  disabled={loading}
                />
              </form>
            </Form>

            <div className="text-base lg:text-lg mt-4 text-center font-semibold text-gray-500">
              {t("noAccount")}{" "}
              <CustomLink
                href="/register"
                className="font-bold hover:transform hover:scale-105 duration-200"
              >
                {t("register")}
              </CustomLink>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-1/2 p-6 hidden lg:block">
          <AuthCard />
        </div>
      </div>
    </div>
  );
}
