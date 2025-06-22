"use client";
import { useState } from "react";
import { blogs } from "@/data/BlogsData";
import BlogHeader from "@/app/[locale]/(user)/blog/_components/BlogHeader";
import BlogFilter from "@/app/[locale]/(user)/blog/_components/BlogFilter";
import BlogCard from "@/app/[locale]/(user)/blog/_components/BlogCard";
import { useTranslations } from "next-intl";
export default function BlogPage() {
  const t = useTranslations("blogPage.filter");
  const [selectedTag, setSelectedTag] = useState(t("all"));
  const uniqueTags = [t("all"), ...new Set(blogs.map((blog) => blog.tag))];
  const filteredBlogs =
    selectedTag === t("all")
      ? blogs
      : blogs.filter((blog) => blog.tag === selectedTag);

  return (
    <div className="w-full bg-white">
      <BlogHeader />
      <BlogFilter
        uniqueTags={uniqueTags}
        selectedTag={selectedTag}
        setSelectedTag={setSelectedTag}
      />
      <section className="bg-white py-5">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 mb-10">
            {filteredBlogs[0] && (
              <BlogCard blog={filteredBlogs[0]} variant="main" />
            )}
            <div className="w-full lg:w-1/2 grid sm:grid-cols-2 lg:flex lg:flex-col gap-4">
              {filteredBlogs.slice(1, 3).map((blog, index) => (
                <BlogCard blog={blog} variant="secondary" key={index} />
              ))}
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredBlogs.slice(3).map((blog, index) => (
              <BlogCard blog={blog} key={index} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
