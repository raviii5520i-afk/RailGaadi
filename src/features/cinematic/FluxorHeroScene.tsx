"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  MapPin,
  ArrowLeftRight,
  Search,
  X,
  Check,
  Calendar,
  Clock,
  Train,
  ArrowRight,
  Navigation2,
  Sparkles,
  ArrowDown,
  CircleDot,
} from "lucide-react";
import { INDIAN_STATIONS, type StationItem } from "@/constants/stations";
import { SearchBar } from "@/components/ui/SearchBar";
import { SearchResults } from "@/features/train-search/SearchResults";
import { RecentSearches } from "@/features/train-search/RecentSearches";
import { FavouriteTrains } from "@/features/train-search/FavouriteTrains";
import { useTrainSearch } from "@/hooks/useTrainSearch";
import { useSearchStore } from "@/store/searchStore";
import { cn } from "@/utils/cn";

const POPULAR_CORRIDORS = [
  {
    fromCode: "ST",
    fromName: "Surat",
    toCode: "NDLS",
    toName: "New Delhi",
    trainsCount: "12 Direct Trains",
  },
  {
    fromCode: "PNBE",
    fromName: "Patna Jn",
    toCode: "HWH",
    toName: "Howrah Jn",
    trainsCount: "14 Direct Trains",
  },
  {
    fromCode: "MAS",
    fromName: "Chennai Central",
    toCode: "SBC",
    toName: "KSR Bengaluru",
    trainsCount: "18 Direct Trains",
  },
  {
    fromCode: "ADI",
    fromName: "Ahmedabad Jn",
    toCode: "MMCT",
    toName: "Mumbai Central",
    trainsCount: "16 Direct Trains",
  },
];

export function FluxorHeroScene() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"find" | "search">("find");

  // Station Search State for Find Trains
  const [fromStation, setFromStation] = useState<StationItem | null>(null);
  const [toStation, setToStation] = useState<StationItem | null>(null);
  const [date, setDate] = useState<string>("today");
  const [time, setTime] = useState<string>("00:00");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isSwapping, setIsSwapping] = useState<boolean>(false);

  // Train Number/Name Search State for Search Train tab
  const [query, setQuery] = useState("");
  const { addRecentSearch } = useSearchStore();
  const { data: results, isLoading, isFetching } = useTrainSearch(query);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!fromStation) {
      setValidationError("Please select a starting station.");
      return;
    }
    if (!toStation) {
      setValidationError("Please select a destination station.");
      return;
    }
    if (fromStation.code === toStation.code) {
      setValidationError("Starting station and destination cannot be the same.");
      return;
    }

    setIsSearching(true);
    const todayStr = new Date().toISOString().split("T")[0];

    setTimeout(() => {
      router.push(
        `/journey/between?from=${fromStation.code}&to=${toStation.code}&date=${todayStr}&time=${time}`
      );
    }, 350);
  };

  const handleSwap = () => {
    setIsSwapping(true);
    const temp = fromStation;
    setFromStation(toStation);
    setToStation(temp);
    setValidationError(null);
    setTimeout(() => setIsSwapping(false), 300);
  };

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

  const showResults = activeTab === "search" && query.length >= 2 && (results || isLoading);

  return (
    <div className="relative w-full min-h-screen bg-[#071A3D] text-white overflow-x-hidden flex flex-col justify-between select-none">

      {/* FULL-SCREEN VANDE BHARAT HERO IMAGE BACKDROP WITH GRADIENT OVERLAY */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <Image
          src="/vande_bharat_hero.png"
          alt="Vande Bharat Express Background"
          fill
          priority
          className="object-cover object-center opacity-30 mix-blend-overlay scale-105 transition-transform duration-1000"
        />
        {/* Navy Gradient Overlay for High Contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#071A3D]/90 via-[#071A3D]/85 to-[#071A3D]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[600px] bg-gradient-to-b from-[#2563EB]/25 via-[#0B2D6B]/30 to-transparent rounded-full blur-[150px]" />
      </div>

      {/* MAIN HERO CONTENT CONTAINER */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 pt-8 md:pt-12 pb-6 flex-1 flex flex-col justify-between w-full">

        {/* HERO COPY */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-tight drop-shadow-lg">
            Find Your Train. <br />
            <span className="text-[#38BDF8]">Plan Your Journey.</span>
          </h1>

          <p className="text-sm sm:text-base text-[#94A3B8] max-w-xl mx-auto font-medium">
            Choose your stations and discover every train running between them.
          </p>
        </div>

        {/* TAB SWITCHER: FIND TRAINS (DEFAULT) VS SEARCH TRAIN */}
        <div className="flex bg-[#0B2D6B]/80 p-1.5 rounded-full border border-white/15 max-w-sm mx-auto my-4 backdrop-blur-md shadow-xl">
          <button
            type="button"
            onClick={() => {
              setActiveTab("find");
              setValidationError(null);
            }}
            className={cn(
              "flex-1 py-2.5 px-4 text-xs font-bold rounded-full transition-all duration-200 flex items-center justify-center gap-2",
              activeTab === "find"
                ? "bg-[#2563EB] text-white shadow-md"
                : "text-[#94A3B8] hover:text-white"
            )}
          >
            <Navigation2 className="w-3.5 h-3.5" />
            <span>Find Trains</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("search");
              setValidationError(null);
            }}
            className={cn(
              "flex-1 py-2.5 px-4 text-xs font-bold rounded-full transition-all duration-200 flex items-center justify-center gap-2",
              activeTab === "search"
                ? "bg-[#2563EB] text-white shadow-md"
                : "text-[#94A3B8] hover:text-white"
            )}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search Train</span>
          </button>
        </div>

        {/* MAIN GLASSMORPHIC SEARCH CARD */}
        <div className="max-w-xl mx-auto w-full">
          {activeTab === "find" ? (
            <form
              onSubmit={handleSearchSubmit}
              className="bg-[#0B2D6B]/50 backdrop-blur-xl border border-white/20 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4"
            >
              {/* FROM & TO STATION INPUTS WITH DIRECTIONAL START -> END ARROW & SWAP BUTTON */}
              <div className="relative space-y-3">
                {/* FROM / START STATION WITH CURRENT LOCATION DETECT BUTTON */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-[#38BDF8] font-bold px-1">
                    <span>STARTING STATION</span>
                    <button
                      type="button"
                      onClick={() => {
                        if ("geolocation" in navigator) {
                          navigator.geolocation.getCurrentPosition(
                            (pos) => {
                              const lat = pos.coords.latitude;
                              const lng = pos.coords.longitude;
                              // Find nearest station
                              let closest = INDIAN_STATIONS[0];
                              let minDist = Infinity;
                              for (const stn of INDIAN_STATIONS) {
                                if (stn.latitude && stn.longitude) {
                                  const d = Math.hypot(stn.latitude - lat, stn.longitude - lng);
                                  if (d < minDist) {
                                    minDist = d;
                                    closest = stn;
                                  }
                                }
                              }
                              setFromStation(closest);
                              setValidationError(null);
                            },
                            () => {
                              // Default fallback to Surat (ST) on position error
                              const fallback = INDIAN_STATIONS.find((s) => s.code === "ST") || INDIAN_STATIONS[0];
                              setFromStation(fallback);
                              setValidationError(null);
                            }
                          );
                        } else {
                          const fallback = INDIAN_STATIONS.find((s) => s.code === "ST") || INDIAN_STATIONS[0];
                          setFromStation(fallback);
                          setValidationError(null);
                        }
                      }}
                      className="text-[#FFD84D] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Navigation2 className="w-3 h-3" />
                      <span>Use Current Location</span>
                    </button>
                  </div>
                  <HeroStationAutocomplete
                    placeholder="Enter starting station"
                    value={fromStation}
                    onChange={(stn) => {
                      setFromStation(stn);
                      setValidationError(null);
                    }}
                    onClear={() => {
                      setFromStation(null);
                      setValidationError(null);
                    }}
                  />
                </div>

                {/* VERTICAL DOTTED ARROW CONNECTION (MATCHING MOCKUP) & SWAP BUTTON */}
                <div className="relative flex items-center justify-between px-3 py-0.5 z-20">
                  {/* Vertical Dotted Line with Downward Arrowhead Aligned with Left Node */}
                  <div className="flex items-center gap-2 pl-1.5">
                    <svg width="16" height="24" viewBox="0 0 16 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <line x1="8" y1="0" x2="8" y2="18" stroke="#38BDF8" strokeWidth="2" strokeDasharray="3 3" />
                      <path d="M4 14L8 20L12 14" stroke="#FFD84D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>

                  {/* Circular Swap Button */}
                  <button
                    type="button"
                    onClick={handleSwap}
                    title="Swap starting and destination stations"
                    className={cn(
                      "w-9 h-9 rounded-full bg-[#FFD84D] hover:bg-[#ffe066] text-[#071A3D] flex items-center justify-center font-extrabold shadow-md transition-transform duration-300",
                      isSwapping && "rotate-180 scale-110"
                    )}
                  >
                    <ArrowLeftRight className="w-3.5 h-3.5 rotate-90" />
                  </button>
                </div>

                {/* TO / END STATION */}
                <HeroStationAutocomplete
                  placeholder="Enter destination station"
                  value={toStation}
                  onChange={(stn) => {
                    setToStation(stn);
                    setValidationError(null);
                  }}
                  onClear={() => {
                    setToStation(null);
                    setValidationError(null);
                  }}
                />
              </div>

              {/* DATE & TIME FILTERS */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider mb-1">
                    Travel Date
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-[#38BDF8] absolute left-3 top-1/2 -translate-y-1/2" />
                    <select
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full h-11 pl-9 pr-3 bg-white/10 border border-white/15 rounded-lg text-xs font-semibold text-white focus:outline-none focus:border-[#2563EB]"
                    >
                      <option value="today" className="bg-[#071A3D]">Today ({new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric" })})</option>
                      <option value="tomorrow" className="bg-[#071A3D]">Tomorrow</option>
                      <option value="day_after" className="bg-[#071A3D]">Day After</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider mb-1">
                    Departure Time
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-[#38BDF8] absolute left-3 top-1/2 -translate-y-1/2" />
                    <select
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full h-11 pl-9 pr-3 bg-white/10 border border-white/15 rounded-lg text-xs font-semibold text-white focus:outline-none focus:border-[#2563EB]"
                    >
                      <option value="00:00" className="bg-[#071A3D]">Any Time (00:00+)</option>
                      <option value="06:00" className="bg-[#071A3D]">Morning (06:00+)</option>
                      <option value="12:00" className="bg-[#071A3D]">Afternoon (12:00+)</option>
                      <option value="18:00" className="bg-[#071A3D]">Evening (18:00+)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* VALIDATION ERROR MESSAGE */}
              {validationError && (
                <p className="text-xs font-semibold text-amber-300 text-center animate-[fade-in_0.2s_ease-out]">
                  ⚠️ {validationError}
                </p>
              )}

              {/* FIND TRAINS BUTTON */}
              <button
                type="submit"
                disabled={isSearching}
                className={cn(
                  "w-full h-12 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 transition-all duration-200 shadow-xl group",
                  "bg-[#FFD84D] hover:bg-[#ffe066] text-[#071A3D] active:scale-[0.99]"
                )}
              >
                {isSearching ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-[#071A3D] border-t-transparent rounded-full animate-spin" />
                    Finding Trains...
                  </span>
                ) : (
                  <>
                    <span>Find Trains</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* TRAIN NUMBER / NAME SEARCH TAB */
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setValidationError(null);
                const trimmed = query.trim();
                if (!trimmed) {
                  setValidationError("Please enter a train number or train name.");
                  return;
                }
                if (results && results.length > 0) {
                  handleSelectTrain(results[0].trainNumber, results[0].name);
                } else if (/^\d{4,5}$/.test(trimmed)) {
                  handleSelectTrain(trimmed, `Train ${trimmed}`);
                } else {
                  setValidationError(`No train found matching "${trimmed}".`);
                }
              }}
              className="bg-[#0B2D6B]/50 backdrop-blur-xl border border-white/20 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4"
            >
              <div className="relative">
                <SearchBar
                  onSearch={(q) => {
                    setQuery(q);
                    setValidationError(null);
                  }}
                  isLoading={isFetching}
                  placeholder="Enter train number (e.g. 12951, 12301, 13554) or train name"
                  autoFocus
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

              {/* VALIDATION ERROR MESSAGE */}
              {validationError && (
                <p className="text-xs font-semibold text-amber-300 text-center animate-[fade-in_0.2s_ease-out]">
                  ⚠️ {validationError}
                </p>
              )}

              {/* SEARCH TRAIN SUBMIT BUTTON */}
              <button
                type="submit"
                className={cn(
                  "w-full h-12 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 transition-all duration-200 shadow-xl group",
                  "bg-[#FFD84D] hover:bg-[#ffe066] text-[#071A3D] active:scale-[0.99]"
                )}
              >
                <Search className="w-4 h-4" />
                <span>Search Train</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          )}
        </div>

        {/* RECENTS & FAVOURITES */}
        {!showResults && (
          <div className="max-w-xl mx-auto w-full space-y-3 my-2">
            <RecentSearches onSelect={handleSelectTrain} />
            <FavouriteTrains onSelect={handleSelectTrain} />
          </div>
        )}

        {/* POPULAR ROUTE QUICK CARDS */}
        {!showResults && (
          <div className="max-w-xl mx-auto w-full space-y-2 pt-1">
            <p className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#FFD84D]" /> Popular Express Corridors
            </p>
            <div className="grid grid-cols-2 gap-2">
              {POPULAR_CORRIDORS.map((c) => (
                <button
                  key={`${c.fromCode}-${c.toCode}`}
                  type="button"
                  onClick={() => {
                    const fromStn = INDIAN_STATIONS.find((s) => s.code === c.fromCode) || null;
                    const toStn = INDIAN_STATIONS.find((s) => s.code === c.toCode) || null;
                    setFromStation(fromStn);
                    setToStation(toStn);
                    setActiveTab("find");
                  }}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-2.5 text-left transition-colors flex items-center justify-between group"
                >
                  <div>
                    <p className="text-xs font-bold text-white flex items-center gap-1">
                      <span>{c.fromName}</span>
                      <span className="text-[10px] text-[#38BDF8]">({c.fromCode})</span>
                      <span className="text-white/40">→</span>
                      <span>{c.toName}</span>
                      <span className="text-[10px] text-[#38BDF8]">({c.toCode})</span>
                    </p>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">{c.trainsCount}</p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#FFD84D] group-hover:translate-x-0.5 transition-transform" />
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

/** PREMIUM HERO AUTOCOMPLETE COMPONENT */
function HeroStationAutocomplete({
  placeholder,
  value,
  onChange,
  onClear,
}: {
  placeholder: string;
  value: StationItem | null;
  onChange: (station: StationItem) => void;
  onClear: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState(value ? `${value.name}` : "");
  const [results, setResults] = useState<StationItem[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      setQuery(value.name);
    } else {
      setQuery("");
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (q: string) => {
    setQuery(q);
    setIsOpen(true);
    const trimmed = q.trim().toLowerCase();
    if (!trimmed) {
      setResults(INDIAN_STATIONS.slice(0, 8));
      return;
    }
    const matches = INDIAN_STATIONS.filter(
      (s) =>
        s.code.toLowerCase().includes(trimmed) ||
        s.name.toLowerCase().includes(trimmed) ||
        s.city.toLowerCase().includes(trimmed) ||
        s.state.toLowerCase().includes(trimmed)
    ).slice(0, 8);
    setResults(matches);
  };

  const handleSelect = (stn: StationItem) => {
    onChange(stn);
    setQuery(stn.name);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#38BDF8]">
          <div className="w-3.5 h-3.5 rounded-full border-2 border-[#38BDF8] bg-[#071A3D]" />
        </div>

        <input
          type="text"
          value={query}
          onFocus={() => {
            handleSearch(value ? "" : query);
            setIsOpen(true);
          }}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "w-full h-12 pl-10 pr-20 bg-white/10 border border-white/15 rounded-xl",
            "text-sm font-semibold text-white placeholder:text-[#94A3B8] placeholder:font-normal",
            "transition-all duration-150 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/40"
          )}
        />

        {/* STATION CODE BADGE & CLEAR BUTTON */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
          {value && (
            <span className="text-[10px] font-bold bg-[#2563EB] text-white px-2 py-0.5 rounded-md font-mono">
              {value.code}
            </span>
          )}

          {(query || value) && (
            <button
              type="button"
              onClick={onClear}
              className="p-1 text-[#94A3B8] hover:text-white rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* AUTOCOMPLETE DROPDOWN */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-[#071A3D] border border-white/20 rounded-xl shadow-2xl overflow-hidden max-h-56 overflow-y-auto animate-[fade-in_0.15s_ease-out]">
          {results.length === 0 ? (
            <div className="px-4 py-3 text-center text-xs text-[#94A3B8]">
              No stations found matching "{query}"
            </div>
          ) : (
            <ul>
              {results.map((stn) => {
                const isSelected = value?.code === stn.code;
                return (
                  <li key={stn.code}>
                    <button
                      type="button"
                      onClick={() => handleSelect(stn)}
                      className={cn(
                        "w-full flex items-center justify-between px-4 py-2.5 text-left text-xs transition-colors border-b border-white/5 last:border-b-0",
                        isSelected ? "bg-[#2563EB]/30 text-white" : "hover:bg-white/10 text-white/90"
                      )}
                    >
                      <div>
                        <p className="font-bold text-white text-xs">{stn.name}</p>
                        <p className="text-[11px] text-[#94A3B8]">{stn.city}, {stn.state}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] bg-[#2563EB] px-1.5 py-0.5 rounded text-white font-bold">
                          {stn.code}
                        </span>
                        {isSelected && <Check className="w-4 h-4 text-[#38BDF8]" />}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
