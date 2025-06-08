export interface FAQItem {
  key: string;
  question: string;
  answer: string;
  category: string;
}

export const faqData: FAQItem[] = [
  {
    key: "1",
    question: "Làm thế nào để đặt lịch bảo dưỡng xe?",
    answer:
      "Bạn có thể đặt lịch bảo dưỡng xe thông qua website của chúng tôi bằng cách nhấn vào nút 'Đặt lịch ngay' trên trang chủ, hoặc gọi trực tiếp đến hotline. Chúng tôi sẽ xác nhận lịch hẹn và thông báo thời gian cụ thể cho bạn.",
    category: "Đặt lịch",
  },
  {
    key: "2",
    question: "Thời gian bảo dưỡng định kỳ mất bao lâu?",
    answer:
      "Thời gian bảo dưỡng định kỳ thông thường từ 30-60 phút tùy thuộc vào tình trạng xe và các hạng mục cần kiểm tra. Đối với các trường hợp phức tạp hơn, chúng tôi sẽ thông báo thời gian cụ thể sau khi kiểm tra.",
    category: "Bảo dưỡng",
  },
  {
    key: "3",
    question: "Có cần đặt cọc khi đặt lịch không?",
    answer:
      "Không, bạn không cần đặt cọc khi đặt lịch. Chúng tôi chỉ yêu cầu thanh toán sau khi hoàn thành dịch vụ và bạn hài lòng với chất lượng.",
    category: "Thanh toán",
  },
  {
    key: "4",
    question: "Phụ tùng thay thế có được bảo hành không?",
    answer:
      "Có, tất cả phụ tùng chính hãng đều được bảo hành theo chính sách của nhà sản xuất. Thời gian bảo hành từ 3-12 tháng tùy theo loại phụ tùng. Chúng tôi cũng cung cấp bảo hành dịch vụ sửa chữa từ 1-3 tháng.",
    category: "Bảo hành",
  },
  {
    key: "5",
    question: "Trung tâm có nhận sửa xe các hãng nào?",
    answer:
      "Chúng tôi nhận sửa chữa và bảo dưỡng tất cả các hãng xe máy phổ biến như Honda, Yamaha, Suzuki, SYM, Piaggio và các hãng khác. Đội ngũ kỹ thuật viên có kinh nghiệm với đa dạng loại xe.",
    category: "Dịch vụ",
  },
  {
    key: "6",
    question: "Có dịch vụ cứu hộ xe tại nhà không?",
    answer:
      "Có, chúng tôi cung cấp dịch vụ cứu hộ xe tại nhà trong bán kính 15km từ trung tâm. Phí dịch vụ được tính theo khoảng cách và thời gian. Vui lòng liên hệ hotline để biết thêm chi tiết.",
    category: "Dịch vụ",
  },
  {
    key: "7",
    question: "Giờ hoạt động của trung tâm như thế nào?",
    answer:
      "Trung tâm hoạt động từ 7:00 - 18:00 tất cả các ngày trong tuần, bao gồm cả thứ 7 và chủ nhật. Đối với các trường hợp khẩn cấp, chúng tôi có dịch vụ cứu hộ 24/7.",
    category: "Thông tin",
  },
  {
    key: "8",
    question: "Có thể xem trước báo giá dịch vụ không?",
    answer:
      "Có, bạn có thể xem bảng giá tham khảo trên website hoặc liên hệ trực tiếp để được tư vấn báo giá chi tiết. Chúng tôi cam kết báo giá minh bạch, không phát sinh chi phí ẩn.",
    category: "Thanh toán",
  },
  {
    key: "9",
    question: "Tôi có thể thay nhớt loại nào cho xe số?",
    answer:
      "Chúng tôi khuyên dùng nhớt 10W-30 hoặc 10W-40 cho xe số. Tùy vào mức độ sử dụng, kỹ thuật viên sẽ tư vấn loại nhớt phù hợp nhất cho động cơ của bạn.",
    category: "Bảo dưỡng",
  },
  {
    key: "10",
    question: "Có giảm giá cho khách hàng thân thiết không?",
    answer:
      "Có, chúng tôi có chương trình thẻ thành viên và giảm giá cho khách hàng thân thiết, bao gồm các ưu đãi dịch vụ định kỳ, thay nhớt miễn phí sau lần thứ 5, và nhiều ưu đãi khác.",
    category: "Thanh toán",
  },
  {
    key: "11",
    question: "Tôi có thể huỷ lịch hẹn đã đặt không?",
    answer:
      "Bạn hoàn toàn có thể huỷ lịch hẹn trước ít nhất 2 giờ so với thời gian đã đặt. Vui lòng gọi hotline hoặc huỷ trực tiếp qua website.",
    category: "Đặt lịch",
  },
  {
    key: "12",
    question: "Xe tôi bị rung lắc mạnh khi chạy, có nên kiểm tra gấp không?",
    answer:
      "Có, rung lắc bất thường có thể là dấu hiệu của lốp bị mòn, vành cong hoặc hệ thống phuộc gặp sự cố. Bạn nên đến trung tâm càng sớm càng tốt để kiểm tra an toàn.",
    category: "Bảo dưỡng",
  },
  {
    key: "13",
    question: "Có bảo hành cho việc sơn dặm lại xe không?",
    answer:
      "Có, các dịch vụ sơn dặm hoặc sơn lại toàn bộ xe đều được bảo hành trong 6 tháng đối với bong tróc hoặc phai màu do kỹ thuật.",
    category: "Bảo hành",
  },
  {
    key: "14",
    question: "Trung tâm có hỗ trợ thanh toán qua thẻ không?",
    answer:
      "Có, chúng tôi chấp nhận tất cả các loại thẻ tín dụng, thẻ ghi nợ và ví điện tử phổ biến để giúp bạn thanh toán nhanh chóng và tiện lợi.",
    category: "Thanh toán",
  },
  {
    key: "15",
    question: "Tôi có thể yêu cầu kỹ thuật viên cụ thể không?",
    answer:
      "Bạn có thể yêu cầu kỹ thuật viên nếu người đó có lịch trống vào thời điểm bạn đặt. Vui lòng báo trước để chúng tôi sắp xếp phù hợp.",
    category: "Dịch vụ",
  },
  {
    key: "16",
    question: "Tôi có thể góp ý dịch vụ bằng cách nào?",
    answer:
      "Bạn có thể góp ý trực tiếp với nhân viên tại quầy lễ tân, gửi email tới hòm thư góp ý trên website, hoặc điền vào phiếu khảo sát sau khi sử dụng dịch vụ.",
    category: "Thông tin",
  },
  {
    key: "17",
    question: "Trung tâm có hỗ trợ tiếng Anh không?",
    answer:
      "Có, một số nhân viên của chúng tôi có thể giao tiếp bằng tiếng Anh cơ bản. Nếu bạn cần hỗ trợ ngôn ngữ, vui lòng báo trước khi đặt lịch.",
    category: "Thông tin",
  },
  {
    key: "18",
    question: "Có dịch vụ giữ xe qua đêm không?",
    answer:
      "Có, trung tâm có khu vực giữ xe an toàn qua đêm nếu quá trình sửa chữa kéo dài. Bạn sẽ được thông báo chi tiết và ký biên bản nhận xe.",
    category: "Thông tin",
  },
];
