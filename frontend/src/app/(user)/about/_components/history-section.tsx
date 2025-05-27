"use client";

import React from "react";
import { FaFlagCheckered, FaTools, FaUsers, FaAward } from "react-icons/fa";

const HistorySection = () => {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="container">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Lịch Sử Hình Thành
        </h2>

        <div className="grid md:grid-cols-2 gap-10 items-center mb-16">
          <div>
            <img
              src="/images/about/founding-story.jpg"
              alt="Câu chuyện thành lập"
              className="rounded-xl shadow-lg w-full object-cover h-72"
            />
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              Câu Chuyện Thành Lập
            </h3>
            <p className="text-lg text-gray-600 leading-relaxed">
              Trung Tâm Bảo Dưỡng XYZ được thành lập vào năm 2013 bởi một nhóm
              kỹ sư yêu nghề và đam mê xe máy. Khởi đầu từ một gara nhỏ với chỉ
              2 nhân sự, trung tâm đã trải qua nhiều khó khăn, từ thiếu thốn
              thiết bị đến việc xây dựng lòng tin khách hàng. Nhưng bằng sự tận
              tâm và khát vọng nâng tầm dịch vụ, chúng tôi từng bước vươn lên,
              trở thành một trong những trung tâm bảo dưỡng uy tín tại khu vực.
            </p>
          </div>
        </div>

        <div className="bg-gray-50 p-8 rounded-xl shadow-inner">
          <h3 className="text-2xl font-semibold text-gray-800 mb-8 text-center">
            Chặng Đường Phát Triển
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-indigo-600 text-4xl mb-4 flex justify-center">
                <FaFlagCheckered />
              </div>
              <h4 className="text-xl font-bold text-gray-800">2013</h4>
              <p className="text-gray-600 mt-2">
                Thành lập trung tâm với quy mô nhỏ tại quận Bình Thạnh.
              </p>
            </div>
            <div>
              <div className="text-indigo-600 text-4xl mb-4 flex justify-center">
                <FaTools />
              </div>
              <h4 className="text-xl font-bold text-gray-800">2016</h4>
              <p className="text-gray-600 mt-2">
                Mở rộng thêm 2 chi nhánh và đầu tư trang thiết bị hiện đại.
              </p>
            </div>
            <div>
              <div className="text-indigo-600 text-4xl mb-4 flex justify-center">
                <FaUsers />
              </div>
              <h4 className="text-xl font-bold text-gray-800">2019</h4>
              <p className="text-gray-600 mt-2">
                Đội ngũ kỹ thuật viên đạt 30 người, phục vụ hơn 10,000 khách
                hàng mỗi năm.
              </p>
            </div>
            <div>
              <div className="text-indigo-600 text-4xl mb-4 flex justify-center">
                <FaAward />
              </div>
              <h4 className="text-xl font-bold text-gray-800">2024</h4>
              <p className="text-gray-600 mt-2">
                Đạt chứng nhận dịch vụ xuất sắc và mở rộng lên 5 chi nhánh toàn
                thành phố.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HistorySection;
