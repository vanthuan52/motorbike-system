import React from "react";
import { DatePicker, ConfigProvider, Select } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import viVN from "antd/es/date-picker/locale/vi_VN";

const { Option } = Select;
const { RangePicker } = DatePicker;

// Hook kiểm tra mobile
function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

interface Props {
  statusFilter: string;
  setStatusFilter: (v: string) => void;
  orderDateFrom: string;
  setOrderDateFrom: (v: string) => void;
  orderDateTo: string;
  setOrderDateTo: (v: string) => void;
  shipDateFrom: string;
  setShipDateFrom: (v: string) => void;
  shipDateTo: string;
  setShipDateTo: (v: string) => void;
  setPage: (v: number) => void;
}

export default function PurchaseFilter({
  statusFilter,
  setStatusFilter,
  orderDateFrom,
  setOrderDateFrom,
  orderDateTo,
  setOrderDateTo,
  shipDateFrom,
  setShipDateFrom,
  shipDateTo,
  setShipDateTo,
  setPage,
}: Props) {
  const isMobile = useIsMobile();

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#000",
          colorBgContainer: "#fff",
          colorText: "#000",
          colorBorder: "#ccc",
        },
        components: {
          DatePicker: {
            colorPrimary: "#000",
            colorText: "#000",
            colorBgContainer: "#fff",
            colorBorder: "#ccc",
            borderRadius: 6,
            colorIcon: "#000",
          },
          Select: {
            colorPrimary: "#000",
            colorText: "#000",
            colorBgContainer: "#fff",
            colorBorder: "#ccc",
            borderRadius: 8,
            colorTextPlaceholder: "#999",
            colorBgElevated: "#fff",
            optionSelectedBg: "#f0f0f0",
            optionSelectedColor: "#000",
            optionActiveBg: "#f5f5f5",
          },
          Input: {
            colorText: "#000",
            colorBorder: "#ccc",
            colorBgContainer: "#fff",
            borderRadius: 6,
          },
          Button: {
            colorPrimary: "#000",
            colorText: "#fff",
            colorBgContainer: "#000",
            borderRadius: 6,
          },
        },
      }}
    >
      <div className="bg-white rounded-xl shadow flex flex-col gap-4 p-4 mb-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-2 w-full">
            <label className="text-base font-medium text-gray-700">
              Trạng thái
            </label>
            <Select
              value={statusFilter}
              onChange={(v) => {
                setStatusFilter(v);
                setPage(1);
              }}
              size="large"
              className="w-full"
              popupMatchSelectWidth={false}
            >
              <Option value="all">Tất cả</Option>
              <Option value="delivered">Đã giao</Option>
              <Option value="pending">Đang xử lý</Option>
              <Option value="cancelled">Đã hủy</Option>
            </Select>
          </div>

          {/* Ngày đặt */}
          <div className="flex flex-col gap-2 w-full">
            <label className="text-base font-medium text-gray-700">
              Ngày đặt
            </label>
            {isMobile ? (
              <div className="flex gap-2">
                <DatePicker
                  value={orderDateFrom ? dayjs(orderDateFrom) : null}
                  onChange={(date) => {
                    setOrderDateFrom(date ? date.format("YYYY-MM-DD") : "");
                    setPage(1);
                  }}
                  format="DD/MM/YYYY"
                  size="large"
                  className="w-full"
                  placeholder="Từ ngày"
                  locale={viVN}
                  style={{ width: "100%" }}
                />
                <DatePicker
                  value={orderDateTo ? dayjs(orderDateTo) : null}
                  onChange={(date) => {
                    setOrderDateTo(date ? date.format("YYYY-MM-DD") : "");
                    setPage(1);
                  }}
                  format="DD/MM/YYYY"
                  size="large"
                  className="w-full"
                  placeholder="Đến ngày"
                  locale={viVN}
                  style={{ width: "100%" }}
                />
              </div>
            ) : (
              <RangePicker
                value={
                  orderDateFrom && orderDateTo
                    ? [dayjs(orderDateFrom), dayjs(orderDateTo)]
                    : [
                        orderDateFrom ? dayjs(orderDateFrom) : null,
                        orderDateTo ? dayjs(orderDateTo) : null,
                      ]
                }
                onChange={(dates) => {
                  setOrderDateFrom(dates?.[0]?.format("YYYY-MM-DD") || "");
                  setOrderDateTo(dates?.[1]?.format("YYYY-MM-DD") || "");
                  setPage(1);
                }}
                format="DD/MM/YYYY"
                size="large"
                className="w-full"
                placeholder={["Từ ngày", "Đến ngày"]}
                locale={viVN}
                style={{ width: "100%" }}
              />
            )}
          </div>

          {/* Ngày giao */}
          <div className="flex flex-col gap-2 w-full">
            <label className="text-base font-medium text-gray-700">
              Ngày giao
            </label>
            {isMobile ? (
              <div className="flex gap-2">
                <DatePicker
                  value={shipDateFrom ? dayjs(shipDateFrom) : null}
                  onChange={(date) => {
                    setShipDateFrom(date ? date.format("YYYY-MM-DD") : "");
                    setPage(1);
                  }}
                  format="DD/MM/YYYY"
                  size="large"
                  className="w-full"
                  placeholder="Từ ngày"
                  locale={viVN}
                  style={{ width: "100%" }}
                />
                <DatePicker
                  value={shipDateTo ? dayjs(shipDateTo) : null}
                  onChange={(date) => {
                    setShipDateTo(date ? date.format("YYYY-MM-DD") : "");
                    setPage(1);
                  }}
                  format="DD/MM/YYYY"
                  size="large"
                  className="w-full"
                  placeholder="Đến ngày"
                  locale={viVN}
                  style={{ width: "100%" }}
                />
              </div>
            ) : (
              <RangePicker
                value={
                  shipDateFrom && shipDateTo
                    ? [dayjs(shipDateFrom), dayjs(shipDateTo)]
                    : [
                        shipDateFrom ? dayjs(shipDateFrom) : null,
                        shipDateTo ? dayjs(shipDateTo) : null,
                      ]
                }
                onChange={(dates) => {
                  setShipDateFrom(dates?.[0]?.format("YYYY-MM-DD") || "");
                  setShipDateTo(dates?.[1]?.format("YYYY-MM-DD") || "");
                  setPage(1);
                }}
                format="DD/MM/YYYY"
                size="large"
                className="w-full"
                placeholder={["Từ ngày", "Đến ngày"]}
                locale={viVN}
                style={{ width: "100%" }}
              />
            )}
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
}
