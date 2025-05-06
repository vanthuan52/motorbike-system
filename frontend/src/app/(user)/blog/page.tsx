"use client";
import { useState } from "react";
import Image from "next/image";
import { blogs } from "@/data/BlogsData";
import { X } from "lucide-react";
import Link from "next/link";

/**
 * Hiển thị thành phần trang Blog hiển thị một tập hợp các bài đăng blog.
 *
 * Thành phần này cho phép người dùng lọc các bài đăng blog theo thẻ và xem
 * thông tin chi tiết của bài đăng blog, chẳng hạn như tiêu đề, mô tả, tác giả
 * và ngày. Thành phần duy trì trạng thái cho bộ lọc thẻ đã chọn và cập nhật
 * động danh sách các bài đăng blog được hiển thị dựa trên thẻ đã chọn.
 *
 * Tính năng:
 * - Hiển thị danh sách các thẻ duy nhất để lọc các bài đăng blog.
 * - Hỗ trợ chọn một thẻ để lọc và hiển thị các bài đăng blog liên quan.
 * - Hiển thị chi tiết cho bài đăng blog đầu tiên và tóm tắt cho các bài khác.
 * - Sử dụng thiết kế đáp ứng để thích ứng với các kích thước màn hình khác nhau.
 *
 * Trạng thái:
 * - `selectedTag`: Một chuỗi đại diện cho thẻ hiện tại được chọn để lọc.
 *
 * Trả về:
 * - Một thành phần React hiển thị giao diện trang blog.
 */

export default function BlogPage() {
  const [selectedTag, setSelectedTag] = useState("Tất cả");

  const uniqueTags = ["Tất cả", ...new Set(blogs.map((blog) => blog.tag))];

  const filteredBlogs =
    selectedTag === "Tất cả"
      ? blogs
      : blogs.filter((blog) => blog.tag === selectedTag);

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6 lg:px-6 lg:py-10">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-[30px]">
        <h1 className="text-[64px] font-bold mb-2">Blog</h1>
        <p className="text-gray-600 text-2xl">
          Chia sẻ kiến thức xe máy, kết nối đam mê kỹ thuật
        </p>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-3 mb-8">
        {uniqueTags.map((tag, idx) => {
          const isActive = tag === selectedTag;
          return (
            <button
              key={idx}
              onClick={() =>
                isActive ? setSelectedTag("Tất cả") : setSelectedTag(tag)
              }
              className={`flex items-center gap-2 px-4 py-1.5 rounded-[20px] border text-sm font-medium transition-all duration-200 shadow-sm cursor-pointer
          ${
            isActive
              ? "bg-[#FEDCB7] text-black border-[#FB7B0D] hover:bg-orange-600"
              : "bg-white text-gray-600 border-gray-300 hover:border-orange-400 hover:text-orange-500"
          }`}
            >
              {tag}
              {isActive && (
                <span className="p-1 rounded-full bg-[#FB7B0D] flex items-center justify-center">
                  <X size={14} className="text-white" />
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col lg:flex-row gap-6 mb-10">
        {/* Bài 1 */}
        {filteredBlogs[0] && (
          <Link
            href={`/blog/${filteredBlogs[0].id}`}
            className="w-full flex flex-col lg:w-1/2 cursor-pointer group rounded-[30px] overflow-hidden transition-all duration-300 hover:scale-95 bg-white hover:bg-[#FFECDA]"
          >
            <div className="relative w-full h-64 lg:h-80">
              <Image
                src={filteredBlogs[0].image}
                alt="Blog"
                layout="fill"
                objectFit="cover"
                className="rounded-[30px] transition-all duration-300 group-hover:p-2"
                priority
              />
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <Image
                  src={filteredBlogs[0].avatar}
                  alt="Avatar"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <span className="font-medium text-black">
                  {filteredBlogs[0].author}
                </span>
                <span className="rounded-full h-2 w-2 bg-gray-400"></span>
                <span>{filteredBlogs[0].date}</span>
                <span className="rounded-full h-2 w-2 bg-gray-400"></span>
                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                  {filteredBlogs[0].tag}
                </span>
              </div>
              <h2 className="font-semibold text-base mb-2">
                {filteredBlogs[0].title}
              </h2>
              <p className="text-sm text-gray-600">
                {filteredBlogs[0].description}
              </p>
            </div>
          </Link>
        )}

        {/* Bài 2 & 3 */}
        <div className="w-full lg:w-1/2 grid sm:grid-cols-2 lg:flex lg:flex-col gap-4">
          {filteredBlogs.slice(1, 3).map((blog, index) => (
            <Link
              href={`/blog/${blog.id}`}
              key={index}
              className="group flex flex-col md:flex-row overflow-hidden rounded-[30px] bg-white hover:bg-[#FFECDA] transition-all duration-300 hover:scale-95 cursor-pointer"
            >
              {/* Image section */}
              <div className="relative w-full md:w-3/5 h-44 lg:h-60">
                <Image
                  src={blog.image}
                  alt="Blog"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-[30px] transition-transform duration-300 group-hover:scale-95"
                />
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col justify-between w-full">
                <div>
                  <div className="flex items-center flex-wrap gap-2 text-sm text-gray-500 mb-2">
                    <Image
                      src={blog.avatar}
                      alt="Avatar"
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <span className="font-medium text-black">
                      {blog.author}
                    </span>
                    <span className="h-1 w-1 bg-gray-400 rounded-full" />
                    <span>{blog.date}</span>
                    <span className="h-1 w-1 bg-gray-400 rounded-full" />
                    <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                      {blog.tag}
                    </span>
                  </div>
                  <h2 className="font-semibold text-base mb-1">
                    {blog.shortTitle}
                  </h2>
                  <p className="text-sm text-gray-600 line-clamp-4">
                    {blog.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Các bài còn lại */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredBlogs.slice(3).map((blog, index) => (
          <Link
            href={`/blog/${blog.id}`}
            key={index}
            className="cursor-pointer group rounded-[30px] overflow-hidden transition-all duration-300 hover:scale-95 bg-white hover:bg-[#FFECDA]"
          >
            <div className="relative w-full h-44">
              <Image
                src={blog.image}
                alt="Blog"
                layout="fill"
                objectFit="cover"
                className="rounded-[30px] transition-all duration-300 group-hover:p-2"
              />
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <Image
                  src={blog.avatar}
                  alt="Avatar"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <span className="font-medium text-black">{blog.author}</span>
                <span className="rounded-full h-2 w-2 bg-gray-400"></span>
                <span>{blog.date}</span>
                <span className="rounded-full h-2 w-2 bg-gray-400"></span>
                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                  {blog.tag}
                </span>
              </div>
              <h2 className="font-semibold text-base mb-2">
                {blog.shortTitle}
              </h2>
              <p className="text-sm text-gray-600 line-clamp-4">
                {blog.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
