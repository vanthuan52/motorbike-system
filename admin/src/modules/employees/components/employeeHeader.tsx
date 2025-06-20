import React from "react";

export class EmployeeHeader extends React.PureComponent<{
  firstName: string;
  lastName: string;
  status: string;
}> {
  render() {
    const { firstName, lastName, status } = this.props;
    return (
      <div className="text-center md:text-left">
        <h2 className="text-2xl md:text-3xl font-semibold">
          {firstName} {lastName}
        </h2>
        <div className="flex items-center justify-center md:justify-start mt-1 gap-2">
          <span
            className={`inline-block w-3 h-3 rounded-full ${
              status === "ACTIVE" ? "bg-green-500" : "bg-red-500"
            }`}
          ></span>
          <span className="text-sm text-gray-700">
            {status === "ACTIVE"
              ? "Đang hoạt động"
              : status === "INACTIVE"
                ? "Không hoạt động"
                : "Đã bị khóa"}
          </span>
        </div>
      </div>
    );
  }
}
export default EmployeeHeader;
