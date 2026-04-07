import { Link } from "@/lib/i18n";

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
    <Link
      href={href}
      onClick={onClick}
      className={`nav-link block py-2 md:py-0 relative ${
        isActive ? "text-accent!" : ""
      }`}
    >
      {label}
    </Link>
  );
}
