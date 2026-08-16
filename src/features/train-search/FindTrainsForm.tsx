"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftRight, Calendar, Clock, Search } from "lucide-react";
import { StationAutocomplete } from "@/components/ui/StationAutocomplete";
import { type StationItem } from "@/constants/stations";
import { cn } from "@/utils/cn";

export function FindTrainsForm() {
  const router = useRouter();
  const [fromStation, setFromStation] = useState<StationItem | null>(null);
  const [toStation, setToStation] = useState<StationItem | null>(null);
  const [date, setDate] = useState<string>("today");
  const [time, setTime] = useState<string>("00:00");

  const handleSwap = () => {
    const temp = fromStation;
    setFromStation(toStation);
    setToStation(temp);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromStation || !toStation) return;

    const fromCode = fromStation.code;
    const toCode = toStation.code;
    const todayStr = new Date().toISOString().split("T")[0];

    router.push(
      `/journey/between?from=${fromCode}&to=${toCode}&date=${todayStr}&time=${time}`
    );
  };

  return (
    <form
      onSubmit={handleSearch}
      className="bg-white rounded-md border border-[#E5E7EB] shadow-card p-4 sm:p-5 space-y-4"
    >
      {/* From / Swap / To */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <StationAutocomplete
          label="From Station"
          value={fromStation}
          onChange={setFromStation}
          placeholder="Search origin station or city..."
        />

        {/* Swap Button */}
        <div className="self-center sm:self-end mb-1">
          <button
            type="button"
            onClick={handleSwap}
            aria-label="Swap starting and destination stations"
            title="Swap stations"
            className="w-10 h-10 rounded-full border border-[#E5E7EB] hover:border-[#2563EB] bg-[#F8F9FB] hover:bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center transition-all duration-micro shadow-xs"
          >
            <ArrowLeftRight className="w-4 h-4 rotate-90 sm:rotate-0" />
          </button>
        </div>

        <StationAutocomplete
          label="To Station"
          value={toStation}
          onChange={setToStation}
          placeholder="Search destination station or city..."
        />
      </div>

      {/* Date & Departure Time Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <div>
          <label className="block text-xs font-medium text-[#6B7280] mb-1">
            Travel Date
          </label>
          <div className="relative">
            <Calendar className="w-4 h-4 text-[#2563EB] absolute left-3 top-1/2 -translate-y-1/2" />
            <select
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full h-12 pl-9 pr-4 bg-white border border-[#E5E7EB] rounded-md text-sm font-semibold text-[#111318] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            >
              <option value="today">Today ({new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric" })})</option>
              <option value="tomorrow">Tomorrow</option>
              <option value="day_after">Day After</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-[#6B7280] mb-1">
            Departure After
          </label>
          <div className="relative">
            <Clock className="w-4 h-4 text-[#2563EB] absolute left-3 top-1/2 -translate-y-1/2" />
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full h-12 pl-9 pr-4 bg-white border border-[#E5E7EB] rounded-md text-sm font-semibold text-[#111318] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            >
              <option value="00:00">Any Time (00:00+)</option>
              <option value="06:00">Morning (06:00+)</option>
              <option value="12:00">Afternoon (12:00+)</option>
              <option value="18:00">Evening (18:00+)</option>
              <option value="21:00">Night (21:00+)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!fromStation || !toStation}
        className={cn(
          "w-full h-12 text-sm font-bold rounded-md flex items-center justify-center gap-2 transition-all duration-micro shadow-sm",
          fromStation && toStation
            ? "bg-[#2563EB] hover:bg-[#1d4ed8] text-white opacity-100"
            : "bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed"
        )}
      >
        <Search className="w-4 h-4" />
        {fromStation && toStation
          ? `Find Trains (${fromStation.code} → ${toStation.code})`
          : "Select From & To Stations"}
      </button>
    </form>
  );
}
