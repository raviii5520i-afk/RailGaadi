"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Train, Map, Star, Settings, Home } from "lucide-react";
import { cn } from "@/utils/cn";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/favourites", label: "Favourites", icon: Star },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-[var(--z-nav)] md:hidden bg-white border-t border-[#E5E7EB] safe-bottom"
      aria-label="Primary navigation"
    >
      <div className="flex items-stretch h-16">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex-1 flex flex-col items-center justify-center gap-0.5",
                "min-h-[44px] text-xs font-medium transition-colors duration-micro",
                isActive
                  ? "text-[#2563EB]"
                  : "text-[#9CA3AF] hover:text-[#6B7280]"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon
                className={cn("w-5 h-5", isActive && "text-[#2563EB]")}
                aria-hidden="true"
              />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function TopNavigation() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-[var(--z-nav)] hidden md:block bg-white/80 backdrop-blur-sm border-b border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 bg-[#2563EB] rounded-sm flex items-center justify-center">
            <Train className="w-4 h-4 text-white" aria-hidden="true" />
          </div>
          <span className="text-[#111318] font-semibold text-base tracking-tight">
            RailGaadi
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="flex items-center gap-1" aria-label="Primary navigation">
          {NAV_ITEMS.filter((i) => i.href !== "/settings").map(
            ({ href, label, icon: Icon }) => {
              const isActive =
                href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-sm text-sm font-medium transition-colors duration-micro",
                    isActive
                      ? "bg-[#EFF6FF] text-[#2563EB]"
                      : "text-[#6B7280] hover:text-[#111318] hover:bg-[#F3F4F6]"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                  {label}
                </Link>
              );
            }
          )}
        </nav>

        {/* Settings */}
        <Link
          href="/settings"
          className="p-2 rounded-sm text-[#9CA3AF] hover:text-[#6B7280] hover:bg-[#F3F4F6] transition-colors duration-micro"
          aria-label="Settings"
        >
          <Settings className="w-5 h-5" />
        </Link>
      </div>
    </header>
  );
}
