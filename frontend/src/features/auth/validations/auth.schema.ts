import { InferType } from "yup";
import * as yup from "yup";

export const loginCredentialsSchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(8).max(20).required(),
});

export const signUpCredentialsSchema = loginCredentialsSchema.shape({
  name: yup.string().required(),
  phone: yup.string().required().min(10).max(15),
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
