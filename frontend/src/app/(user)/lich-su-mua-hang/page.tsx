import { Metadata } from 'next'
import PurchaseHistoryLayout from './_components/PurchaseHistoryLayout'

export const metadata: Metadata = {
    title: 'Lịch sử mua hàng',
    description: 'Lịch sử mua hàng hệ thống Motorbike',
}
export default function page() {
    return (
        <PurchaseHistoryLayout />
    )
}
