"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Search, X, Loader2, Clock, Star } from "lucide-react";
import { cn } from "@/utils/cn";
import { useSearchStore } from "@/store/searchStore";
import { APP_CONFIG } from "@/constants/config";

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

export function SearchBar({
  onSearch,
  isLoading = false,
  placeholder = "Search train number or name",
  className,
  autoFocus = false,
}: SearchBarProps) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { setSearchQuery } = useSearchStore();

  // Keyboard shortcut ⌘K / Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape" && document.activeElement === inputRef.current) {
        handleClear();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      setValue(v);
      setSearchQuery(v);

      if (debounceRef.current) clearTimeout(debounceRef.current);

      if (v.length >= APP_CONFIG.search.minChars) {
        debounceRef.current = setTimeout(() => {
          onSearch(v);
        }, APP_CONFIG.search.debounceMs);
      } else {
        onSearch("");
      }
    },
    [onSearch, setSearchQuery]
  );

  const handleClear = useCallback(() => {
    setValue("");
    setSearchQuery("");
    onSearch("");
    inputRef.current?.focus();
    if (debounceRef.current) clearTimeout(debounceRef.current);
  }, [onSearch, setSearchQuery]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && value.trim().length >= 2) {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      onSearch(value.trim());
    }
  };

  return (
    <div className={cn("relative group", className)}>
      <label htmlFor="train-search" className="sr-only">
        Search for a train by number or name
      </label>

      {/* Search icon */}
      <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]">
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
        ) : (
          <Search className="w-5 h-5" aria-hidden="true" />
        )}
      </div>

      <input
        ref={inputRef}
        id="train-search"
        type="search"
        inputMode="search"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        autoFocus={autoFocus}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        aria-label="Search trains"
        aria-busy={isLoading}
        className={cn(
          "w-full h-14 pl-12 pr-28 bg-white border border-[#E5E7EB] rounded-md",
          "text-[#111318] text-base placeholder:text-[#9CA3AF]",
          "transition-all duration-150",
          "focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-0 focus:border-[#2563EB]",
          "hover:border-[#D1D5DB]",
          "shadow-card"
        )}
      />

      {/* Right side actions */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
        {value && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
            className={cn(
              "p-1 rounded-sm text-[#9CA3AF] hover:text-[#6B7280]",
              "transition-colors duration-micro"
            )}
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <kbd
          className="hidden sm:inline-flex items-center gap-0.5 px-2 py-1 text-xs font-medium text-[#9CA3AF] bg-[#F3F4F6] border border-[#E5E7EB] rounded-sm"
          aria-label="Keyboard shortcut: Command K"
        >
          <span className="text-[10px]">⌘</span>K
        </kbd>
      </div>
    </div>
  );
}
