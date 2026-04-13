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
        className="w-full flex flex-col lg:w-1/2 cursor-pointer group rounded-[var(--radius-2xl)] overflow-hidden bg-surface transition-shadow duration-300 hover:shadow-lg"
      >
        <div className="relative w-full h-64 lg:h-80 overflow-hidden">
          <Image
            src={blog.image}
            alt={blog.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority
          />
          <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-primary-500 text-white text-xs font-semibold shadow-sm">
            {blog.tag}
          </span>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2 text-sm text-text-muted mb-2">
            <Image
              src={blog.avatar}
              alt="Avatar"
              width={28}
              height={28}
              className="rounded-full"
            />
            <span className="font-medium text-text-primary">{blog.author}</span>
            <span className="h-1 w-1 bg-secondary-300 rounded-full" />
            <span>{blog.date}</span>
          </div>
          <h2 className="font-semibold text-base mb-2 text-text-primary group-hover:text-primary-500 transition-colors">
            {blog.title}
          </h2>
          <p className="text-sm text-text-secondary line-clamp-2">
            {blog.description}
          </p>
        </div>
      </Link>
    );
  }

  if (variant === "secondary") {
    return (
      <Link
        href={`${blog.slug}`}
        className="group flex flex-col md:flex-row overflow-hidden rounded-[var(--radius-2xl)] bg-surface transition-shadow duration-300 hover:shadow-lg cursor-pointer"
      >
        <div className="relative w-full md:w-3/5 h-44 lg:h-60 overflow-hidden">
          <Image
            src={blog.image}
            alt={blog.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-primary-500 text-white text-xs font-semibold shadow-sm">
            {blog.tag}
          </span>
        </div>
        <div className="p-4 flex flex-col justify-between w-full">
          <div>
            <div className="flex items-center flex-wrap gap-2 text-sm text-text-muted mb-2">
              <Image
                src={blog.avatar}
                alt="Avatar"
                width={28}
                height={28}
                className="rounded-full"
              />
              <span className="font-medium text-text-primary">
                {blog.author}
              </span>
              <span className="h-1 w-1 bg-secondary-300 rounded-full" />
              <span>{blog.date}</span>
            </div>
            <h2 className="font-semibold text-base mb-1 text-text-primary group-hover:text-primary-500 transition-colors">
              {blog.shortTitle}
            </h2>
            <p className="text-sm text-text-secondary line-clamp-3">
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
      className="cursor-pointer group rounded-[var(--radius-2xl)] overflow-hidden bg-surface transition-shadow duration-300 hover:shadow-lg"
    >
      <div className="relative w-full h-52 overflow-hidden">
        <Image
          src={blog.image}
          alt={blog.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-primary-500 text-white text-xs font-semibold shadow-sm">
          {blog.tag}
        </span>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 text-sm text-text-muted mb-2">
          <Image
            src={blog.avatar}
            alt="Avatar"
            width={28}
            height={28}
            className="rounded-full"
          />
          <span className="font-medium text-text-primary">{blog.author}</span>
          <span className="h-1 w-1 bg-secondary-300 rounded-full" />
          <span>{blog.date}</span>
        </div>
        <h2 className="font-semibold text-sm mb-1.5 text-text-primary group-hover:text-primary-500 transition-colors line-clamp-2">
          {blog.shortTitle}
        </h2>
        <p className="text-sm text-text-secondary line-clamp-2">
          {blog.description}
        </p>
      </div>
    </Link>
  );
};

export default BlogCard;
