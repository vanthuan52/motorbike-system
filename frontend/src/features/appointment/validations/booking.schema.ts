import * as yup from "yup";

export const bookingFormSchema = yup.object({
  name: yup
    .string()
    .required("Vui lòng nhập họ và tên")
    .min(2, "Họ và tên phải có ít nhất 2 ký tự"),
  phone: yup
    .string()
    .required("Vui lòng nhập số điện thoại")
    .matches(/^0\d{9}$/, "Số điện thoại không hợp lệ (VD: 0912345678)"),
  vehicleBrand: yup.string().default(""),
  vehicleModel: yup.string().required("Vui lòng chọn dòng xe"),
  licensePlate: yup
    .string()
    .required("Vui lòng nhập biển số xe")
    .matches(
      /^\d{2}[A-Za-z]\d?[-\s]?\d{3,5}(\.\d{1,2})?$/,
      "Biển số xe không hợp lệ (VD: 59F1-12345)"
    ),
  vehicleServices: yup
    .array()
    .of(yup.string().required())
    .min(1, "Vui lòng chọn ít nhất 1 dịch vụ")
    .required("Vui lòng chọn dịch vụ"),
  date: yup.string().required("Vui lòng chọn ngày hẹn"),
  time: yup.string().required("Vui lòng chọn khung giờ"),
  address: yup.string().default(""),
  note: yup.string().default(""),
});

export type BookingFormValues = yup.InferType<typeof bookingFormSchema>;
