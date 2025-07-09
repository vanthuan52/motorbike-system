import { useState } from "react";
import { Form } from "antd";

export const useBookingForm = () => {
  const [form] = Form.useForm();
  const [serviceType, setServiceType] = useState<"store" | "pickup">("store");

  const handleTabChange = (key: string) => {
    setServiceType(key as "store" | "pickup");
  };

  const handleFinish = (values: any) => {
    console.log("Form values:", values);
    // TODO: submit API
  };

  return {
    form,
    serviceType,
    handleTabChange,
    handleFinish,
  };
};
