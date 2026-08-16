"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

import { ToastContainer } from "@/components/ui/Toast";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            gcTime: 5 * 60 * 1000,
            retry: (failureCount, error: unknown) => {
              if (error && typeof error === "object" && "code" in error) {
                const code = (error as { code: string }).code;
                if (
                  ["TRAIN_NOT_FOUND", "INVALID_TRAIN", "VALIDATION_ERROR"].includes(
                    code
                  )
                ) {
                  return false;
                }
              }
              return failureCount < 3;
            },
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 8000),
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ToastContainer />
    </QueryClientProvider>
  );
}
