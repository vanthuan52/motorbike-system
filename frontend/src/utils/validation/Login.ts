import validator from "validator";

export const validateLogin = (formData: {
  email: string;
  password: string;
}) => {
  const errors: { email?: string; password?: string } = {};

  if (!validator.isEmail(formData.email)) {
    errors.email = "Email không hợp lệ";
  }

  if (!formData.password) {
    errors.password = "Vui lòng nhập mật khẩu";
  }

  return errors;
};
