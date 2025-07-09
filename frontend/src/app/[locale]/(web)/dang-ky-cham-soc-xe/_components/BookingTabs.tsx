import React from "react";
import clsx from "clsx";

type BookingTabsProps = {
  value: string;
  onChange: (key: string) => void;
};

const tabs = [
  { key: "store", label: "Đặt lịch tại cửa hàng" },
  { key: "pickup", label: "Tiếp nhận xe tận nơi" },
];

export default function BookingTabs({ value, onChange }: BookingTabsProps) {
  return (
    <div className="flex bg-gray-100 rounded-lg p-1 mb-6 border border-gray-200">
      {tabs.map((tab) => {
        const isActive = value === tab.key;

        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={clsx(
              "flex-1 px-4 py-2 text-sm md:text-base rounded-md font-medium transition-colors duration-200 mx-1 cursor-pointer",
              isActive
                ? "bg-white text-black border border-gray-300"
                : "bg-transparent text-gray-600 hover:bg-gray-200"
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
