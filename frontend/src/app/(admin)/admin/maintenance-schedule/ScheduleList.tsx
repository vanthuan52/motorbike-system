'use client';

import React, { useEffect, useState } from 'react';
import { Button, Skeleton, message, Popconfirm, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import { mockScheduleList, ScheduleType } from './data/mockSchedule';
import ScheduleAssignModal from './ScheduleAssignModal';
import ScheduleDetailModal from './ScheduleDetailModal';
import { PageHeaderReuse } from '@/components/ui/Admin/PageHeaderReuse';
import { SearchInputReuse } from '@/components/ui/SearchInputReuse';
import TableReuse from '@/components/ui/Table/Table';
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

export default function ScheduleList() {
  const [dataSource, setDataSource] = useState<ScheduleType[]>([]);
  const [loading, setLoading] = useState(true);
  const [assignVisible, setAssignVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [selected, setSelected] = useState<ScheduleType | null>(null);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDataSource(mockScheduleList);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const openCreate = () => {
    setIsEdit(false);
    setSelected(null);
    setAssignVisible(true);
  };

  const openEdit = (record: ScheduleType) => {
    setIsEdit(true);
    setSelected(record);
    setAssignVisible(true);
  };

  const openDetail = (record: ScheduleType) => {
    setSelected(record);
    setDetailVisible(true);
  };

  const handleDelete = (id: number) => {
    setDataSource(prev => prev.filter(item => item.id !== id));
    message.success('Xóa lịch bảo dưỡng thành công');
  };

  const handleAssignSubmit = (values: ScheduleType) => {
    if (isEdit && selected) {
      setDataSource(prev => prev.map(item => item.id === selected.id ? values : item));
      message.success('Cập nhật lịch bảo dưỡng thành công');
    } else {
      const newId = Math.max(...dataSource.map(d => d.id), 0) + 1;
      setDataSource(prev => [...prev, { ...values, id: newId }]);
      message.success('Tạo lịch bảo dưỡng mới thành công');
    }
    setAssignVisible(false);
  };

  const columns: ColumnsType<ScheduleType> = [
    { title: 'ID', dataIndex: 'id', key: 'id', render: (_,__,i) => i+1 },
    { title: 'Khách hàng', dataIndex: 'customer', key: 'customer' },
    { title: 'SĐT', dataIndex: 'phone', key: 'phone' },
    { title: 'Nhân viên', dataIndex: ['staff','name'], key: 'staff' },
    { title: 'Ngày', dataIndex: 'schedule_date', key: 'schedule_date', render: d => moment(d).format('DD-MM-YYYY') },
    { title: 'Khung giờ', dataIndex: 'time_slot', key: 'time_slot' },
    { title: 'Trạng thái', dataIndex: 'status', key: 'status', render: s => s ? 'Hoàn thành' : 'Đang chờ' },
    { title: 'Hành động', key: 'action', render: (_, record) => (
        <>
          <Tooltip title="Chi tiết" className='mr-1'>
            <Button
              icon={<EyeOutlined />}
              onClick={() => openDetail(record)}
            />
          </Tooltip>

          <Tooltip title="Sửa" className='mr-1'>
            <Button
              icon={<EditOutlined />}
              onClick={() => openEdit(record)}
            />
          </Tooltip>

          <Popconfirm
            title="Xác nhận xóa?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Tooltip title="Xóa">
              <Button
                icon={<DeleteOutlined />}
                danger
              />
            </Tooltip>
          </Popconfirm>
        </>
      )
    }
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <PageHeaderReuse
          title="Quản lý lịch bảo dưỡng"
          onClickAdd={openCreate}
          addButtonLabel="Tạo lịch bảo dưỡng"
        />
      </div>

      <SearchInputReuse
        onChange={(text) =>
          setDataSource(
            mockScheduleList.filter((item) =>
              item.customer.toLowerCase().includes(text.toLowerCase())
            )
          )
        }
      />
      {loading ? (
        <Skeleton active paragraph={{ rows: 5 }} />
      ) : (
        <TableReuse columns={columns} dataSource={dataSource} rowKey="id" pagination={{ pageSize: 5 }} />
      )}

      <ScheduleAssignModal
        visible={assignVisible}
        mode={isEdit ? 'edit' : 'create'}
        initialData={selected}
        onCancel={() => setAssignVisible(false)}
        onSubmit={handleAssignSubmit}
      />

      <ScheduleDetailModal
        visible={detailVisible}
        data={selected}
        onCancel={() => setDetailVisible(false)}
      />
    </div>
  );
}