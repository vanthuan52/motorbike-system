"use client";
import ProductListPage from "./_components/ProductListPage";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();
export default function Page() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="w-full">
        <ProductListPage />
      </div>
    </QueryClientProvider>
  );
}
