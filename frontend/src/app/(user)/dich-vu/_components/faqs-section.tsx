"use client";

import { useState, useRef } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, useInView } from "framer-motion";

type FAQ = {
  question: string;
  answer: string;
};

const faqs: FAQ[] = [
  {
    question: "Bao lâu nên bảo dưỡng xe máy 1 lần?",
    answer:
      "Việc bảo dưỡng xe máy nên được thực hiện định kỳ mỗi 3.000 - 5.000 km hoặc theo khuyến nghị của nhà sản xuất. Tuy nhiên, bạn cũng nên chú ý các dấu hiệu như tiếng động lạ, giảm hiệu suất phanh hay mòn lốp để bảo dưỡng sớm.",
  },
  {
    question: "Có cần đặt lịch trước không?",
    answer:
      "Mặc dù bạn có thể đến trung tâm mà không cần đặt lịch trước, nhưng để tiết kiệm thời gian và đảm bảo có nhân viên phục vụ, chúng tôi khuyến khích bạn đặt lịch trước qua điện thoại hoặc website của trung tâm.",
  },
  {
    question: "Trung tâm có bảo hành sau sửa chữa không?",
    answer:
      "Chúng tôi cung cấp bảo hành cho các dịch vụ sửa chữa và thay thế phụ tùng, tùy vào loại dịch vụ và phụ tùng được thay thế. Thông tin chi tiết về bảo hành sẽ được thông báo khi bạn sử dụng dịch vụ tại trung tâm.",
  },
];

function FAQItem({
  faq,
  index,
  isOpen,
  onToggle,
}: {
  faq: FAQ;
  index: number;
  isOpen: boolean;
  onToggle: (index: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className='bg-white rounded-xl shadow-md overflow-hidden transition'
    >
      <button
        onClick={() => onToggle(index)}
        className='flex justify-between items-center w-full px-6 py-4 text-left focus:outline-none'
      >
        <h3 className='text-lg font-semibold text-gray-800'>{faq.question}</h3>
        {isOpen ? (
          <ChevronUp className='w-6 h-6 text-gray-500' />
        ) : (
          <ChevronDown className='w-6 h-6 text-gray-500' />
        )}
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className='px-6 pb-4 text-sm text-gray-600'
        >
          {faq.answer}
        </motion.div>
      )}
    </motion.div>
  );
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className='py-16 bg-gray-100'>
      <div className='container'>
        <h2 className='text-2xl md:text-3xl font-bold text-center text-gray-800 mb-10'>
          Hỏi đáp thường gặp (FAQ)
        </h2>

        <div className='space-y-4'>
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              faq={faq}
              index={index}
              isOpen={openIndex === index}
              onToggle={toggle}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
