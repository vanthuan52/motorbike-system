import Image from "next/image";
import { blogs } from "@/data/BlogsData";
import { CustomLink } from "@/shared/components/CustomerLink/CustomLink";
interface BlogCardProps {
  blog: (typeof blogs)[number];
  variant?: "main" | "secondary" | "default";
}

const BlogCard = ({ blog, variant = "default" }: BlogCardProps) => {
  if (variant === "main") {
    return (
      <CustomLink
        href={`${blog.slug}`}
        className="w-full flex flex-col lg:w-1/2 cursor-pointer group rounded-[30px] overflow-hidden transition-all duration-300 hover:scale-95 bg-white hover:bg-[#FFECDA]"
      >
        <div className="relative w-full h-64 lg:h-80">
          <Image
            src={blog.image}
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
          <h2 className="font-semibold text-base mb-2">{blog.title}</h2>
          <p className="text-sm text-gray-600">{blog.description}</p>
        </div>
      </CustomLink>
    );
  }

  if (variant === "secondary") {
    return (
      <CustomLink
        href={`${blog.slug}`}
        className="group flex flex-col md:flex-row overflow-hidden rounded-[30px] bg-white hover:bg-[#FFECDA] transition-all duration-300 hover:scale-95 cursor-pointer"
      >
        <div className="relative w-full md:w-3/5 h-44 lg:h-60">
          <Image
            src={blog.image}
            alt="Blog"
            layout="fill"
            objectFit="cover"
            className="rounded-[30px] transition-transform duration-300 group-hover:scale-95"
          />
        </div>
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
              <span className="font-medium text-black">{blog.author}</span>
              <span className="h-1 w-1 bg-gray-400 rounded-full" />
              <span>{blog.date}</span>
              <span className="h-1 w-1 bg-gray-400 rounded-full" />
              <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                {blog.tag}
              </span>
            </div>
            <h2 className="font-semibold text-base mb-1">{blog.shortTitle}</h2>
            <p className="text-sm text-gray-600 line-clamp-4">
              {blog.description}
            </p>
          </div>
        </div>
      </CustomLink>
    );
  }

  // default
  return (
    <CustomLink
      href={`${blog.slug}`}
      className="cursor-pointer group rounded-[30px] overflow-hidden transition-all duration-300 hover:scale-95 bg-white hover:bg-[#FFECDA]"
    >
      <div className="relative w-full h-60">
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
        <h2 className="font-semibold text-base mb-2">{blog.shortTitle}</h2>
        <p className="text-sm text-gray-600 line-clamp-4">{blog.description}</p>
      </div>
    </CustomLink>
  );
};

export default BlogCard;
