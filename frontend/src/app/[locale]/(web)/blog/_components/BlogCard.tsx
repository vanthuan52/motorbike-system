import Image from "next/image";
import { blogs } from "@/data/BlogsData";
import { Link } from "@/lib/i18n";

interface BlogCardProps {
  blog: (typeof blogs)[number];
  variant?: "main" | "secondary" | "default";
}

const BlogCard = ({ blog, variant = "default" }: BlogCardProps) => {
  if (variant === "main") {
    return (
      <Link
        href={`${blog.slug}`}
        className="w-full flex flex-col lg:w-1/2 cursor-pointer group rounded-[var(--radius-2xl)] overflow-hidden transition-all duration-300 hover:scale-95 bg-surface hover:bg-primary-50"
      >
        <div className="relative w-full h-64 lg:h-80">
          <Image
            src={blog.image}
            alt="Blog"
            layout="fill"
            objectFit="cover"
            className="rounded-[var(--radius-2xl)] transition-all duration-300 group-hover:p-2"
            priority
          />
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2 text-sm text-text-muted mb-2">
            <Image
              src={blog.avatar}
              alt="Avatar"
              width={32}
              height={32}
              className="rounded-full"
            />
            <span className="font-medium text-text-primary">{blog.author}</span>
            <span className="rounded-full h-2 w-2 bg-secondary-300"></span>
            <span>{blog.date}</span>
            <span className="rounded-full h-2 w-2 bg-secondary-300"></span>
            <span className="bg-surface-alt text-text-secondary px-2 py-0.5 rounded-full text-xs">
              {blog.tag}
            </span>
          </div>
          <h2 className="font-semibold text-base mb-2 text-text-primary">{blog.title}</h2>
          <p className="text-sm text-text-secondary">{blog.description}</p>
        </div>
      </Link>
    );
  }

  if (variant === "secondary") {
    return (
      <Link
        href={`${blog.slug}`}
        className="group flex flex-col md:flex-row overflow-hidden rounded-[var(--radius-2xl)] bg-surface hover:bg-primary-50 transition-all duration-300 hover:scale-95 cursor-pointer"
      >
        <div className="relative w-full md:w-3/5 h-44 lg:h-60">
          <Image
            src={blog.image}
            alt="Blog"
            layout="fill"
            objectFit="cover"
            className="rounded-[var(--radius-2xl)] transition-transform duration-300 group-hover:scale-95"
          />
        </div>
        <div className="p-4 flex flex-col justify-between w-full">
          <div>
            <div className="flex items-center flex-wrap gap-2 text-sm text-text-muted mb-2">
              <Image
                src={blog.avatar}
                alt="Avatar"
                width={32}
                height={32}
                className="rounded-full"
              />
              <span className="font-medium text-text-primary">{blog.author}</span>
              <span className="h-1 w-1 bg-secondary-300 rounded-full" />
              <span>{blog.date}</span>
              <span className="h-1 w-1 bg-secondary-300 rounded-full" />
              <span className="bg-surface-alt text-text-secondary px-2 py-0.5 rounded-full text-xs">
                {blog.tag}
              </span>
            </div>
            <h2 className="font-semibold text-base mb-1 text-text-primary">{blog.shortTitle}</h2>
            <p className="text-sm text-text-secondary line-clamp-4">
              {blog.description}
            </p>
          </div>
        </div>
      </Link>
    );
  }

  // default
  return (
    <Link
      href={`${blog.slug}`}
      className="cursor-pointer group rounded-[var(--radius-2xl)] overflow-hidden transition-all duration-300 hover:scale-95 bg-surface hover:bg-primary-50"
    >
      <div className="relative w-full h-60">
        <Image
          src={blog.image}
          alt="Blog"
          layout="fill"
          objectFit="cover"
          className="rounded-[var(--radius-2xl)] transition-all duration-300 group-hover:p-2"
        />
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 text-sm text-text-muted mb-2">
          <Image
            src={blog.avatar}
            alt="Avatar"
            width={32}
            height={32}
            className="rounded-full"
          />
          <span className="font-medium text-text-primary">{blog.author}</span>
          <span className="rounded-full h-2 w-2 bg-secondary-300"></span>
          <span>{blog.date}</span>
          <span className="rounded-full h-2 w-2 bg-secondary-300"></span>
          <span className="bg-surface-alt text-text-secondary px-2 py-0.5 rounded-full text-xs">
            {blog.tag}
          </span>
        </div>
        <h2 className="font-semibold text-base mb-2 text-text-primary">{blog.shortTitle}</h2>
        <p className="text-sm text-text-secondary line-clamp-4">{blog.description}</p>
      </div>
    </Link>
  );
};

export default BlogCard;
