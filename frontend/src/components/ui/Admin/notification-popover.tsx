import React from "react";

const NotificationPopover = () => {
  return (
    <div className="absolute right-0 mt-4 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-50">
      <div className="px-4 py-3">
        <p className="text-sm">Neil Sims</p>
        <p className="text-sm font-medium truncate">neil.sims@flowbite.com</p>
      </div>
      <div className="border-t border-gray-100" />
      <ul className="py-1 text-sm text-gray-700">
        <li>
          <button className="w-full text-left px-4 py-2 hover:bg-gray-100">
            Dashboard
          </button>
        </li>
        <li>
          <button className="w-full text-left px-4 py-2 hover:bg-gray-100">
            Settings
          </button>
        </li>
        <li>
          <button className="w-full text-left px-4 py-2 hover:bg-gray-100">
            Earnings
          </button>
        </li>
      </ul>
      <div className="border-t border-gray-100" />
      <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
        Sign out
      </button>
    </div>
  );
};

export default NotificationPopover;
