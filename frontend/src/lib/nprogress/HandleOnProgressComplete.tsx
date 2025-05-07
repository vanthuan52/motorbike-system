"use client";
import { Suspense, useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { onProgressComplete } from "@/lib/nprogress/nprogress";

// function HandleOnCompleteChild() {
//   const pathname = usePathname();
//   const searchParams = useSearchParams();

//   useEffect(() => {
//     onProgressComplete();
//   }, [pathname, searchParams]);

//   return null;
// }

function HandleOnCompleteChild() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      onProgressComplete();
    }
  }, [pathname, searchParams, isClient]);

  return null;
}

export function HandleProgressOnComplete() {
  return (
    <Suspense>
      <HandleOnCompleteChild />
    </Suspense>
  );
}
