"use client";

import { useEffect, useState } from "react";
import { ColumnsType } from "antd/es/table";
import { Button, Popconfirm, Tag, Tooltip } from "antd";
import { mockDataTableManageCustomers } from "@/modules/customer-management/mocks/customer-data";
import { PageHeading } from "@/components/page-heading";
import { SearchInput } from "@/components/ui/search-input";
import Table from "@/components/ui/table/table";
import SelectField from "@/components/ui/select-field";
import { Link, useNavigate } from "react-router-dom";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import SkeletonTable from "@/components/ui/SkeletonTable";
import { toast } from "react-toastify";

const ROUTER_PATH = {
  CUSTOMERS: "/customers",
};

export default function Customers() {
  const navigate = useNavigate();
  const [dataSource, setDataSource] = useState(mockDataTableManageCustomers);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [payload, setPayload] = useState({
    gender: "Tất cả",
  });

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      setDataSource(mockDataTableManageCustomers);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    let filtered = [...mockDataTableManageCustomers];

    if (searchText) {
      filtered = filtered.filter(item =>
        (item.first_name ?? "").toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (payload.gender !== "Tất cả") {
      filtered = filtered.filter(
        item => item.gender === (payload.gender === "Nam" ? "MALE" : "FEMALE")
      );
    }

    setDataSource(filtered);
  }, [searchText, payload.gender]);

  const openEdit = (record: (typeof mockDataTableManageCustomers)[0]) => {
    navigate(`/customers/${record.id}?edit=1`);
  };

  const handleDelete = (id: string) => {
    setDataSource(prev => prev.filter(item => item.id !== id));
    toast.success("Xóa khách hàng thành công!");
  };
  const columns: ColumnsType<(typeof mockDataTableManageCustomers)[0]> = [
    {
      title: "STT",
      dataIndex: "id",
      key: "id",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Họ tên",
      dataIndex: "name",
      key: "name",
      render: (_, record) => `${record.first_name} ${record.last_name}`,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      render: (_, record) => (record.gender === "MALE" ? "Nam" : "Nữ"),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (_, record) => (
        <span>
          {record.status === "ACTIVE" && <Tag color='green'>Còn hoạt động</Tag>}
          {record.status === "INACTIVE" && (
            <Tag color='yellow'>Không còn hoạt động</Tag>
          )}
        </span>
      ),
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Hành động",
      dataIndex: "action",
      key: "action",
      render: (_, record) => (
        <div className='flex items-center justify-center gap-1'>
          <Tooltip title='Xem chi tiết'>
            <Link to={`${ROUTER_PATH.CUSTOMERS}/${record.id}`}>
              <Button icon={<EyeOutlined />} size='small' />
            </Link>
          </Tooltip>
          <Tooltip title='Chỉnh sửa'>
            <Button
              icon={<EditOutlined />}
              size='small'
              onClick={() => openEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title='Bạn chắc chắn muốn xóa khách hàng này?'
            onConfirm={() => handleDelete(record.id)}
            okText='Xóa'
            cancelText='Hủy'
          >
            <Tooltip title='Xóa'>
              <Button icon={<DeleteOutlined />} size='small' danger />
            </Tooltip>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className='sm:px-4'>
      <PageHeading title='Danh sách khách hàng' disabledButton />
      <div className='bg-white rounded-lg p-4 border border-gray-200'>
        <div className='mb-4 flex gap-4 max-h-[40px] w-full'>
          <SearchInput onChange={setSearchText} />
          <SelectField
            value={payload.gender}
            onChange={e => setPayload({ ...payload, gender: e.target.value })}
            options={["Tất cả", "Nam", "Nữ"]}
            optionLabel='Giới tính'
            rootClass='!w-[200px]'
          />
        </div>

        {loading ? (
          <SkeletonTable
            columns={[
              { title: "STT", width: 100, height: 50 },
              { title: "Họ tên", width: 100, height: 50 },
              { title: "Email", width: 100, height: 50 },
              { title: "Số điện thoại", width: 100, height: 50 },
              { title: "Giới tính", width: 100, height: 50 },
              { title: "Trạng thái", width: 100, height: 50 },
              { title: "Địa chi", width: 100, height: 50 },
              { title: "Hành động", width: 100, height: 50 },
            ]}
            rows={5}
          />
        ) : (
          <Table
            dataSource={dataSource}
            columns={columns}
            rowKey='id'
            pagination={{ pageSize: 5 }}
          />
        )}
      </div>
    </div>
  );
}
