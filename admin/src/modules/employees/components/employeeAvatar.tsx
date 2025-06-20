import React from "react";
import { Avatar } from "antd";
import { CameraOutlined, UserOutlined } from "@ant-design/icons";

export class EmployeeAvatar extends React.PureComponent<{ photo?: string }> {
  render() {
    return (
      <div className="relative">
        <Avatar
          size={120}
          icon={<UserOutlined />}
          src={this.props.photo}
          className="border border-gray-300"
        />
        <div
          className="absolute bottom-1 right-1 bg-gray-300 rounded-full p-2 shadow hover:bg-gray-400 cursor-pointer flex items-center justify-center"
          title="Đổi ảnh đại diện"
        >
          <CameraOutlined className="text-gray-600 text-base" />
        </div>
      </div>
    );
  }
}
export default EmployeeAvatar;
