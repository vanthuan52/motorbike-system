import { CustomLink } from "@/shared/components/CustomerLink/CustomLink";

interface NavLinkProps {
  href: string;
  label: string;
  isActive: boolean;
  onClick?: () => void;
}

export default function NavLink({
  href,
  label,
  isActive,
  onClick,
}: NavLinkProps) {
  return (
    <CustomLink
      href={href}
      onClick={onClick}
      className={`nav-link block py-2 md:py-0 relative ${
        isActive ? "!text-red-400" : ""
      }`}
    >
      {label}
    </CustomLink>
  );
}
