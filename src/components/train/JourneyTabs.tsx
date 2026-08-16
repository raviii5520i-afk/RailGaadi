"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";

interface JourneyTabsProps {
  trainNumber: string;
}

const TABS = [
  { label: "Status", path: "" },
  { label: "Full Map", path: "/map" },
  { label: "Analytics", path: "/analytics" },
  { label: "Companion", path: "/companion" },
];

export function JourneyTabs({ trainNumber }: JourneyTabsProps) {
  const pathname = usePathname();
  const base = `/journey/${trainNumber}`;

  return (
    <div className="bg-white border-b border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <nav
          className="flex gap-0"
          aria-label="Journey sections"
          role="tablist"
        >
          {TABS.map(({ label, path }) => {
            const href = `${base}${path}`;
            const isActive = path === ""
              ? pathname === base
              : pathname.startsWith(href);

            return (
              <Link
                key={label}
                href={href}
                role="tab"
                aria-selected={isActive}
                className={cn(
                  "px-4 py-3 text-sm font-medium border-b-2 transition-colors duration-micro",
                  isActive
                    ? "border-[#2563EB] text-[#2563EB]"
                    : "border-transparent text-[#6B7280] hover:text-[#111318] hover:border-[#D1D5DB]"
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
