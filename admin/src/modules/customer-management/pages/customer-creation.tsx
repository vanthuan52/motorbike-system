import React from "react";
import CustomerForm from "../components/customer-form";

const CustomerCreationPage = () => {
  return (
    <div className="w-full min-h-full">
      <div className="p-4">
        <h2 className="text-2xl font-semibold py-2">Tạo mới khách hàng</h2>
        <CustomerForm />
      </div>
    </div>
  );
};

export default CustomerCreationPage;
