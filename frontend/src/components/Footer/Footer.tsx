// components/Footer.tsx
import Image from "next/image";
import Link from "next/link";

const CONTACT_INFO = [
  "Giờ làm việc: 8:00 AM – 17:00 PM",
  "Số điện thoại: 0123456789",
  "Địa chỉ: Phường ABC, quận XYZ, thành phố Hồ Chí Minh",
];

const NAV_LINKS_1 = [
  { label: "Giải pháp", href: "/solutions" },
  { label: "Dịch vụ", href: "/services" },
  { label: "Giới thiệu", href: "/about" },
];

const NAV_LINKS_2 = [
  { label: "Blog", href: "/blog" },
  { label: "Liên hệ", href: "/contact" },
];

const SOCIAL_ICONS = [
  { src: "/images/facebook.png", alt: "facebook", href: "#" },
  { src: "/images/instagram.png", alt: "instagram", href: "#" },
  { src: "/images/X.png", alt: "x", href: "#" },
  { src: "/images/twitter.png", alt: "twitter", href: "#" },
];

interface LinkListProps {
  links: { label: string; href: string }[];
}

const LinkList = ({ links }: LinkListProps) => (
  <div className="flex flex-col gap-2 items-center">
    <div className="h-[28px]" />
    {links.map(({ label, href }) => (
      <Link
        key={label}
        href={href}
        className="text-lg hover:underline hover:text-green-600 transition"
      >
        {label}
      </Link>
    ))}
  </div>
);

export default function Footer() {
  return (
    <footer className="w-full bg-white px-4 md:px-12 py-8 text-black">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm mb-8">
        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="text-xl font-bold"
            style={{
              fontFamily: "Nosifer, Caps",
            }}
          >
            Mortorbike
          </Link>
          {CONTACT_INFO.map((info) => (
            <p key={info} className="text-lg">
              {info}
            </p>
          ))}
        </div>

        <LinkList links={NAV_LINKS_1} />

        <div className="flex flex-col items-end">
          <div className="flex flex-col items-center">
            <LinkList links={NAV_LINKS_2} />
            <div className="flex gap-3 mt-4">
              {SOCIAL_ICONS.map(({ src, alt, href }) => (
                <Link key={alt} href={href} target="_blank">
                  <Image src={src} alt={alt} width={28} height={28} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="text-center font-bold text-lg">
        © Copyright ® 2025 Wisdom Robotics
      </div>
    </footer>
  );
}
