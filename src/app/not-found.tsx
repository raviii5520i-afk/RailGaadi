import Link from "next/link";
import { Train, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="w-14 h-14 bg-[#EFF6FF] rounded-xl flex items-center justify-center mx-auto mb-5">
          <Train className="w-7 h-7 text-[#2563EB]" />
        </div>
        <h2 className="text-lg font-semibold text-[#111318] mb-2">
          Page not found
        </h2>
        <p className="text-sm text-[#9CA3AF] mb-6">
          This page doesn&apos;t exist. Try searching for a train to get started.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#2563EB] text-white text-sm font-medium rounded-sm hover:bg-[#1d4ed8] transition-colors"
        >
          <Search className="w-4 h-4" />
          Search Trains
        </Link>
      </div>
    </div>
  );
}
