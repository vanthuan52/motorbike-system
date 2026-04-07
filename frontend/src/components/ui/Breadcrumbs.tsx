import { Link } from "@/lib/i18n";
import { motion } from "framer-motion";
import { cn } from "@/utils/common.utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  listClassName?: string;
  itemClassName?: string;
  linkClassName?: string;
  activeClassName?: string;
  separator?: string;
}

export default function Breadcrumbs({
  items,
  className = "",
  listClassName = "",
  itemClassName = "",
  linkClassName = "text-text-secondary hover:text-primary-700 transition-colors duration-150",
  activeClassName = "font-semibold text-text-primary",
  separator = "/",
}: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol
        className={cn(
          "flex flex-wrap items-center gap-2 text-sm",
          listClassName
        )}
      >
        {items.map((item, idx) => (
          <motion.li
            key={idx}
            className={cn("flex items-center gap-1", itemClassName)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08, duration: 0.4 }}
          >
            {item.href ? (
              <Link href={item.href} className={linkClassName}>
                {item.label}
              </Link>
            ) : (
              <span className={activeClassName}>{item.label}</span>
            )}
            {idx < items.length - 1 && (
              <span className="text-text-muted">{separator}</span>
            )}
          </motion.li>
        ))}
      </ol>
    </nav>
  );
}
