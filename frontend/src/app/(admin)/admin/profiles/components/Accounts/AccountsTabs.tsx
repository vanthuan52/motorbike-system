/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useRef } from "react";
import ProfileForm from "./ProfileForm";
import TimezoneForm from "./TimezoneForm";
import JobForm from "./JobForm";
import { toast } from "react-toastify";

type props = {
  avatar: string | null;
  setAvatar: React.Dispatch<React.SetStateAction<string | null>>;
};

export default function AccountsTabs({ avatar, setAvatar }: props) {
  const profileFormRef = useRef<any>(null);
  const timezoneFormRef = useRef<any>(null);
  const jobFormRef = useRef<any>(null);

  const handleSubmit = async () => {
    const profileValues = await profileFormRef.current?.validateFields();
    const timezoneValues = await timezoneFormRef.current?.validateFields();
    const jobValues = await jobFormRef.current?.validateFields();

    const allValues = {
      ...profileValues,
      ...timezoneValues,
      ...jobValues,
      photo: avatar,
    };
    toast.success("Cập nhật cài đặt tài khoản thành công");
    console.log("Tất cả giá trị:", allValues);
  };

  return (
    <div className="space-y-6 sm:space-y-8 my-6">
      <ProfileForm ref={profileFormRef} avatar={avatar} setAvatar={setAvatar} />
      <hr className="border-gray-200" />
      <TimezoneForm ref={timezoneFormRef} />
      <hr className="border-gray-200" />
      <JobForm ref={jobFormRef} />
      <div className="flex justify-end pb-4 sm:pb-0 px-2">
        <button
          type="button"
          className="px-6 py-2 bg-black text-white rounded-md font-medium hover:bg-gray-800 transition cursor-pointer"
          onClick={handleSubmit}
        >
          Lưu thay đổi
        </button>
      </div>
    </div>
  );
}
