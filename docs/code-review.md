# Code Review Guideline & Culture

Tài liệu này thiết lập các tiêu chuẩn và văn hóa Code Review nhằm đảm bảo chất lượng hệ thống, tính đồng nhất của mã nguồn và thúc đẩy sự phát triển kỹ thuật trong đội ngũ.

---

## 1. Tư duy (Mindset) Chủ đạo

Code Review không phải là một bài kiểm tra để tìm lỗi sai cá nhân, mà là một **quy trình cộng tác**.

- **Đối với Reviewer:** Đưa ra phản hồi dựa trên mã nguồn, không dựa trên cá nhân. Hãy nhớ: _"Bạn đang review code, không phải review con người."_
- **Đối với Author (Người viết code):** Coi mỗi comment là một cơ hội để học hỏi hoặc làm rõ logic của mình. Đừng cá nhân hóa các góp ý.

---

## 2. Quy tắc Phản hồi (Feedback)

Để giao tiếp hiệu quả và tránh gây hiểu lầm, hãy sử dụng các **Prefix (Tiền tố)** cho mỗi comment:

| Prefix         | Ý nghĩa                                             | Mức độ ưu tiên          |
| :------------- | :-------------------------------------------------- | :---------------------- |
| **[Critical]** | Lỗi nghiêm trọng (Logic, bảo mật, hiệu năng).       | Bắt buộc sửa để Merge.  |
| **[Suggest]**  | Gợi ý cách viết tốt hơn hoặc sạch hơn.              | Khuyến khích sửa.       |
| **[Question]** | Đặt câu hỏi để làm rõ những phần chưa hiểu.         | Cần giải trình/trả lời. |
| **[Nit]**      | Các lỗi nhỏ (typo, định dạng, đặt tên chưa tối ưu). | Tùy chọn (Optional).    |
| **[Kudos]**    | Lời khen cho một giải pháp hay hoặc đoạn code đẹp.  | Tăng tinh thần team.    |

---

## 3. Checklist dành cho Reviewer

### A. Tính đúng đắn & Logic

- [ ] Code có thực hiện đúng yêu cầu trong ticket không?
- [ ] Có xử lý các trường hợp biên (edge cases) chưa? (Ví dụ: dữ liệu null, mảng rỗng, lỗi kết nối).
- [ ] Có tồn tại các đoạn code "chết" (không bao giờ được gọi đến) không?

### B. Kiến trúc & Thiết kế

- [ ] **SOLID:** Code có tuân thủ các nguyên tắc thiết kế hướng đối tượng không?
- [ ] **DRY (Don't Repeat Yourself):** Có đoạn code nào bị lặp lại mà có thể tách thành hàm dùng chung không?
- [ ] **Dependency:** Các lớp/module có bị phụ thuộc quá chặt chẽ (tight coupling) không?

### C. Hiệu năng & Bảo mật

- [ ] Có vấn đề về hiệu năng tiềm ẩn (ví dụ: vòng lặp lồng nhau quá nhiều, truy vấn DB trong loop)?
- [ ] Dữ liệu nhạy cảm có được bảo vệ hoặc che giấu không?

### D. Khả năng bảo trì

- [ ] **Đặt tên:** Biến, hàm và class có rõ nghĩa không?
- [ ] **Định dạng:** Đã tuân thủ quy tắc Prettier/Linter của dự án chưa?
- [ ] **Comments:** Những logic phức tạp có được giải thích rõ ràng không?

---

## 4. Checklist dành cho Author (Trước khi tạo PR)

1.  **Tự Review:** Luôn tự đọc lại code của mình trên Git GUI/Web trước khi gửi cho người khác.
2.  **Kích thước PR:** Cố gắng giữ PR nhỏ (dưới 400 dòng code). PR càng nhỏ, chất lượng review càng cao.
3.  **Mô tả (Description):** - Giải thích ngắn gọn **Cái gì** đã thay đổi và **Tại sao**.
    - Cung cấp ảnh chụp màn hình/video nếu có thay đổi về UI.
    - Đính kèm link ticket/task liên quan.

---

## 5. Giải quyết xung đột (Conflict Resolution)

- Nếu có tranh luận kéo dài quá **5 comment** về một vấn đề mà không thống nhất được: **Hãy dừng chat.**
- Nhấc máy gọi hoặc gặp trực tiếp 5-10 phút để thảo luận.
- Sau khi thống nhất, Author cập nhật kết luận cuối cùng vào PR để lưu lại lịch sử.

---

_Tài liệu này được tham khảo từ Fx Studio và tinh chỉnh phù hợp với thực tế dự án._
