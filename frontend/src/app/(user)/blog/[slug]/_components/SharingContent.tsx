import { Facebook, Linkedin, Mail, Twitter } from "lucide-react";
import { tags } from "@/data/TagsData";
import Image from "next/image";
interface Blog {
  title: string;
  tag: string;
  avatar: string;
  author: string;
  date: string;
  description: string;
}
export default function SharingContent({ blog }: { blog: Blog }) {
  return (
    <div className="w-full">
      {/* Chia sẻ bài viết */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 gap-2 sm:gap-0">
        <p className="text-base sm:text-xl text-[#737373] mb-2 sm:mb-0">
          Chia sẻ bài viết
        </p>
        <ul className="flex gap-2 sm:gap-4">
          <li className="rounded-full bg-[#CCCCCC] p-2 hover:bg-[#B0B0B0] transition duration-200 ease-in-out cursor-pointer">
            <Linkedin size={18} />
          </li>
          <li className="rounded-full bg-[#CCCCCC] p-2 hover:bg-[#B0B0B0] transition duration-200 ease-in-out cursor-pointer">
            <Mail size={18} />
          </li>
          <li className="rounded-full bg-[#CCCCCC] p-2 hover:bg-[#B0B0B0] transition duration-200 ease-in-out cursor-pointer">
            <Facebook size={18} />
          </li>
          <li className="rounded-full bg-[#CCCCCC] p-2 hover:bg-[#B0B0B0] transition duration-200 ease-in-out cursor-pointer">
            <Twitter size={18} />
          </li>
        </ul>
      </div>

      {/* Tag list */}
      <div className="flex flex-wrap gap-2 mt-6 sm:mt-8">
        {tags.map((tag) => (
          <div
            key={tag.id}
            className="px-2 py-1 rounded-[30px] bg-[#CCCCCC] text-[#737373] font-semibold cursor-pointer hover:bg-[#B0B0B0] transition duration-200 ease-in-out text-sm sm:text-lg text-center"
          >
            {tag.name}
          </div>
        ))}
      </div>

      {/* Author card */}
      <div className="bg-white rounded-[30px] mt-6 sm:mt-8 px-4 py-4 sm:px-[80px] sm:py-2.5 flex flex-col sm:flex-row items-center gap-6 sm:gap-16 shadow-sm">
        <Image
          src={blog.avatar}
          alt="avatar"
          width={80}
          height={80}
          className="rounded-full mb-3 sm:mb-0"
        />
        <div className="flex flex-col gap-2 sm:gap-3 text-center sm:text-left">
          <span className="font-semibold text-base sm:text-lg">
            {blog.author}
          </span>
          <span className="text-xs sm:text-base">
            Chuyên gia về xe máy với hơn 10 năm kinh nghiệm phượt off-road trên
            khắp Việt Nam và Đông Nam Á.
            <br className="hidden sm:block" />
            Người sáng lập câu lạc bộ &quot;Phượt Xuyên Việt&quot; và là tác giả
            của cuốn sách &quot;Hành Trình Chinh Phục Đường Núi&quot;.
          </span>
          <ul className="flex gap-2 sm:gap-4 justify-center sm:justify-start mt-2">
            <li className="rounded-full bg-[#CCCCCC] p-2 hover:bg-[#B0B0B0] transition duration-200 ease-in-out cursor-pointer">
              <Linkedin size={18} />
            </li>
            <li className="rounded-full bg-[#CCCCCC] p-2 hover:bg-[#B0B0B0] transition duration-200 ease-in-out cursor-pointer">
              <Mail size={18} />
            </li>
            <li className="rounded-full bg-[#CCCCCC] p-2 hover:bg-[#B0B0B0] transition duration-200 ease-in-out cursor-pointer">
              <Facebook size={18} />
            </li>
            <li className="rounded-full bg-[#CCCCCC] p-2 hover:bg-[#B0B0B0] transition duration-200 ease-in-out cursor-pointer">
              <Twitter size={18} />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
