"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { blogs } from "@/data/BlogsData";
import { comments as allComments } from "@/data/CommentsData";
import BlogContent from "./components/BlogContent";
import TableOfContents from "./components/TableOfContents";
import RelatedBlogs from "./components/RelatedBlogs";
import CommentsList from "./components/CommentsList";
import CommentForm from "./components/CommentForm";
import SharingContent from "./components/SharingContent";

export default function BlogDetails() {
  const { id } = useParams();
  const blog = blogs.find((b) => b.id === Number(id));
  const comments = allComments.filter((c) => c.blogId === Number(id));
  const [form, setForm] = useState({ name: "", email: "", content: "" });
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Submitted comment:", form);
  };
  if (!blog) return <div>Không tìm thấy bài viết.</div>;

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-6 sm:py-10 ">
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-0 lg:gap-8">
        <div className="lg:col-span-7 col-span-1">
          <BlogContent blog={blog} />
        </div>
        <div className="lg:col-span-3 col-span-1 mt-8 lg:mt-0">
          <TableOfContents sections={blog?.blogDetails?.sections || []} />
        </div>
      </div>
      <SharingContent blog={blog} />
      <RelatedBlogs relatedBlogs={blog?.relatedBlogs || []} />
      <CommentsList comments={comments} />
      <CommentForm form={form} setForm={setForm} handleSubmit={handleSubmit} />
    </div>
  );
}
