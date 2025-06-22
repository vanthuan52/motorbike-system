import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  LoginCredentialsFormType,
  loginCredentialsSchema,
} from "../schemas/auth-schema";
import Button from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store";
import { authActions } from "../store/auth-slice";
import { LoginCredentials } from "../types";
import { Form, FormItem } from "@/components/ui/form";
import CustomInput from "@/components/ui/custom-input";

const LoginForm = () => {
  const dispatch = useAppDispatch();

  const { loading, error } = useAppSelector((state) => state.auth);

  const form = useForm<LoginCredentials>({
    defaultValues: {
      email: "admin@mail.com",
      password: "aaAA@123",
    },
    resolver: yupResolver(loginCredentialsSchema),
  });

  const onSubmit: SubmitHandler<LoginCredentialsFormType> = async (values) => {
    dispatch(authActions.loginCredentials(values));
  };

  return (
    <div className="sm:p-8 p-2">
      <h1 className="text-[24px] lg:text-[30px] font-medium mb-1">Xin chào</h1>
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
              placeholder="example@gmail.com"
              {...form.register("email")}
            />
          </FormItem>
          <FormItem>
            <CustomInput
              control={form.control}
              label="Mật khẩu"
              type="password"
              {...form.register("password")}
              placeholder="Nhập mật khẩu"
            />
          </FormItem>
          <span>
            {error && <p className="text-[16px] text-red-500">{error}</p>}
          </span>
          <Button
            type="submit"
            className="w-full h-[45px] cursor-pointer bg-black !text-white hover:bg-gray-700"
            loading={loading}
          >
            Đăng nhập
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default LoginForm;
