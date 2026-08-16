"use client";

import { useState } from "react";
import { Search, Compass } from "lucide-react";
import { cn } from "@/utils/cn";

interface SearchTabsProps {
  searchTrainView: React.ReactNode;
  findTrainsView: React.ReactNode;
}

export function SearchTabs({ searchTrainView, findTrainsView }: SearchTabsProps) {
  const [activeTab, setActiveTab] = useState<"search" | "find">("search");

  return (
    <div className="space-y-4">
      {/* Mode Switcher Tabs */}
      <div className="flex bg-[#F3F4F6] p-1 rounded-md border border-[#E5E7EB] max-w-sm mx-auto">
        <button
          type="button"
          onClick={() => setActiveTab("search")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-sm transition-all duration-micro",
            activeTab === "search"
              ? "bg-white text-[#2563EB] shadow-xs"
              : "text-[#6B7280] hover:text-[#111318]"
          )}
        >
          <Search className="w-3.5 h-3.5" />
          Search Train
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("find")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-sm transition-all duration-micro",
            activeTab === "find"
              ? "bg-white text-[#2563EB] shadow-xs"
              : "text-[#6B7280] hover:text-[#111318]"
          )}
        >
          <Compass className="w-3.5 h-3.5" />
          Find Trains
        </button>
      </div>

      {/* Render selected view */}
      {activeTab === "search" ? searchTrainView : findTrainsView}
    </div>
  );
}
