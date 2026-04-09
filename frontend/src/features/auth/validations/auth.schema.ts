import { InferType } from "yup";
import * as yup from "yup";

export const loginCredentialsSchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(8).max(20).required(),
});

export const signUpCredentialsSchema = loginCredentialsSchema.shape({
  name: yup.string().required(),
  phone: yup
    .string()
    .test(
      "is-phone-valid",
      "Số điện thoại phải từ 10 đến 15 ký tự",
      (value) => !value || (value.length >= 10 && value.length <= 15)
    )
    .optional(),
  confirmPassword: yup
    .string()
    .min(8)
    .max(20)
    .required()
    .oneOf([yup.ref("password")]),
});

export type LoginCredentialsFormType = InferType<typeof loginCredentialsSchema>;
export type SignUpCredentialsFormType = InferType<
  typeof signUpCredentialsSchema
>;
