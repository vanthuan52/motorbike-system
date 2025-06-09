"use client";

import Link from "next/link";
import { forwardRef } from "react";
import { onProgressStart } from "@/lib/nprogress/nprogress";
import { shouldTriggerStartEvent } from "@/lib/nprogress/shoudTriggerStartEvent";

export const CustomLink = forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<"a">
>(function CustomLink({ href, onClick, ...rest }, ref) {
  const useLink = typeof href === "string" && href.startsWith("/");
  if (!useLink) return <a href={href} onClick={onClick} {...rest} />;

  return (
    <Link
      href={href}
      onClick={(event) => {
        if (shouldTriggerStartEvent(href, event)) onProgressStart();
        if (onClick) onClick(event);
      }}
      {...rest}
      ref={ref}
    />
  );
});
