/* eslint-disable @next/next/no-img-element */
import { useTranslations } from "next-intl";
import { Link, TRANSLATION_FILES } from "@/lib/i18n";
import { ROUTER_PATH } from "@/constant/router-path";
import { Logo } from "@/components/ui/Logo";

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
  const t = useTranslations(TRANSLATION_FILES.COMMON);

  return (
    <footer className="w-full border-t border-border">
      <div className="container">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-8 py-10 max-sm:max-w-sm max-sm:mx-auto gap-y-8">
          <div className="col-span-full mb-10 lg:col-span-2 lg:mb-0">
            <Logo className="flex justify-center text-3xl mb-4 lg:mb-0 lg:justify-start" />
            <p className="py-8 text-sm text-text-muted lg:max-w-xs text-center lg:text-left">
              {t("footer.description")}
            </p>
            <Link
              href="#"
              className="py-2.5 px-5 block w-fit bg-secondary-900 rounded-full shadow-sm text-sm !text-white mx-auto transition-all duration-500 lg:mx-0 hover:bg-surface hover:!text-secondary-900"
            >
              {t("footer.contactUs")}
            </Link>
          </div>

          <div className="lg:mx-auto text-left">
            <h4 className="text-lg text-text-primary font-medium mb-7">
              {t("footer.company.title")}
            </h4>
            <ul className="text-sm transition-all duration-500">
              <li className="mb-6">
                <Link
                  href={ROUTER_PATH.HOME}
                  className="text-text-secondary hover:text-text-primary"
                >
                  {t("footer.company.home")}
                </Link>
              </li>
              <li className="mb-6">
                <Link
                  href={ROUTER_PATH.ABOUT}
                  className="text-text-secondary hover:text-text-primary"
                >
                  {t("footer.company.about")}
                </Link>
              </li>
              <li className="mb-6">
                <Link
                  href={ROUTER_PATH.SERVICES}
                  className="text-text-secondary hover:text-text-primary"
                >
                  {t("footer.company.services")}
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:mx-auto text-left">
            <h4 className="text-lg text-text-primary font-medium mb-7">
              {t("footer.policy.title")}
            </h4>
            <ul className="text-sm transition-all duration-500">
              <li className="mb-6">
                <Link
                  href="/cau-hoi-thuong-gap"
                  className="text-text-secondary hover:text-text-primary"
                >
                  {t("footer.policy.faq")}
                </Link>
              </li>
              <li className="mb-6">
                <Link
                  href="#"
                  className="text-text-secondary hover:text-text-primary"
                >
                  {t("footer.policy.privacy")}
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:mx-auto text-left">
            <h4 className="text-lg text-text-primary font-medium mb-7">
              {t("footer.blog.title")}
            </h4>
            <ul className="text-sm transition-all duration-500">
              <li className="mb-6">
                <Link
                  href="#"
                  className="text-text-secondary hover:text-text-primary"
                >
                  {t("footer.blog.tips")}
                </Link>
              </li>
              <li className="mb-6">
                <Link
                  href="#"
                  className="text-text-secondary hover:text-text-primary"
                >
                  {t("footer.blog.news")}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-text-secondary hover:text-text-primary"
                >
                  {t("footer.blog.events")}
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:mx-auto text-left">
            <h4 className="text-lg text-text-primary font-medium mb-7 text-center">
              {t("footer.getApps")}
            </h4>
            <ul className="text-sm transition-all duration-500 flex flex-col items-center">
              <li className="mb-6">
                <Link
                  href="#"
                  className="text-text-secondary hover:text-text-primary flex items-center gap-2 justify-center"
                >
                  <img
                    src="/images/google-play.png"
                    alt="Google Play"
                    width={130}
                    height={60}
                  />
                  <span className="sr-only">Google Play</span>
                </Link>
              </li>
              <li className="mb-6">
                <Link
                  href="#"
                  className="text-text-secondary hover:text-text-primary flex items-center gap-2 justify-center"
                >
                  <img
                    src="/images/apple-store.png"
                    alt="Apple Store"
                    width={130}
                    height={60}
                  />
                  <span className="sr-only">Apple Store</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="py-7 border-t border-border">
          <div className="flex items-center justify-center flex-col lg:justify-between lg:flex-row">
            <span className="text-sm text-text-muted text-center">
              ©
              <Link href="https://pagedone.io/" target="_blank">
                {t("footer.copyright")}
              </Link>{" "}
              2026. {t("footer.rightsReserved")}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
