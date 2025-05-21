import React, { useState } from 'react';
import { Form, InputNumber, Input, Button } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';

type Props = {
  label: string;
  name: string;
  disabled?: boolean;
};

export default function PartInputWithToggleNote({
  label,
  name,
  disabled,
}: Props) {
  const [showNote, setShowNote] = useState(false);

  return (
    <div >
      <Form.Item
        label={
          <div className='w-20 text-left text-lg'>{label}</div>
        }
        labelCol={{ flex: 'none' }}
        wrapperCol={{ flex: 1 }}
        style={{ marginBottom: 16 }}
          name={name}
        colon={false}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Form.Item name={name} noStyle>
            <InputNumber
              disabled={disabled}
              style={{ width: '100%' }}
              type='number'
              addonAfter="%"
              placeholder={"Nhập phần trăm của " + label.toLocaleLowerCase()}
              size='large'
            />
          </Form.Item>
          <Button
            type="text"
            icon={showNote ? <UpOutlined /> : <DownOutlined />}
            onClick={() => setShowNote((prev) => !prev)}
          />
        </div>
      </Form.Item>
        {showNote && (
          <Form.Item name={`${name}_note`} className='my-2 !mr-10 !ml-[94px]' labelCol={{ flex: 'none' }} wrapperCol={{ flex: 1 }} colon={false}>
            <Input.TextArea rows={2} placeholder="Ghi chú"  style={{ width: '100%' }} size='large'/>
          </Form.Item>
        )}
    </div>
  );
}