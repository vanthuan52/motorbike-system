import { Metadata } from "next"
import CategoryDetailsPage from "./_components/CategoryDetailsPage"

export const metadata: Metadata = {
    title: "Chi tiết danh mục",
    description: "Trang hiển thị danh sách các danh mục phụ tùng xe máy",
}
export default function page() {
    return (
        <CategoryDetailsPage />
    )
}
