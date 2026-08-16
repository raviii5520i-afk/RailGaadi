"use client";

import { Heart, ArrowRight } from "lucide-react";
import { useSearchStore } from "@/store/searchStore";
import { cn } from "@/utils/cn";

interface FavouriteTrainsProps {
  onSelect: (trainNumber: string, trainName: string) => void;
}

export function FavouriteTrains({ onSelect }: FavouriteTrainsProps) {
  const { favouriteTrains } = useSearchStore();

  if (favouriteTrains.length === 0) return null;

  return (
    <section aria-label="Favourite trains">
      <div className="flex items-center gap-2 mb-3">
        <Heart className="w-3.5 h-3.5 text-[#9CA3AF]" aria-hidden="true" />
        <h2 className="text-sm font-semibold text-[#111318]">Favourites</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {favouriteTrains.map((train) => (
          <button
            key={train.number}
            type="button"
            onClick={() => onSelect(train.number, train.name)}
            className={cn(
              "flex items-center gap-3 px-4 py-3 bg-white rounded-md",
              "border border-[#E5E7EB] text-left",
              "hover:border-[#D1D5DB] hover:shadow-card-hover transition-all duration-micro"
            )}
            aria-label={`Track ${train.name}`}
          >
            <div className="flex-1 min-w-0">
              <p className="text-xs text-[#9CA3AF] mb-0.5">{train.number}</p>
              <p className="text-sm font-semibold text-[#111318] truncate">
                {train.name}
              </p>
              <p className="text-xs text-[#9CA3AF] truncate mt-0.5">
                {train.origin.name} → {train.destination.name}
              </p>
            </div>
            <ArrowRight
              className="w-4 h-4 text-[#D1D5DB] flex-shrink-0"
              aria-hidden="true"
            />
          </button>
        ))}
      </div>
    </section>
  );
}
