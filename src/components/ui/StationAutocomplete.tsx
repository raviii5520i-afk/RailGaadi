"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { MapPin, X, Check, Search } from "lucide-react";
import { INDIAN_STATIONS, type StationItem } from "@/constants/stations";
import { cn } from "@/utils/cn";

interface StationAutocompleteProps {
  label: string;
  value: StationItem | null;
  onChange: (station: StationItem) => void;
  placeholder?: string;
  className?: string;
}

export function StationAutocomplete({
  label,
  value,
  onChange,
  placeholder = "Search station or city...",
  className,
}: StationAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState(value ? `${value.name} (${value.code})` : "");
  const [results, setResults] = useState<StationItem[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      setQuery(`${value.name} (${value.code})`);
    } else {
      setQuery("");
    }
  }, [value]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = useCallback((q: string) => {
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
    ).slice(0, 10);

    setResults(matches);
  }, []);

  const handleSelect = (stn: StationItem) => {
    onChange(stn);
    setQuery(`${stn.name} (${stn.code})`);
    setIsOpen(false);
  };

  const handleClear = () => {
    setQuery("");
    setResults(INDIAN_STATIONS.slice(0, 8));
    setIsOpen(true);
  };

  return (
    <div ref={containerRef} className={cn("relative flex-1", className)}>
      <label className="block text-xs font-medium text-[#6B7280] mb-1">
        {label}
      </label>

      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
          <MapPin className="w-4 h-4 text-[#2563EB]" aria-hidden="true" />
        </div>

        <input
          type="text"
          value={query}
          onFocus={() => {
            handleSearch(query.includes("(") ? "" : query);
            setIsOpen(true);
          }}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "w-full h-12 pl-9 pr-8 bg-white border border-[#E5E7EB] rounded-md",
            "text-sm font-semibold text-[#111318] placeholder:text-[#9CA3AF] placeholder:font-normal",
            "transition-all duration-150",
            "focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-0 focus:border-[#2563EB]",
            "hover:border-[#D1D5DB]"
          )}
        />

        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#9CA3AF] hover:text-[#111318] rounded-sm"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1 z-40 bg-white rounded-md border border-[#E5E7EB] shadow-modal overflow-hidden max-h-60 overflow-y-auto">
          {results.length === 0 ? (
            <div className="px-4 py-3 text-center text-xs text-[#9CA3AF]">
              No stations found matching &quot;{query}&quot;
            </div>
          ) : (
            <ul role="listbox">
              {results.map((stn) => {
                const isSelected = value?.code === stn.code;
                return (
                  <li key={stn.code} role="option" aria-selected={isSelected}>
                    <button
                      type="button"
                      onClick={() => handleSelect(stn)}
                      className={cn(
                        "w-full flex items-center justify-between px-3.5 py-2.5 text-left text-xs transition-colors duration-micro border-b border-[#F3F4F6] last:border-b-0",
                        isSelected ? "bg-[#EFF6FF]" : "hover:bg-[#F8F9FB]"
                      )}
                    >
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-[#111318]">{stn.name}</span>
                          <span className="font-mono text-[10px] bg-[#F3F4F6] px-1 py-0.5 rounded-sm font-bold text-[#2563EB]">
                            {stn.code}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#9CA3AF] truncate mt-0.5">
                          {stn.city}, {stn.state}
                        </p>
                      </div>

                      {isSelected && (
                        <Check className="w-4 h-4 text-[#2563EB] flex-shrink-0" />
                      )}
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
