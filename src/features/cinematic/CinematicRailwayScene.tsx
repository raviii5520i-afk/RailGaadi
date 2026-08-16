"use client";

import { useRef } from "react";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { TrainVector } from "./TrainVector";
import { DigitalRouteSVG } from "./DigitalRouteSVG";
import { SearchTabs } from "@/features/train-search/SearchTabs";
import { SearchBar } from "@/components/ui/SearchBar";
import { FindTrainsForm } from "@/features/train-search/FindTrainsForm";
import { SearchResults } from "@/features/train-search/SearchResults";
import { RecentSearches } from "@/features/train-search/RecentSearches";
import { FavouriteTrains } from "@/features/train-search/FavouriteTrains";
import { useTrainSearch } from "@/hooks/useTrainSearch";
import { useSearchStore } from "@/store/searchStore";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Train, Sparkles, Navigation2, ArrowRight, ShieldCheck } from "lucide-react";
import { cn } from "@/utils/cn";

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

export function CinematicRailwayScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { progress, isReducedMotion } = useScrollProgress(containerRef);
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

  // Computed anim values based on scrubbed scroll progress
  const trainX = Math.min(105, -30 + progress * 135); // -30vw to 105vw
  const cloudX = -progress * 25; // Parallax slow
  const hillsX = -progress * 60; // Parallax medium
  const polesX = -progress * 150; // Parallax fast

  // Opacity & transform gates
  const scene1TextOpacity = Math.max(0, Math.min(1, (progress - 0.15) / 0.08)) * Math.max(0, Math.min(1, (0.30 - progress) / 0.08));
  const digitalBgOpacity = Math.max(0, Math.min(1, (progress - 0.30) / 0.15));
  const digitalMapOpacity = Math.max(0, Math.min(1, (progress - 0.42) / 0.10)) * Math.max(0, Math.min(1, (0.62 - progress) / 0.08));
  const whereToTextOpacity = Math.max(0, Math.min(1, (progress - 0.60) / 0.06)) * Math.max(0, Math.min(1, (0.72 - progress) / 0.06));
  const searchUIOpacity = Math.max(0, Math.min(1, (progress - 0.70) / 0.10));

  // Reduced motion bypass
  if (isReducedMotion) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-extrabold text-[#111318]">RailGaadi</h1>
          <p className="text-[#6B7280]">Find Your Train. Plan Your Journey.</p>
        </div>
        <SearchTabs
          searchTrainView={
            <SearchBar onSearch={handleSearch} isLoading={isFetching} autoFocus />
          }
          findTrainsView={<FindTrainsForm />}
        />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative w-full h-[600vh]">
      {/* Sticky Cinematic Viewport */}
      <div className="sticky top-0 w-full h-screen overflow-hidden bg-[#0B1220] select-none">
        {/* SCENE 0 & 1 — Physical Landscape Layer */}
        <div
          className="absolute inset-0 transition-opacity duration-300 pointer-events-none"
          style={{ opacity: 1 - digitalBgOpacity }}
        >
          {/* Sky Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A] via-[#1E293B] to-[#334155]" />

          {/* Distant Clouds (Parallax Layer 1) */}
          <div
            className="absolute top-12 left-0 w-[200%] h-32 opacity-25 flex gap-32"
            style={{ transform: `translate3d(${cloudX}vw, 0, 0)` }}
          >
            <div className="w-64 h-20 bg-white/20 rounded-full blur-xl" />
            <div className="w-96 h-28 bg-white/15 rounded-full blur-2xl" />
            <div className="w-80 h-24 bg-white/20 rounded-full blur-xl" />
          </div>

          {/* Distant Hills (Parallax Layer 2) */}
          <div
            className="absolute bottom-32 left-0 w-[200%] h-48 flex items-end opacity-40"
            style={{ transform: `translate3d(${hillsX}vw, 0, 0)` }}
          >
            <svg viewBox="0 0 1200 200" fill="#1E293B" className="w-full h-full">
              <path d="M0 200L150 80L300 200L450 120L600 200L750 90L900 200L1050 100L1200 200Z" />
            </svg>
          </div>

          {/* Catenary Electric Poles (Parallax Layer 3) */}
          <div
            className="absolute bottom-28 left-0 w-[300%] h-40 flex justify-between items-end px-8 opacity-60"
            style={{ transform: `translate3d(${polesX}vw, 0, 0)` }}
          >
            {Array.from({ length: 18 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-16 h-1 bg-[#475569]" />
                <div className="w-1.5 h-36 bg-[#334155]" />
              </div>
            ))}
          </div>

          {/* Railway Track Bed */}
          <div className="absolute bottom-20 left-0 w-full h-12 bg-[#1E293B] border-t-2 border-[#475569] flex items-center justify-between">
            {/* Sleepers */}
            <div className="w-full h-full flex justify-between px-1">
              {Array.from({ length: 60 }).map((_, i) => (
                <div key={i} className="w-2 h-full bg-[#0F172A]" />
              ))}
            </div>
            {/* Rail Lines */}
            <div className="absolute top-2 left-0 w-full h-1 bg-[#94A3B8]" />
            <div className="absolute bottom-2 left-0 w-full h-1 bg-[#64748B]" />
          </div>
        </div>

        {/* SCENE 1 & 2 — Animated Train Vector */}
        <div
          className="absolute bottom-22 z-20 transition-all duration-75"
          style={{
            transform: `translate3d(${trainX}vw, 0, 0)`,
            opacity: digitalBgOpacity > 0.8 ? 1 - (digitalBgOpacity - 0.8) * 5 : 1,
          }}
        >
          <TrainVector />
        </div>

        {/* SCENE 0 Hero Text Overlay */}
        <div
          className="absolute top-1/4 inset-x-0 text-center z-10 pointer-events-none transition-opacity duration-300"
          style={{ opacity: Math.max(0, 1 - progress * 8) }}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-pill bg-[#2563EB]/20 border border-[#2563EB]/40 text-[#38BDF8] text-xs font-semibold mb-4 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            Cinematic Railway Intelligence
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight drop-shadow-lg">
            RailGaadi
          </h1>
          <p className="text-lg md:text-xl text-[#94A3AF] mt-3 font-medium">
            Find Your Train. Plan Your Journey.
          </p>
          <p className="text-xs text-[#38BDF8] mt-8 font-mono animate-pulse">
            ↓ Scroll upward to start your journey
          </p>
        </div>

        {/* SCENE 2 Text Reveal: "Your journey starts here." */}
        <div
          className="absolute top-1/3 inset-x-0 text-center z-10 pointer-events-none transition-all duration-300"
          style={{
            opacity: scene1TextOpacity,
            transform: `translate3d(0, ${(1 - scene1TextOpacity) * 20}px, 0)`,
          }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight drop-shadow-md">
            Your journey starts here.
          </h2>
          <p className="text-sm text-[#38BDF8] mt-2 font-mono">
            Crossing corridors · Connecting India
          </p>
        </div>

        {/* SCENE 3 & 4 — Digital Railway Environment */}
        <div
          className="absolute inset-0 bg-[#0B1220] z-10 flex flex-col items-center justify-center pointer-events-none transition-opacity duration-300"
          style={{ opacity: digitalMapOpacity }}
        >
          <div className="text-center mb-6">
            <span className="text-xs font-mono text-[#38BDF8] uppercase tracking-widest">
              Digital Railway Corridor
            </span>
            <h3 className="text-2xl font-bold text-white mt-1">
              Live Station Route Map
            </h3>
          </div>
          <DigitalRouteSVG progress={progress} />
        </div>

        {/* SCENE 5 Text Reveal: "Where are you going?" */}
        <div
          className="absolute top-1/3 inset-x-0 text-center z-20 pointer-events-none transition-all duration-300"
          style={{
            opacity: whereToTextOpacity,
            transform: `translate3d(0, ${(1 - whereToTextOpacity) * -20}px, 0)`,
          }}
        >
          <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight">
            Where are you going?
          </h2>
        </div>

        {/* SCENE 6, 7 & 8 — Interactive Search UI & Results */}
        <div
          className="absolute inset-0 z-30 flex flex-col justify-start overflow-y-auto px-4 py-8 md:py-12 transition-all duration-300"
          style={{
            opacity: searchUIOpacity,
            transform: `translate3d(0, ${(1 - searchUIOpacity) * 40}px, 0)`,
            pointerEvents: searchUIOpacity > 0.5 ? "auto" : "none",
          }}
        >
          <div className="max-w-3xl mx-auto w-full space-y-6">
            {/* Live System Badge */}
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-pill bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Live API Connected · RailRadar · MapTiler HD · OpenWeather</span>
              </div>
            </div>

            {/* Interactive Search Experience */}
            <SearchTabs
              searchTrainView={
                <div className="relative max-w-2xl mx-auto">
                  <SearchBar
                    onSearch={handleSearch}
                    isLoading={isFetching}
                    placeholder="Enter train number (e.g. 12951, 12301) or train name"
                  />
                  {showResults && (
                    <div className="absolute top-full left-0 right-0 mt-2 z-40">
                      <SearchResults
                        results={results ?? []}
                        isLoading={isLoading}
                        query={query}
                        onSelect={handleSelectTrain}
                      />
                    </div>
                  )}
                </div>
              }
              findTrainsView={
                <div className="max-w-2xl mx-auto">
                  <FindTrainsForm />
                </div>
              }
            />

            {/* Recents & Favourites */}
            {!showResults && (
              <div className="max-w-2xl mx-auto space-y-6">
                <RecentSearches onSelect={handleSelectTrain} />
                <FavouriteTrains onSelect={handleSelectTrain} />
              </div>
            )}

            {/* Popular Express Corridors Showcase */}
            {!showResults && (
              <div className="space-y-3 max-w-2xl mx-auto">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Navigation2 className="w-4 h-4 text-[#38BDF8]" />
                    Popular Express Corridors
                  </h3>
                  <span className="text-xs text-[#94A3AF]">Live API</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {FEATURED_TRAINS.map((ft) => (
                    <div
                      key={ft.number}
                      onClick={() => handleSelectTrain(ft.number, ft.name)}
                      className="bg-[#1E293B]/90 rounded-md border border-[#334155] hover:border-[#38BDF8] p-4 shadow-card hover:shadow-card-hover transition-all duration-micro cursor-pointer group flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-bold text-[#38BDF8]">{ft.number}</span>
                          <span className="text-[10px] font-bold bg-[#2563EB]/20 text-[#38BDF8] px-1.5 py-0.5 rounded-sm">
                            {ft.badge}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-white truncate">{ft.name}</p>
                        <p className="text-xs text-[#94A3AF] truncate mt-0.5">{ft.route}</p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-[#0F172A] group-hover:bg-[#2563EB] group-hover:text-white text-[#94A3AF] flex items-center justify-center flex-shrink-0 transition-colors">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
