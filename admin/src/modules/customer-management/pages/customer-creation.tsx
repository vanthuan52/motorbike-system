import React from "react";
import CustomerForm from "../components/customer-form";

const CustomerCreationPage = () => {
  return (
    <div className="w-full min-h-full mt-6 md:mt-0">
      <div className="p-4">
        <h2 className="text-2xl font-semibold mb-6 py-2">Tạo mới khách hàng</h2>
        <CustomerForm />
      </div>
    </div>
  );
};

export default CustomerCreationPage;
