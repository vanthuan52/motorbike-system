import * as yup from "yup";

export const bookingFormSchema = yup.object({
  name: yup.string().required("Vui lòng nhập họ và tên"),
  phone: yup
    .string()
    .required("Vui lòng nhập số điện thoại")
    .matches(/^0\d{9}$/, "Số điện thoại không hợp lệ"),
  vehicleBrand: yup.string().default(""),
  vehicleModel: yup.string().required("Vui lòng chọn dòng xe"),
  licensePlate: yup.string().required("Vui lòng nhập biển số xe"),
  vehicleServices: yup
    .array()
    .of(yup.string().required())
    .min(1, "Vui lòng chọn ít nhất 1 dịch vụ")
    .required("Vui lòng chọn dịch vụ"),
  date: yup.string().required("Vui lòng chọn ngày"),
  time: yup.string().required("Vui lòng chọn giờ"),
  address: yup.string().default(""),
  note: yup.string().default(""),
});

export type BookingFormValues = yup.InferType<typeof bookingFormSchema>;
