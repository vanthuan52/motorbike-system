"use client";

import React from "react";

const staff = [
  {
    name: "Nguyễn Văn A",
    role: "Trưởng kỹ thuật",
    experience: "10 năm kinh nghiệm",
    quote: "Tôi luôn đặt sự an toàn và hài lòng của khách hàng lên hàng đầu.",
    image: "https://randomuser.me/api/portraits/men/37.jpg",
  },
  {
    name: "Trần Thị B",
    role: "Kỹ thuật viên máy móc",
    experience: "6 năm kinh nghiệm",
    quote: "Làm việc với cái tâm thì xe mới khỏe, khách mới vui.",
    image: "https://randomuser.me/api/portraits/women/36.jpg",
  },
  {
    name: "Lê Văn C",
    role: "Chuyên gia động cơ",
    experience: "8 năm kinh nghiệm",
    quote: "Mỗi chiếc xe là một thử thách – và tôi yêu điều đó!",
    image: "https://randomuser.me/api/portraits/men/21.jpg",
  },
];

const StaffSection = () => {
  return (
    <section className="bg-gray-100 py-20 md:py-28">
      <div className="container">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12">
          Đội Ngũ Nhân Viên
        </h2>

        <p className="text-center max-w-2xl mx-auto text-gray-600 mb-16 text-lg">
          Trung tâm XYZ tự hào sở hữu đội ngũ kỹ thuật viên lành nghề, giàu kinh
          nghiệm và luôn tận tâm với nghề. Từng thành viên đều sở hữu chứng chỉ
          chuyên môn và trải qua quá trình đào tạo bài bản.
        </p>

        <div className="grid gap-10 md:grid-cols-3">
          {staff.map((member, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 text-center"
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-32 h-32 mx-auto rounded-full object-cover mb-4 border-4 border-indigo-500"
              />
              <h3 className="text-xl font-semibold text-gray-800">
                {member.name}
              </h3>
              <p className="text-indigo-600 font-medium">{member.role}</p>
              <p className="text-gray-500 text-sm mb-4">{member.experience}</p>
              <blockquote className="italic text-gray-700 border-l-4 border-indigo-400 pl-4 text-sm">
                “{member.quote}”
              </blockquote>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StaffSection;
