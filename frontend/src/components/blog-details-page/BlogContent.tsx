import { Eye, Mail } from "lucide-react";
import Image from "next/image";
import { CustomLink } from "@/shared/components/CustomerLink/CustomLink";

interface BlogSection {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  recommendations?: string[];
  subsections?: {
    subtitle: string;
    bullets: string[];
  }[];
  quotes?: string[];
}

interface BlogDetails {
  thumbnail?: string;
  minutes: number;
  sections: BlogSection[];
}

interface Blog {
  title: string;
  tag: string;
  avatar: string;
  author: string;
  date: string;
  description: string;
  blogDetails?: BlogDetails;
}

export default function BlogContent({ blog }: { blog: Blog }) {
  return (
    <div>
      <ol className="flex items-center whitespace-nowrap">
        <li className="inline-flex items-center">
          <CustomLink
            className="flex items-center text-sm text-gray-500 hover:text-green-500 focus:outline-hidden focus:text-green-500"
            href="/"
          >
            Trang chủ
          </CustomLink>
          <svg
            className="shrink-0 mx-2 size-4 text-gray-400 dark:text-neutral-600"
            xmlns="http://www.w3.org/2000/svg"
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </li>
        <li className="inline-flex items-center">
          <CustomLink
            className="flex items-center text-sm text-gray-500 hover:text-green-500 focus:outline-hidden focus:text-green-500"
            href="/blog"
          >
            Bài viết
            <svg
              className="shrink-0 mx-2 size-4 text-gray-400 dark:text-neutral-600"
              xmlns="http://www.w3.org/2000/svg"
              width={24}
              height={24}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </CustomLink>
        </li>
        <li
          className="inline-flex items-center text-sm font-semibold text-green-800 truncate "
          aria-current="page"
        >
          {blog.title}
        </li>
      </ol>
      <div className="flex justify-center items-center w-fit p-4 my-4 h-[55px] bg-[#A7D571] rounded-[30px] text-lg sm:text-xl font-bold">
        {blog.tag}
      </div>
      <h1 className="text-lg sm:text-xl font-bold my-4">{blog.title}</h1>
      <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6 ">
        <Image
          src={blog.avatar}
          alt="avatar"
          width={32}
          height={32}
          className="rounded-full"
        />
        <div className="flex flex-col">
          <span>{blog.author}</span>
          <div className="flex gap-4">
            <span>{blog.date}</span>
            <span>{blog?.blogDetails?.minutes} phút đọc</span>
          </div>
        </div>
        <div className="flex gap-4">
          <span className="flex justify-center items-center gap-2">
            <Eye size={24} /> 2547
          </span>
          <span className="flex justify-center items-center gap-2">
            <Mail size={24} /> 40
          </span>
        </div>
      </div>
      <Image
        src={blog?.blogDetails?.thumbnail || "/default-thumbnail.jpg"}
        alt="blog thumbnail"
        width={800}
        height={400}
        className="w-full h-auto rounded-md mb-4 sm:mb-6"
        priority
      />
      <div className="bg-white rounded-[30px] p-4">
        <p className="text-gray-700 mb-6 sm:mb-8">{blog.description}</p>
        <div className="space-y-8 sm:space-y-10">
          {blog?.blogDetails?.sections.map((section, i) => (
            <div key={i}>
              <h2
                className="text-base sm:text-lg font-semibold mb-2 scroll-mt-[110px]"
                id={`section-${i}`}
              >
                {section.title}
              </h2>
              {section.paragraphs?.map((p, idx) => (
                <p key={idx} className="text-gray-700 mb-2">
                  {p}
                </p>
              ))}
              {section.bullets && (
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  {section.bullets.map((b, idx) => (
                    <li key={idx}>{b}</li>
                  ))}
                </ul>
              )}
              {section.recommendations && (
                <div className="mt-2">
                  <strong>Gợi ý:</strong>
                  <ul className="list-disc pl-5 text-gray-700">
                    {section.recommendations.map((r, idx) => (
                      <li key={idx}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}
              {section.subsections?.map((sub, idx) => (
                <div key={idx} className="mt-4">
                  <h3 className="font-medium">{sub.subtitle}</h3>
                  <ul className="list-disc pl-5 text-gray-700">
                    {sub.bullets.map((b, bidx) => (
                      <li key={bidx}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
              {section.quotes && (
                <div className="bg-green-100 border-l-4 border-green-500 px-4 py-2 mt-4 italic text-gray-800">
                  {section.quotes.map((q, idx) => (
                    <p key={idx}>{q}</p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
