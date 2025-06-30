"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getProvinces, getDistricts, getWards } from "vietnam-provinces";
import { UserProfile } from "@/features/user/types";

interface ProfileUpdateFormProps {
  user: UserProfile | null;
}

export default function ProfileUpdateForm({ user }: ProfileUpdateFormProps) {
  const [provinces, setProvinces] = useState<{ name: string; code: string }[]>(
    []
  );
  const [districts, setDistricts] = useState<{ name: string; code: string }[]>(
    []
  );
  const [wards, setWards] = useState<{ name: string; code: string }[]>([]);

  const [selectedProvince, setSelectedProvince] = useState(user?.city ?? "");
  const [selectedDistrict, setSelectedDistrict] = useState(
    user?.district ?? ""
  );
  const [selectedWard, setSelectedWard] = useState(user?.ward ?? "");

  useEffect(() => {
    const provs = getProvinces();
    setProvinces(provs);
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      const dists = getDistricts(selectedProvince);
      setDistricts(dists);
    } else {
      setDistricts([]);
    }
    setSelectedDistrict("");
    setWards([]);
    setSelectedWard("");
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedDistrict) {
      const ws = getWards(selectedDistrict);
      setWards(ws);
    } else {
      setWards([]);
    }
    setSelectedWard("");
  }, [selectedDistrict]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    toast("Cập nhật thành công");
  };

  return (
    <div className="mt-10 bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-6 text-violet-700">
        Cập nhật hồ sơ
      </h2>
      <form
        className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        onSubmit={handleSubmit}
        noValidate
      >
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            <span className="text-red-500">*</span> Họ và tên
          </label>
          <input
            type="text"
            defaultValue={user?.name ?? ""}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
            required
            name="first_name"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block mb-1 font-medium text-gray-700">
            <span className="text-red-500">*</span> Email
          </label>
          <input
            type="email"
            defaultValue={user?.email ?? ""}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
            required
            name="email"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">
            <span className="text-red-500">*</span> Số điện thoại
          </label>
          <input
            type="tel"
            defaultValue={user?.phone ?? ""}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
            required
            name="phone"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">
            <span className="text-red-500">*</span> Giới tính
          </label>
          <select
            defaultValue={user?.gender ?? ""}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
            required
            name="gender"
          >
            <option value="">-- Chọn giới tính --</option>
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
            <option value="other">Khác</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">
            <span className="text-red-500">*</span> Ngày sinh
          </label>
          <input
            type="date"
            defaultValue={user?.dob ?? ""}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
            required
            name="dob"
          />
        </div>

        <div className="sm:col-span-2"></div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">
            <span className="text-red-500">*</span> Thành phố
          </label>
          <select
            value={selectedProvince}
            onChange={(e) => setSelectedProvince(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
            required
            name="city"
          >
            <option value="">-- Chọn thành phố --</option>
            {provinces.map((p) => (
              <option key={p.code} value={p.code}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">
            <span className="text-red-500">*</span> Quận/Huyện
          </label>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
            required
            name="district"
            disabled={!districts.length}
          >
            <option value="">-- Chọn quận/huyện --</option>
            {districts.map((d) => (
              <option key={d.code} value={d.code}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">
            <span className="text-red-500">*</span> Phường/Xã
          </label>
          <select
            value={selectedWard}
            onChange={(e) => setSelectedWard(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
            required
            name="ward"
            disabled={!wards.length}
          >
            <option value="">-- Chọn phường/xã --</option>
            {wards.map((w) => (
              <option key={w.code} value={w.code}>
                {w.name}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="block mb-1 font-medium text-gray-700">
            <span className="text-red-500">*</span> Địa chỉ cụ thể
          </label>
          <input
            type="text"
            defaultValue={user?.address ?? ""}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
            required
            name="address"
          />
        </div>

        <div className="sm:col-span-2 text-right">
          <button
            type="submit"
            className="px-6 py-2 rounded bg-violet-600 text-white font-semibold hover:bg-violet-700 transition"
          >
            Cập nhật
          </button>
        </div>
      </form>
    </div>
  );
}
