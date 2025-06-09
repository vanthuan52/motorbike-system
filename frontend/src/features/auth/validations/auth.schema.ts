import { InferType } from "yup";
import * as yup from "yup";

export const loginCredentialsSchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(8).max(20).required(),
});

export type LoginCredentialsFormType = InferType<typeof loginCredentialsSchema>;
