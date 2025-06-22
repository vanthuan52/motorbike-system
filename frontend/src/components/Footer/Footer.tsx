/* eslint-disable @next/next/no-img-element */
import { useTranslations } from "next-intl";
import { CustomLink } from "../../components/CustomerLink/CustomLink";
import { ROUTER_PATH } from "@/constant/router-path";

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

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="w-full">
      <div className="container">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-8 py-10 max-sm:max-w-sm max-sm:mx-auto gap-y-8">
          <div className="col-span-full mb-10 lg:col-span-2 lg:mb-0">
            <CustomLink
              href="/"
              className="flex justify-center lg:justify-start text-xl font-bold"
            >
              {t("logo")}
            </CustomLink>
            <p className="py-8 text-sm text-gray-500 lg:max-w-xs text-center lg:text-left">
              {t("description")}
            </p>
            <CustomLink
              href="#"
              className="py-2.5 px-5 block w-fit bg-black rounded-full shadow-sm text-sm !text-white mx-auto transition-all duration-500 lg:mx-0 hover:bg-white hover:!text-black"
            >
              {t("contactUs")}
            </CustomLink>
          </div>

          <div className="lg:mx-auto text-left">
            <h4 className="text-lg text-gray-900 font-medium mb-7">
              {t("company.title")}
            </h4>
            <ul className="text-sm transition-all duration-500">
              <li className="mb-6">
                <CustomLink
                  href={ROUTER_PATH.HOME}
                  className="text-gray-600 hover:text-gray-900"
                >
                  {t("company.home")}
                </CustomLink>
              </li>
              <li className="mb-6">
                <CustomLink
                  href={ROUTER_PATH.ABOUT}
                  className="text-gray-600 hover:text-gray-900"
                >
                  {t("company.about")}
                </CustomLink>
              </li>
              <li className="mb-6">
                <CustomLink
                  href={ROUTER_PATH.SERVICES}
                  className="text-gray-600 hover:text-gray-900"
                >
                  {t("company.services")}
                </CustomLink>
              </li>
            </ul>
          </div>

          <div className="lg:mx-auto text-left">
            <h4 className="text-lg text-gray-900 font-medium mb-7">
              {t("policy.title")}
            </h4>
            <ul className="text-sm transition-all duration-500">
              <li className="mb-6">
                <CustomLink
                  href="/cau-hoi-thuong-gap"
                  className="text-gray-600 hover:text-gray-900"
                >
                  {t("policy.faq")}
                </CustomLink>
              </li>
              <li className="mb-6">
                <CustomLink
                  href="#"
                  className="text-gray-600 hover:text-gray-900"
                >
                  {t("policy.privacy")}
                </CustomLink>
              </li>
            </ul>
          </div>

          <div className="lg:mx-auto text-left">
            <h4 className="text-lg text-gray-900 font-medium mb-7">
              {t("blog.title")}
            </h4>
            <ul className="text-sm transition-all duration-500">
              <li className="mb-6">
                <CustomLink
                  href="#"
                  className="text-gray-600 hover:text-gray-900"
                >
                  {t("blog.tips")}
                </CustomLink>
              </li>
              <li className="mb-6">
                <CustomLink
                  href="#"
                  className="text-gray-600 hover:text-gray-900"
                >
                  {t("blog.news")}
                </CustomLink>
              </li>
              <li>
                <CustomLink
                  href="#"
                  className="text-gray-600 hover:text-gray-900"
                >
                  {t("blog.events")}
                </CustomLink>
              </li>
            </ul>
          </div>

          <div className="lg:mx-auto text-left">
            <h4 className="text-lg text-gray-900 font-medium mb-7 text-center">
              {t("getApps")}
            </h4>
            <ul className="text-sm transition-all duration-500 flex flex-col items-center">
              <li className="mb-6">
                <CustomLink
                  href="#"
                  className="text-gray-600 hover:text-gray-900 flex items-center gap-2 justify-center"
                >
                  <img
                    src="/images/google-play.png"
                    alt="Google Play"
                    width={130}
                    height={60}
                  />
                  <span className="sr-only">Google Play</span>
                </CustomLink>
              </li>
              <li className="mb-6">
                <CustomLink
                  href="#"
                  className="text-gray-600 hover:text-gray-900 flex items-center gap-2 justify-center"
                >
                  <img
                    src="/images/apple-store.png"
                    alt="Apple Store"
                    width={130}
                    height={60}
                  />
                  <span className="sr-only">Apple Store</span>
                </CustomLink>
              </li>
            </ul>
          </div>
        </div>

        <div className="py-7 border-t border-gray-200">
          <div className="flex items-center justify-center flex-col lg:justify-between lg:flex-row">
            <span className="text-sm text-gray-500 text-center">
              ©
              <CustomLink href="https://pagedone.io/" target="_blank">
                {t("copyright")}
              </CustomLink>{" "}
              2025, {t("rightsReserved")}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
