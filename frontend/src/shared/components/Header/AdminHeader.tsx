"use client";
import React, { useState, useRef, useEffect } from "react";
import { Bell, User } from "lucide-react";

const AdminHeader: React.FC = () => {
  const [userOpen, setUserOpen] = useState(false);
  const [notiOpen, setNotiOpen] = useState(false);
  const userRef = useRef<HTMLDivElement>(null);
  const notiRef = useRef<HTMLDivElement>(null);

  // Close dropdown when click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        userRef.current &&
        !userRef.current.contains(e.target as Node) &&
        notiRef.current &&
        !notiRef.current.contains(e.target as Node)
      ) {
        setUserOpen(false);
        setNotiOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 z-50 w-[calc(100%-256px)] bg-white border-b border-[#E8E8E8] px-4 py-3 flex justify-end">
      <div className="flex items-center gap-4">
        {/* User Dropdown */}
        <div className="relative" ref={userRef}>
          <button
            onClick={() => {
              setUserOpen(!userOpen);
              setNotiOpen(false);
            }}
            className="rounded-full p-1 border border-[#E8E8E8] hover:bg-gray-100 transition"
          >
            <User size={20} />
          </button>
          {userOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-50">
              <div className="px-4 py-3">
                <p className="text-sm">Neil Sims</p>
                <p className="text-sm font-medium truncate">
                  neil.sims@flowbite.com
                </p>
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
          )}
        </div>

        {/* Notification Dropdown */}
        <div className="relative" ref={notiRef}>
          <button
            onClick={() => {
              setNotiOpen(!notiOpen);
              setUserOpen(false);
            }}
            className="rounded-full p-1 hover:bg-gray-100 transition"
          >
            <Bell size={20} />
          </button>
          {notiOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-50">
              <div className="px-4 py-3">
                <p className="text-sm">Neil Sims</p>
                <p className="text-sm font-medium truncate">
                  neil.sims@flowbite.com
                </p>
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
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
