"use client";

import React, { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "@/components/ui/Button/Button";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  SignUpCredentialsFormType,
  signUpCredentialsSchema,
} from "@/features/auth/validations/auth.schema";
import { authActions } from "@/features/auth/store/auth-slice";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { ROUTER_PATH } from "@/constant/router-path";
import { Link, TRANSLATION_FILES } from "@/lib/i18n";

export default function RegisterPage() {
  const t = useTranslations(`${TRANSLATION_FILES.LOGIN_PAGE}.login`);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { registerCompleted, loading, error } = useAppSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    if (registerCompleted) {
      router.push(ROUTER_PATH.SIGN_IN);
    }
  }, [registerCompleted, router]);

  const form = useForm<SignUpCredentialsFormType>({
    defaultValues: {
      email: "",
      name: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
    resolver: yupResolver(signUpCredentialsSchema) as any,
  });

  const onSubmit: SubmitHandler<SignUpCredentialsFormType> = async (values) => {
    dispatch(
      authActions.register({
        ...values,
        phone: values.phone || "",
      })
    );
  };

  return (
    <div className="min-h-screen bg-gray-300 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white rounded-lg shadow-lg flex flex-col lg:flex-row w-full max-w-6xl overflow-hidden">
        <div className="w-full lg:w-2/5 p-6 sm:p-10 flex flex-col justify-center">
          <div className="py-2 px-2 sm:px-4">
            <div className="mb-6 flex justify-center sm:justify-start">
              <Logo />
            </div>

            <div className="text-center sm:text-left">
              <h1 className="text-[24px] lg:text-[30px] font-medium mb-1">
                {t("registerTitle")}
              </h1>
              <p className="text-base lg:text-lg text-gray-400 mb-6">
                {t("registerSubtitle")}
              </p>
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="my-6 flex gap-4 flex-col"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>{t("emailLabel")}</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder={t("emailPlaceholder")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>{t("nameLabel")}</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder={t("namePlaceholder")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("phoneLabel")}</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder={t("phonePlaceholder")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>{t("passwordLabel")}</FormLabel>
                      <FormControl>
                        <PasswordInput
                          placeholder={t("passwordPlaceholder")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>{t("confirmPasswordLabel")}</FormLabel>
                      <FormControl>
                        <PasswordInput
                          placeholder={t("confirmPasswordPlaceholder")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {error && (
                  <span>
                    <p className="text-[16px] text-red-500">{error}</p>
                  </span>
                )}
                <Button
                  label={t("registerSubmitButton")}
                  type="submit"
                  className="w-full h-[45px] cursor-pointer mt-2"
                  disabled={loading}
                />
              </form>
            </Form>

            <div className="text-sm mt-4 text-center font-medium text-gray-500">
              {t("haveAccount")}{" "}
              <Link
                href={ROUTER_PATH.SIGN_IN}
                className="font-bold hover:transform hover:scale-105 duration-200"
              >
                {t("signInButton")}
              </Link>
            </div>

            <div className="mt-8 pt-4 border-t border-border flex justify-center">
              <Link
                href={ROUTER_PATH.HOME}
                className="inline-flex items-center gap-2 text-text-secondary hover:text-primary-600 transition-colors font-medium text-sm"
              >
                <ArrowLeft size={18} />
                Quay lại trang chủ
              </Link>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-3/5 hidden lg:block relative bg-gray-100">
          <Image
            src="/images/auth/riding-scooter.png"
            alt="Registration Illustration"
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-32 pb-12 px-12">
            <h2 className="text-3xl font-bold text-white mb-3 leading-tight">
              Sẵn sàng cho những cung đường an toàn?
            </h2>
            <p className="text-gray-200 text-lg">
              Gia nhập ứng dụng chăm sóc xe hiện đại của Ant Motor ngay hôm nay. Hàng ngàn ưu đãi hấp dẫn đang chờ đón bạn!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
