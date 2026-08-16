"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Train, Zap, Map, TrendingUp, Compass, ArrowRight, ShieldCheck, Sparkles, Navigation2 } from "lucide-react";
import { SearchBar } from "@/components/ui/SearchBar";
import { SearchResults } from "@/features/train-search/SearchResults";
import { RecentSearches } from "@/features/train-search/RecentSearches";
import { FavouriteTrains } from "@/features/train-search/FavouriteTrains";
import { SearchTabs } from "@/features/train-search/SearchTabs";
import { FindTrainsForm } from "@/features/train-search/FindTrainsForm";
import { useTrainSearch } from "@/hooks/useTrainSearch";
import { useSearchStore } from "@/store/searchStore";

const FEATURED_TRAINS = [
  {
    number: "12951",
    name: "Mumbai Rajdhani",
    route: "Mumbai Central → New Delhi",
    type: "Tejas Rajdhani",
    badge: "Premium",
  },
  {
    number: "12301",
    name: "Howrah Rajdhani",
    route: "Howrah Jn → New Delhi",
    type: "Rajdhani Express",
    badge: "Superfast",
  },
  {
    number: "12002",
    name: "Bhopal Shatabdi",
    route: "New Delhi → Rani Kamlapati",
    type: "Shatabdi Express",
    badge: "High Speed",
  },
  {
    number: "12141",
    name: "Patliputra Express",
    route: "Lokmanya Tilak → Patliputra",
    type: "SF Express",
    badge: "Express",
  },
];

const FEATURES = [
  {
    icon: Zap,
    title: "Live GPS Tracking",
    description: "Real-time train coordinates, current station, next halt, and live delay telemetry.",
  },
  {
    icon: Map,
    title: "MapTiler HD Vector Map",
    description: "Interactive railway route canvas with satellite hybrid, topo terrain, and follow mode.",
  },
  {
    icon: TrendingUp,
    title: "Elevation & Analytics",
    description: "OpenTopography 30m DEM elevation profiles, mountain pass alerts, and delay trends.",
  },
];

export function HomeContent() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const { addRecentSearch } = useSearchStore();

  const { data: results, isLoading, isFetching } = useTrainSearch(query);

  const handleSearch = useCallback((q: string) => {
    setQuery(q);
  }, []);

  const handleSelectTrain = useCallback(
    (trainNumber: string, trainName: string) => {
      addRecentSearch({
        trainNumber,
        trainName,
        lastViewed: new Date().toISOString(),
      });
      router.push(`/journey/${trainNumber}`);
    },
    [addRecentSearch, router]
  );

  const showResults = query.length >= 2 && (results || isLoading);

  const searchTrainView = (
    <div className="relative max-w-2xl mx-auto">
      <SearchBar
        onSearch={handleSearch}
        isLoading={isFetching}
        placeholder="Enter train number (e.g. 12951, 12301) or train name"
        autoFocus
      />

      {/* Quick Search Chips */}
      {!showResults && (
        <div className="mt-3 flex items-center justify-center gap-1.5 flex-wrap text-xs">
          <span className="text-[#9CA3AF] font-medium mr-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#2563EB]" /> Quick Search:
          </span>
          {FEATURED_TRAINS.map((ft) => (
            <button
              key={ft.number}
              type="button"
              onClick={() => handleSelectTrain(ft.number, ft.name)}
              className="px-2.5 py-1 bg-white hover:bg-[#EFF6FF] border border-[#E5E7EB] hover:border-[#93C5FD] text-[#111318] hover:text-[#2563EB] font-medium rounded-pill transition-all duration-micro shadow-xs flex items-center gap-1"
            >
              <span>{ft.number}</span>
              <span className="text-[#9CA3AF] font-normal">({ft.name})</span>
            </button>
          ))}
        </div>
      )}

      {/* Dropdown Results */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 z-30">
          <SearchResults
            results={results ?? []}
            isLoading={isLoading}
            query={query}
            onSelect={handleSelectTrain}
          />
        </div>
      )}
    </div>
  );

  const findTrainsView = (
    <div className="max-w-2xl mx-auto">
      <FindTrainsForm />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 space-y-8">
      {/* Live System Status Chip */}
      <div className="flex justify-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-pill bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Live API Connected · RailRadar · MapTiler HD · OpenWeather · OpenTopography</span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="text-center space-y-3 animate-[fade-in_0.4s_ease-out]">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-[#2563EB] rounded-2xl shadow-[0_10px_30px_rgba(37,99,235,0.35)] mb-1">
          <Train className="w-7 h-7 text-white" aria-hidden="true" />
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold text-[#111318] leading-tight tracking-tight">
          Where are you going?
        </h1>
        <p className="text-[#6B7280] text-base max-w-lg mx-auto">
          Find trains between stations or track any live train in real time.
        </p>
      </div>

      {/* Search Experience Mode Switcher */}
      <SearchTabs
        searchTrainView={searchTrainView}
        findTrainsView={findTrainsView}
      />

      {/* Recents & Favourites */}
      {!showResults && (
        <div className="max-w-2xl mx-auto space-y-6 animate-[fade-in_0.3s_ease-out]">
          <RecentSearches onSelect={handleSelectTrain} />
          <FavouriteTrains onSelect={handleSelectTrain} />
        </div>
      )}

      {/* Popular Live Trains Showcase */}
      {!showResults && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#111318] flex items-center gap-2">
              <Navigation2 className="w-4 h-4 text-[#2563EB]" />
              Popular Express Corridors
            </h2>
            <span className="text-xs text-[#9CA3AF]">Live API</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {FEATURED_TRAINS.map((ft) => (
              <div
                key={ft.number}
                onClick={() => handleSelectTrain(ft.number, ft.name)}
                className="bg-white rounded-md border border-[#E5E7EB] hover:border-[#93C5FD] p-4 shadow-card hover:shadow-card-hover transition-all duration-micro cursor-pointer group flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-[#2563EB]">{ft.number}</span>
                    <span className="text-[10px] font-semibold bg-[#EFF6FF] text-[#2563EB] px-1.5 py-0.5 rounded-sm">
                      {ft.badge}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-[#111318] truncate">{ft.name}</p>
                  <p className="text-xs text-[#9CA3AF] truncate mt-0.5">{ft.route}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#F8F9FB] group-hover:bg-[#2563EB] group-hover:text-white text-[#6B7280] flex items-center justify-center flex-shrink-0 transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Feature Highlights Grid */}
      {!showResults && (
        <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="bg-white rounded-md border border-[#E5E7EB] p-5 shadow-card hover:shadow-card-hover transition-shadow"
            >
              <div className="w-9 h-9 bg-[#EFF6FF] rounded-md flex items-center justify-center mb-3">
                <Icon className="w-5 h-5 text-[#2563EB]" aria-hidden="true" />
              </div>
              <p className="text-sm font-bold text-[#111318] mb-1">{title}</p>
              <p className="text-xs text-[#6B7280] leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
