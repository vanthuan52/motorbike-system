"use client";

import { useRouter as useNextRouter } from "next/navigation";
import { onProgressStart } from "@/lib/nprogress/nprogress";
import { shouldTriggerStartEvent } from "@/lib/nprogress/shoudTriggerStartEvent";

export function useRouter(): ReturnType<typeof useNextRouter> {
  const router = useNextRouter();

  return {
    ...router,
    push: (href: string, options?: any) => {
      if (shouldTriggerStartEvent(href)) onProgressStart();
      router.push(href, options);
    },
    replace: (href: string, options?: any) => {
      if (shouldTriggerStartEvent(href)) onProgressStart();
      router.replace(href, options);
    },
  };
}
