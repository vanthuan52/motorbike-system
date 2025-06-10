"use client";
import React, { useState } from "react";

type PolicySection = {
  title: string;
  content: React.ReactNode;
};

const sections: PolicySection[] = [
  {
    title: "1. Giới thiệu",
    content: (
      <p>
        <strong>Motobike</strong> cam kết bảo vệ quyền riêng tư và thông tin cá
        nhân của bạn. Chính sách này giải thích cách chúng tôi thu thập, sử
        dụng, lưu trữ và bảo vệ thông tin cá nhân khi bạn sử dụng dịch vụ.
      </p>
    ),
  },
  {
    title: "2. Thông tin chúng tôi thu thập",
    content: (
      <ul className="list-disc list-inside space-y-1">
        <li>
          <strong>Thông tin cá nhân:</strong> Họ tên, SĐT, email, thông tin xe.
        </li>
        <li>
          <strong>Dữ liệu kỹ thuật:</strong> IP, trình duyệt, thiết bị truy cập.
        </li>
        <li>
          <strong>Dữ liệu sử dụng:</strong> lịch sử truy cập, đặt lịch bảo
          dưỡng.
        </li>
        <li>
          <strong>Dữ liệu cookies:</strong> theo dõi hành vi sử dụng.
        </li>
      </ul>
    ),
  },
  {
    title: "3. Cách thức thu thập thông tin",
    content: (
      <ul className="list-disc list-inside space-y-1">
        <li>Qua biểu mẫu đặt lịch, đăng ký nhận tin.</li>
        <li>Qua cookies và công cụ phân tích như Google Analytics.</li>
        <li>Qua tương tác với nhân viên.</li>
      </ul>
    ),
  },
  {
    title: "4. Mục đích sử dụng thông tin",
    content: (
      <ul className="list-disc list-inside space-y-1">
        <li>Cung cấp dịch vụ đúng và kịp thời.</li>
        <li>Cải thiện chất lượng và cá nhân hóa trải nghiệm.</li>
        <li>Gửi thông báo, ưu đãi.</li>
        <li>Phân tích hiệu quả vận hành.</li>
      </ul>
    ),
  },
  {
    title: "5. Chia sẻ thông tin với bên thứ ba",
    content: (
      <>
        <ul className="list-disc list-inside space-y-1">
          <li>Đơn vị thanh toán.</li>
          <li>Đối tác vận chuyển hoặc bảo hành.</li>
          <li>Nhà cung cấp phân tích dữ liệu.</li>
        </ul>
        <p className="mt-2">
          Việc chia sẻ tuân thủ pháp luật và giới hạn trong phạm vi cần thiết.
        </p>
      </>
    ),
  },
  {
    title: "6. Quyền của người dùng",
    content: (
      <>
        <ul className="list-disc list-inside space-y-1">
          <li>Truy cập và nhận bản sao dữ liệu.</li>
          <li>Yêu cầu sửa đổi, cập nhật thông tin.</li>
          <li>Yêu cầu xóa hoặc ngừng sử dụng dữ liệu.</li>
          <li>Từ chối email quảng cáo.</li>
        </ul>
        <p className="mt-2">
          Bạn có thể liên hệ với chúng tôi để thực hiện các quyền này.
        </p>
      </>
    ),
  },
  {
    title: "7. Bảo mật dữ liệu",
    content: (
      <ul className="list-disc list-inside space-y-1">
        <li>Mã hóa dữ liệu khi truyền và lưu trữ.</li>
        <li>Hạn chế quyền truy cập nội bộ.</li>
        <li>Kiểm tra và cập nhật hệ thống thường xuyên.</li>
      </ul>
    ),
  },
  {
    title: "8. Cookies và công nghệ theo dõi",
    content: (
      <>
        <p>
          Cookies giúp ghi nhớ thiết lập truy cập. Chúng tôi dùng để cải thiện
          trải nghiệm và đo lường hiệu suất website.
        </p>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li>Cải thiện trải nghiệm người dùng.</li>
          <li>Phân tích lưu lượng truy cập.</li>
          <li>Hỗ trợ quảng cáo phù hợp.</li>
        </ul>
        <p className="mt-2">
          Bạn có thể từ chối cookies nhưng có thể ảnh hưởng đến trải nghiệm.
        </p>
      </>
    ),
  },
  {
    title: "9. Chính sách về trẻ em",
    content: (
      <p>
        Chúng tôi không cố ý thu thập thông tin từ trẻ em dưới 13 tuổi. Nếu phát
        hiện, chúng tôi sẽ xóa bỏ dữ liệu đó.
      </p>
    ),
  },
  {
    title: "10. Thay đổi chính sách",
    content: (
      <p>
        Chính sách có thể được cập nhật. Mọi thay đổi sẽ được thông báo và có
        hiệu lực ngay khi đăng tải.
      </p>
    ),
  },
  {
    title: "11. Thông tin liên hệ",
    content: (
      <ul className="list-disc list-inside space-y-1">
        <li>
          Email:{" "}
          <a
            href="mailto:hotro@baoduongxemayabc.com"
            className="text-blue-600 underline"
          >
            hotro@baoduongxemayabc.com
          </a>
        </li>
        <li>Điện thoại: 0909 123 456</li>
        <li>Địa chỉ: 123 Đường Lý Thường Kiệt, Q10, TP.HCM</li>
      </ul>
    ),
  },
];

export default function PrivacyPolicyAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="py-8">
      <div className="container">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Chính sách bảo mật
        </h2>
        <div className="space-y-4">
          {sections.map((section, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg shadow-sm"
            >
              <button
                onClick={() => toggle(index)}
                className="w-full text-left px-4 py-3 bg-white hover:bg-gray-50 rounded-t-lg flex justify-between items-center"
              >
                <span className="font-medium text-gray-800">
                  {section.title}
                </span>
                <span className="text-xl text-gray-500">
                  {openIndex === index ? "−" : "+"}
                </span>
              </button>
              {openIndex === index && (
                <div className="px-4 py-3 bg-gray-50 text-gray-700">
                  {section.content}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
