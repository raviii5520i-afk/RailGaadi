"use client";

import { useRouter } from "next/navigation";
import { Heart, Train, ArrowRight, Search } from "lucide-react";
import { useSearchStore } from "@/store/searchStore";
import { cn } from "@/utils/cn";

export function FavouritesContent() {
  const router = useRouter();
  const { favouriteTrains, toggleFavourite } = useSearchStore();

  const handleOpen = (trainNumber: string) => {
    router.push(`/journey/${trainNumber}`);
  };

  if (favouriteTrains.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-14 h-14 bg-[#F3F4F6] rounded-xl flex items-center justify-center mx-auto mb-4">
          <Heart className="w-7 h-7 text-[#D1D5DB]" />
        </div>
        <h1 className="text-lg font-semibold text-[#111318] mb-2">
          No favourites yet
        </h1>
        <p className="text-sm text-[#9CA3AF] mb-6">
          Search for a train and tap the heart icon to save it here.
        </p>
        <button
          onClick={() => router.push("/")}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#2563EB] text-white text-sm font-medium rounded-sm hover:bg-[#1d4ed8] transition-colors"
        >
          <Search className="w-4 h-4" />
          Search Trains
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#111318] mb-6">Favourites</h1>
      <div className="space-y-2">
        {favouriteTrains.map((train) => (
          <div
            key={train.number}
            className="flex items-center gap-3 group"
          >
            <button
              onClick={() => handleOpen(train.number)}
              className={cn(
                "flex-1 flex items-center gap-4 px-4 py-4 bg-white rounded-md",
                "border border-[#E5E7EB] text-left shadow-card",
                "hover:border-[#D1D5DB] hover:shadow-card-hover transition-all duration-micro"
              )}
            >
              <div className="w-10 h-10 bg-[#EFF6FF] rounded-md flex items-center justify-center flex-shrink-0">
                <Train className="w-5 h-5 text-[#2563EB]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-[#111318]">
                    {train.number}
                  </span>
                  {train.type && (
                    <span className="text-xs text-[#9CA3AF] bg-[#F3F4F6] px-1.5 py-0.5 rounded-sm">
                      {train.type}
                    </span>
                  )}
                </div>
                <p className="text-sm text-[#6B7280] truncate">{train.name}</p>
                <p className="text-xs text-[#9CA3AF] mt-0.5">
                  {train.origin.name} → {train.destination.name}
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-[#D1D5DB] flex-shrink-0" />
            </button>

            <button
              onClick={() => toggleFavourite(train)}
              aria-label={`Remove ${train.name} from favourites`}
              className={cn(
                "p-2.5 rounded-sm text-[#D1D5DB] hover:text-red-400",
                "opacity-0 group-hover:opacity-100 transition-all duration-micro"
              )}
            >
              <Heart className="w-5 h-5" fill="currentColor" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
