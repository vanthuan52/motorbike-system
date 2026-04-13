"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  Eye,
  MessageCircle,
  Clock,
  Share2,
  Link2,
  ThumbsUp,
  User,
  AtSign,
  Send,
  ChevronRight,
  List,
} from "lucide-react";

import { blogs } from "@/data/BlogsData";
import { comments as allComments } from "@/data/CommentsData";
import { tags } from "@/data/TagsData";
import { TRANSLATION_FILES } from "@/lib/i18n";
import Breadcrumbs, { BreadcrumbItem } from "@/components/ui/Breadcrumbs";
import BlogCard from "./blog-card";

/* ── Types ── */
interface BlogSection {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  recommendations?: string[];
  subsections?: { subtitle: string; bullets: string[] }[];
  quotes?: string[];
}

export default function BlogDetailsPage() {
  const { slug } = useParams();
  const t = useTranslations(TRANSLATION_FILES.BLOG_PAGE);
  const blog = blogs.find((b) => b.slug === `/blog/${slug}`);
  const comments = blog
    ? allComments.filter((c) => c.blogId === blog.id)
    : [];
  const [form, setForm] = useState({ name: "", email: "", content: "" });
  const [tocOpen, setTocOpen] = useState(false);

  if (!blog) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <MessageCircle size={48} className="text-text-muted mb-3" />
        <p className="text-lg font-semibold text-text-primary">
          Không tìm thấy bài viết
        </p>
      </div>
    );
  }

  const sections: BlogSection[] = blog?.blogDetails?.sections || [];

  const breadcrumbs: BreadcrumbItem[] = [
    { label: "Trang chủ", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: blog.title },
  ];

  return (
    <div className="bg-surface min-h-screen pb-20">
      {/* Breadcrumb */}
      <div className="container pt-5">
        <Breadcrumbs
          items={breadcrumbs}
          className="pb-6"
          linkClassName="hover:!underline"
          activeClassName="text-text-primary font-semibold"
        />
      </div>

      {/* Hero Banner */}
      <div className="container mb-8">
        <div className="relative w-full aspect-[21/9] md:aspect-[21/7] rounded-2xl overflow-hidden">
          <Image
            src={blog?.blogDetails?.thumbnail || "/default-thumbnail.jpg"}
            alt={blog.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
            <span className="inline-block px-3 py-1 rounded-full bg-primary-500 text-white text-xs font-semibold mb-3">
              {blog.tag}
            </span>
            <h1 className="text-xl md:text-3xl lg:text-4xl font-extrabold text-white leading-tight max-w-3xl">
              {blog.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8 items-start">
          {/* Main Content */}
          <div>
            {/* Author + Meta */}
            <div className="flex flex-wrap items-center gap-4 mb-8 pb-6 border-b border-border">
              <Image
                src={blog.avatar}
                alt={blog.author}
                width={44}
                height={44}
                className="rounded-full"
              />
              <div>
                <p className="text-sm font-semibold text-text-primary">
                  {blog.author}
                </p>
                <div className="flex items-center gap-3 text-xs text-text-muted mt-0.5">
                  <span>{blog.date}</span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {blog?.blogDetails?.minutes ?? 0} phút đọc
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4 ml-auto text-xs text-text-muted">
                <span className="flex items-center gap-1">
                  <Eye size={14} /> 2,547
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle size={14} /> {comments.length}
                </span>
              </div>
            </div>

            {/* Mobile TOC toggle */}
            {sections.length > 0 && (
              <div className="lg:hidden mb-6">
                <button
                  type="button"
                  onClick={() => setTocOpen(!tocOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-surface rounded-xl border border-border text-sm font-semibold text-text-primary cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <List size={16} />
                    {t("tableOfContents")}
                  </span>
                  <ChevronRight
                    size={16}
                    className={`transition-transform ${tocOpen ? "rotate-90" : ""}`}
                  />
                </button>
                {tocOpen && (
                  <div className="mt-2 bg-surface rounded-xl border border-border p-4">
                    <ul className="space-y-2">
                      {sections.map((s, i) => (
                        <li key={i}>
                          <a
                            href={`#section-${i}`}
                            onClick={() => setTocOpen(false)}
                            className="text-sm text-text-secondary hover:text-primary-500 transition-colors"
                          >
                            {s.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Article Body */}
            <article className="py-6 md:py-8">
              <p className="text-text-secondary leading-relaxed mb-8">
                {blog.description}
              </p>

              <div className="space-y-8">
                {sections.map((section, i) => (
                  <div key={i}>
                    <h2
                      id={`section-${i}`}
                      className="text-lg font-bold text-text-primary mb-3 scroll-mt-24"
                    >
                      {section.title}
                    </h2>

                    {section.paragraphs?.map((p, idx) => (
                      <p
                        key={idx}
                        className="text-sm text-text-secondary leading-relaxed mb-2"
                      >
                        {p}
                      </p>
                    ))}

                    {section.bullets && (
                      <ul className="space-y-1.5 mt-2">
                        {section.bullets.map((b, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-sm text-text-secondary"
                          >
                            <span className="w-1.5 h-1.5 mt-1.5 rounded-full bg-primary-500 flex-shrink-0" />
                            {b}
                          </li>
                        ))}
                      </ul>
                    )}

                    {section.recommendations && (
                      <div className="mt-3 p-4 bg-primary-50/50 rounded-xl border border-primary-200">
                        <p className="text-xs font-bold text-primary-600 mb-2">
                          {t("suggestions")}
                        </p>
                        <ul className="space-y-1">
                          {section.recommendations.map((r, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-2 text-sm text-text-secondary"
                            >
                              <span className="w-1.5 h-1.5 mt-1.5 rounded-full bg-primary-400 flex-shrink-0" />
                              {r}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {section.subsections?.map((sub, idx) => (
                      <div key={idx} className="mt-4 pl-4 border-l-2 border-border">
                        <h3 className="text-sm font-bold text-text-primary mb-1.5">
                          {sub.subtitle}
                        </h3>
                        <ul className="space-y-1">
                          {sub.bullets.map((b, bidx) => (
                            <li
                              key={bidx}
                              className="flex items-start gap-2 text-sm text-text-secondary"
                            >
                              <span className="w-1 h-1 mt-2 rounded-full bg-text-muted flex-shrink-0" />
                              {b}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}

                    {section.quotes && (
                      <blockquote className="mt-4 pl-4 border-l-4 border-primary-400 bg-primary-50/30 py-3 pr-4 rounded-r-lg">
                        {section.quotes.map((q, idx) => (
                          <p
                            key={idx}
                            className="text-sm italic text-text-secondary"
                          >
                            {q}
                          </p>
                        ))}
                      </blockquote>
                    )}
                  </div>
                ))}
              </div>
            </article>

            {/* Tags + Share */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-6">
              <div className="flex flex-wrap gap-2">
                {tags.slice(0, 6).map((tag) => (
                  <span
                    key={tag.id}
                    className="px-3 py-1 rounded-full bg-bg-soft border border-border text-xs font-medium text-text-secondary hover:border-primary-300 cursor-pointer transition-colors"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-text-muted mr-1">Chia sẻ:</span>
                {[Link2, Share2].map((Icon, i) => (
                  <button
                    key={i}
                    type="button"
                    className="w-8 h-8 rounded-lg bg-bg-soft border border-border flex items-center justify-center text-text-muted hover:text-primary-500 hover:border-primary-300 cursor-pointer transition-colors"
                  >
                    <Icon size={14} />
                  </button>
                ))}
              </div>
            </div>

            {/* Author Card */}
            <div className="flex items-center gap-4 mt-8 p-5 bg-surface rounded-xl border border-border">
              <Image
                src={blog.avatar}
                alt={blog.author}
                width={56}
                height={56}
                className="rounded-full flex-shrink-0"
              />
              <div>
                <p className="text-sm font-bold text-text-primary">
                  {blog.author}
                </p>
                <p className="text-xs text-text-muted mt-0.5 line-clamp-2">
                  {t("sharing.authorBio")}
                </p>
              </div>
            </div>

            {/* Related Blogs */}
            {blog?.relatedBlogs && blog.relatedBlogs.length > 0 && (
              <div className="mt-10">
                <h2 className="text-base font-bold text-text-primary mb-4">
                  {t("relatedBlogs.title")}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {blog.relatedBlogs.slice(0, 4).map((rel) => {
                    const matchedBlog = blogs.find(
                      (b) => b.title === rel.title
                    );
                    if (matchedBlog) {
                      return <BlogCard key={rel.id} blog={matchedBlog} />;
                    }
                    return null;
                  })}
                </div>
              </div>
            )}

            {/* Comments */}
            {comments.length > 0 && (
              <div className="mt-10">
                <h2 className="text-base font-bold text-text-primary mb-4">
                  {t("commentsList.title")} ({comments.length})
                </h2>
                <div className="space-y-4">
                  {comments.map((c) => (
                    <div
                      key={c.id}
                      className="flex gap-3 p-4 bg-surface rounded-xl border border-border"
                    >
                      <Image
                        src={c.avatar}
                        alt={c.name}
                        width={36}
                        height={36}
                        className="rounded-full flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-text-primary">
                            {c.name}
                          </span>
                          <span className="text-xs text-text-muted">
                            {c.date}
                          </span>
                        </div>
                        {c.title && (
                          <p className="text-sm font-medium text-text-primary mb-0.5">
                            {c.title}
                          </p>
                        )}
                        <p className="text-sm text-text-secondary">
                          {c.content}
                        </p>
                        <button
                          type="button"
                          className="flex items-center gap-1 text-xs text-text-muted mt-2 hover:text-primary-500 cursor-pointer transition-colors"
                        >
                          <ThumbsUp size={12} /> {c.likes}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Comment Form */}
            <div className="mt-8">
              <h3 className="text-base font-bold text-text-primary mb-4">
                {t("commentForm.title")}
              </h3>
              <form
                className="space-y-3"
                onSubmit={(e) => e.preventDefault()}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="relative">
                    <User
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                    />
                    <input
                      type="text"
                      placeholder={t("commentForm.namePlaceholder")}
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      className="w-full h-10 pl-9 pr-3 rounded-lg border border-border bg-surface text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-primary-500 transition-colors"
                    />
                  </div>
                  <div className="relative">
                    <AtSign
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                    />
                    <input
                      type="email"
                      placeholder={t("commentForm.emailPlaceholder")}
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      className="w-full h-10 pl-9 pr-3 rounded-lg border border-border bg-surface text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-primary-500 transition-colors"
                    />
                  </div>
                </div>
                <textarea
                  rows={3}
                  placeholder={t("commentForm.contentPlaceholder")}
                  value={form.content}
                  onChange={(e) =>
                    setForm({ ...form, content: e.target.value })
                  }
                  className="w-full px-3 py-2.5 rounded-lg border border-border bg-surface text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-primary-500 transition-colors resize-y"
                />
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 h-10 px-5 rounded-lg bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 cursor-pointer transition-colors shadow-sm"
                >
                  <Send size={14} />
                  {t("commentForm.submit")}
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar — Table of Contents (Desktop) */}
          <aside className="hidden lg:block">
            <div className="sticky top-6 p-5">
              <h3 className="text-sm font-bold text-text-primary mb-3 flex items-center gap-2">
                <List size={16} />
                {t("tableOfContents")}
              </h3>
              <ul className="space-y-2">
                {sections.map((s, i) => (
                  <li key={i}>
                    <a
                      href={`#section-${i}`}
                      className="text-sm text-text-secondary hover:text-primary-500 transition-colors leading-snug block"
                    >
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
