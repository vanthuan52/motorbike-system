"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { blogs } from "@/data/BlogsData";
import { comments as allComments } from "@/data/CommentsData";
import BlogContent from "@/app/[locale]/(web)/blog/[slug]/_components/BlogContent";
import BlogNotFound from "./BlogNotFound";
import TableOfContents from "./TableOfContents";
import SharingContent from "./SharingContent";
import RelatedBlogs from "./RelatedBlogs";
import CommentsList from "./CommentsList";
import CommentForm from "./CommentForm";

export default function BlogDetailsPage() {
  const { slug } = useParams();
  const blog = blogs.find((b) => b.slug === `/blog/${slug}`);
  const comments = blog ? allComments.filter((c) => c.blogId === blog.id) : [];
  const [form, setForm] = useState({ name: "", email: "", content: "" });
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };
  if (!blog) return <BlogNotFound />;

  return (
    <div className="w-full mt-10">
      <div className="container mx-auto">
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
        <CommentForm
          form={form}
          setForm={setForm}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
