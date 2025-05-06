"use client";
import { SlidersVertical, User } from "lucide-react";

const technicians = Array(8).fill("nguyenvana@gmail.com");

export default function TechnicianList() {
  return (
    <div className="h-full border border-[#E8E8E8] rounded-lg  flex flex-col bg-white">
      <div className="p-6">
        <span className="font-semibold mb-6 text-lg !p-0 !m-0">
          Kỹ thuật viên
        </span>
        <ul className="space-y-4 mt-8">
          {technicians.map((email, idx) => (
            <li
              key={idx}
              className="flex items-center justify-between -[15px] text-[#333]"
            >
              <div className="flex items-center gap-8">
                <span className="rounded-full p-1 border border-[#E8E8E8]">
                  <User size={30} />
                </span>
                <span className="font-semibold ">{email}</span>
              </div>
              <SlidersVertical size={30} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
