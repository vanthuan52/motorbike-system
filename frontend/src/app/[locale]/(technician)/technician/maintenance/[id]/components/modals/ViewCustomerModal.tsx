import { Descriptions, Image, Modal } from "antd";
import { CustomerType } from '@/types/Customers';
import moment from 'moment';

type props = {
    customer: CustomerType | null;
    open: boolean;
    onClose: () => void;
}
export default function ViewCustomerModal({
    customer,
    open,
    onClose,
}: props) {
    if (!customer) return null;
    return (
        <Modal open={open} onCancel={onClose} footer={null} width={600} >
            <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="flex flex-col items-center justify-center min-w-[160px]">
                    <Image
                        src={customer.photo ?? undefined}
                        alt="Avatar"
                        width={160}
                        height={160}
                        className="rounded-full object-cover border shadow"
                        fallback="/images/image-holder-icon.png"
                    />
                </div>
                <div className="flex-1 w-full">
                    <Descriptions
                        title="Thông tin khách hàng"
                        size="small"
                        column={1}
                       styles={{ label: { color: '#333', fontWeight: 500 } }}
                    >
                        <Descriptions.Item label="Họ tên">
                            {customer.first_name} {customer.last_name}
                        </Descriptions.Item>
                        <Descriptions.Item label="Số điện thoại">
                            {customer.phone}
                        </Descriptions.Item>
                        <Descriptions.Item label="Email">
                            {customer.email}
                        </Descriptions.Item>
                        <Descriptions.Item label="Địa chỉ">
                            {customer.address}
                        </Descriptions.Item>
                        <Descriptions.Item label="Ngày sinh">
                            {moment(customer.dob).format("DD-MM-YYYY")}
                        </Descriptions.Item>
                        <Descriptions.Item label="Giới tính">
                            {customer.gender === "MALE" ? "Nam" : "Nữ"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Ngày tạo">
                            {moment(customer.created_at).format("DD-MM-YYYY")}
                        </Descriptions.Item>
                    </Descriptions>
                </div>
            </div>
        </Modal>
    )
}