import React from "react";

const AuthCard: React.FC = () => {
  return (
    <div className="bg-[#F3F5F9] p-8 rounded-md h-full flex flex-col gap-5">
      <h2 className="text-[30px] font-medium mb-2">
        Hệ thống <br /> bảo dưỡng xe máy
      </h2>
      <p className="text-gray-500 text-xl mb-6">
        Công ty của chúng tôi luôn cung cấp những dịch vụ và những ưu đãi hấp
        dẫn dành cho những khách hàng đã tin tưởng ghé lại công ty chúng tôi.
      </p>
      <div className="bg-gray-800 text-white p-4 rounded-[20px]">
        <p className="text-sm mb-2">
          Một trong những kỹ thuật viên xuất sắc nhất của chúng tôi.
        </p>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gray-400" />
          <div>
            <p className="font-semibold text-lg">Nguyễn Văn H</p>
            <p className="text-sm">Kỹ thuật viên</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthCard;
