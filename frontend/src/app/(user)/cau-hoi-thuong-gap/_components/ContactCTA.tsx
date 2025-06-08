"use client";
import { Space } from "antd";
import Link from "next/link";

export const ContactCTA = () => {
  return (
    <div className='mt-16 text-center bg-gray-50 rounded-xl p-8'>
      <h3 className='text-xl font-semibold text-gray-900 mb-3'>
        Không tìm thấy câu trả lời?
      </h3>
      <p className='text-gray-600 mb-6'>
        Liên hệ với chúng tôi để được hỗ trợ trực tiếp từ đội ngũ tư vấn chuyên
        nghiệp
      </p>
      <Space size='middle'>
        <Link href='/contact'>
          <button className='bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-md transition cursor-pointer'>
            Liên hệ ngay
          </button>
        </Link>
        <a
          href='tel:0123456789'
          className='border border-gray-800 text-gray-800 hover:bg-gray-100 font-semibold px-6 py-3 rounded-md transition cursor-pointer'
        >
          Gọi hotline
        </a>
      </Space>
    </div>
  );
};
