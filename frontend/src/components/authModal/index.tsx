"use client";
import { useEffect, useState } from "react";
import { Modal } from "antd";
import { useTranslations } from "next-intl";
import { TRANSLATION_FILES } from "@/lib/i18n";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  LoginCredentialsFormType,
  loginCredentialsSchema,
  SignUpCredentialsFormType,
  signUpCredentialsSchema,
} from "@/features/auth/validations/auth.schema";
import { Form, FormItem } from "@/components/ui/Form";
import CustomInput from "../CustomInput";
import Button from "@/components/ui/Button/Button";
import { authActions } from "@/features/auth/store/auth-slice";
import { useAppDispatch, useAppSelector } from "@/store";
import { X } from "lucide-react";
interface AuthModalProps {
  open?: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
}

export default function AuthModal({
  open = true,
  onClose,
  onSuccess,
}: AuthModalProps) {
  const dispatch = useAppDispatch();
  const t = useTranslations(`${TRANSLATION_FILES.LOGIN_PAGE}.login`);

  const [isSignUp, setIsSignUp] = useState(false);

  const { isAuthenticated, registerCompleted, loading, error } = useAppSelector(
    (state) => state.auth
  );

  const formSignIn = useForm<LoginCredentialsFormType>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(loginCredentialsSchema),
  });

  const formSignUp = useForm<SignUpCredentialsFormType>({
    defaultValues: {
      email: "",
      name: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
    resolver: yupResolver(signUpCredentialsSchema),
  });

  const onSubmitSignIn: SubmitHandler<LoginCredentialsFormType> = async (
    values
  ) => {
    await dispatch(authActions.loginCredentials(values));
  };

  const onSubmitSignUp: SubmitHandler<SignUpCredentialsFormType> = async (
    values
  ) => {
    await dispatch(authActions.register(values));
  };
  // console.log(registerCompleted);

  useEffect(() => {
    if (registerCompleted) {
      setIsSignUp(false);
      formSignUp.reset();
    }
  }, [registerCompleted]);

  useEffect(() => {
    if (isAuthenticated) {
      formSignIn.reset();
      onClose?.();
      onSuccess?.();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (open) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [open]);
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={900}
      closeIcon={
        <X
          className={`${isSignUp ? "text-black" : "text-white"} hover:text-gray-300 w-5 h-5 transition-all duration-500`}
        />
      }
    >
      <div
        className={`relative overflow-hidden w-full rounded-lg bg-white transition-all duration-700 ${
          isSignUp ? "right-panel-active min-h-[700px]" : "min-h-[400px]"
        }`}
      >
        <div
          className={`absolute top-0 h-full w-1/2 transition-all duration-700 ${
            isSignUp ? "translate-x-full opacity-100 z-10" : "opacity-0 z-0"
          } items-center justify-center`}
        >
          <div className="m-6 p-4">
            <Form {...formSignUp}>
              <h1 className="text-[24px] lg:text-[30px] font-medium mb-1">
                {t("signUpButton")}
              </h1>
              <p className="text-base lg:text-lg text-gray-400 mb-6">
                {t("subtitle")}
              </p>
              <form
                onSubmit={formSignUp.handleSubmit(onSubmitSignUp)}
                className="flex gap-4 flex-col"
              >
                <FormItem>
                  <CustomInput
                    control={formSignUp.control}
                    label={t("emailLabel")}
                    type="email"
                    name="email"
                    placeholder={t("emailPlaceholder")}
                  />
                </FormItem>
                <FormItem>
                  <CustomInput
                    control={formSignUp.control}
                    label={t("nameLabel")}
                    type="text"
                    name="name"
                    placeholder={t("namePlaceholder")}
                  />
                </FormItem>
                <FormItem>
                  <CustomInput
                    control={formSignUp.control}
                    label={t("phoneLabel")}
                    type="text"
                    name="phone"
                    placeholder={t("phonePlaceholder")}
                  />
                </FormItem>
                <FormItem>
                  <CustomInput
                    control={formSignUp.control}
                    label={t("passwordLabel")}
                    type="password"
                    name="password"
                    placeholder={t("passwordPlaceholder")}
                  />
                </FormItem>
                <FormItem>
                  <CustomInput
                    control={formSignUp.control}
                    label={t("confirmPasswordLabel")}
                    type="password"
                    name="confirmPassword"
                    placeholder={t("confirmPasswordPlaceholder")}
                  />
                </FormItem>
                {error && (
                  <span>
                    <p className="text-[16px] text-red-500">{error}</p>
                  </span>
                )}
                {/* <a href="#" className="text-sm text-gray-500 mb-3">
                  Forgot your password?
                </a> */}

                <Button
                  label={t("submitButton")}
                  type="submit"
                  className="w-full h-[45px] cursor-pointer"
                  disabled={loading}
                />
              </form>
            </Form>
          </div>
        </div>

        {/* Sign In Form */}
        <div
          className={`absolute top-0 h-full w-1/2 transition-all duration-700 ${
            isSignUp ? "translate-x-full opacity-0 z-0" : "z-10"
          } items-center justify-center`}
        >
          <div className="m-4">
            <Form {...formSignIn}>
              <h1 className="text-[24px] lg:text-[30px] font-medium mb-1">
                {t("title")}
              </h1>
              <p className="text-base lg:text-lg text-gray-400 mb-6">
                {t("subtitle")}
              </p>
              <form
                onSubmit={formSignIn.handleSubmit(onSubmitSignIn)}
                className="my-10 flex gap-4 flex-col"
              >
                <FormItem>
                  <CustomInput
                    control={formSignIn.control}
                    label={t("emailLabel")}
                    type="email"
                    name="email"
                    placeholder={t("emailPlaceholder")}
                  />
                </FormItem>
                <FormItem>
                  <CustomInput
                    control={formSignIn.control}
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
                {/* <a href="#" className="text-sm text-gray-500 mb-3">
                  Forgot your password?
                </a> */}

                <Button
                  label={t("submitButton")}
                  type="submit"
                  className="w-full h-[45px] cursor-pointer"
                  disabled={loading}
                />
              </form>
            </Form>
          </div>
        </div>

        {/* Overlay */}
        <div
          className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-700 z-20 ${
            isSignUp ? "-translate-x-full" : ""
          }`}
        >
          <div
            className={`bg-gradient-to-r from-gray-800 to-black text-white relative left-[-100%] h-full w-[200%] transform transition-transform duration-700 ${
              isSignUp ? "translate-x-1/2" : "translate-x-0"
            } flex`}
          >
            {/* Overlay Left */}
            <div className="flex flex-col items-center justify-center text-center px-10 w-1/2">
              <h1 className="font-bold text-3xl">{t("overlayLeftTitle")}</h1>
              <p className="text-sm mt-2 mb-4">{t("overlayLeftDesc")}</p>
              <a
                className="border-none !text-white hover:bg-white hover:!underline transition"
                onClick={() => setIsSignUp(false)}
              >
                {t("signInButton")}
              </a>
            </div>

            {/* Overlay Right */}
            <div className="flex flex-col items-center justify-center text-center px-10 w-1/2">
              <h1 className="font-bold text-3xl">{t("overlayRightTitle")}</h1>
              <p className="text-sm mt-2 mb-4">{t("overlayRightDesc")}</p>
              <a
                className="border-none !text-white hover:bg-white hover:!underline transition"
                onClick={() => setIsSignUp(true)}
              >
                {t("signUpButton")}
              </a>
            </div>
          </div>
        </div>
      </div>
      <style jsx global>{`
        .ant-modal-content {
          padding: 0 !important;
        }
      `}</style>
    </Modal>
  );
}
