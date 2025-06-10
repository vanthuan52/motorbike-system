import { CustomLink } from "../CustomerLink/CustomLink";
import { motion } from "framer-motion";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string; // wrapper class
  listClassName?: string; // <ol>
  itemClassName?: string; // <li>
  linkClassName?: string; // <a>
  activeClassName?: string; // current breadcrumb (no href)
  separator?: string; // default is "/"
}

export default function Breadcrumbs({
  items,
  className = "",
  listClassName = "",
  itemClassName = "",
  linkClassName = "hover:text-orange-500",
  activeClassName = "font-semibold text-gray-700",
  separator = "/",
}: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol
        className={`flex flex-wrap items-center gap-2 text-sm ${listClassName}`}
      >
        {items.map((item, idx) => (
          <motion.li
            key={idx}
            className={`flex items-center gap-1 ${itemClassName}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08, duration: 0.4 }}
          >
            {item.href ? (
              <CustomLink href={item.href} className={linkClassName}>
                {item.label}
              </CustomLink>
            ) : (
              <span className={activeClassName}>{item.label}</span>
            )}
            {idx < items.length - 1 && <span>{separator}</span>}
          </motion.li>
        ))}
      </ol>
    </nav>
  );
}
