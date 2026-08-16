"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="w-14 h-14 bg-amber-50 rounded-xl flex items-center justify-center mx-auto mb-5">
          <AlertTriangle className="w-7 h-7 text-amber-500" />
        </div>
        <h2 className="text-lg font-semibold text-[#111318] mb-2">
          Something went wrong
        </h2>
        <p className="text-sm text-[#6B7280] mb-6">
          RailGaadi encountered an unexpected error. You can try again or return
          to the home screen.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#2563EB] text-white text-sm font-medium rounded-sm hover:bg-[#1d4ed8] transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-4 py-2.5 bg-white text-[#6B7280] text-sm font-medium rounded-sm border border-[#E5E7EB] hover:bg-[#F3F4F6] transition-colors"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
