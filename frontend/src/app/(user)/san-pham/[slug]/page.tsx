import { Metadata } from 'next'
import ProductDetailsPage from '@/app/(user)/san-pham/[slug]/_components/ProductDetailsPage'

export const metadata: Metadata = {
    title: "Chi tiết sản phẩm",
    description: "Chi tiết sản phẩm",
}
export default function page() {
    return (
        <div className='w-full'><ProductDetailsPage /></div>
    )
}
