"use client";

import { Moon, Sun, Monitor, RefreshCw, ShieldCheck, Database } from "lucide-react";
import { useTheme, Theme } from "@/hooks/useTheme";
import { cn } from "@/utils/cn";
import { showToast } from "@/components/ui/Toast";

export function SettingsContent() {
  const { theme, setTheme } = useTheme();

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    showToast("Theme Updated", `Switched to ${newTheme} mode.`, "info");
  };

  return (
    <div className="space-y-6 animate-[fade-in_0.3s_ease-out]">
      <h1 className="text-2xl font-bold text-[#111318]">Settings</h1>

      <div className="space-y-4">
        {/* Appearance Section */}
        <SettingsSection title="Appearance">
          <div className="px-4 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[#111318]">Interface Theme</p>
              <p className="text-xs text-[#9CA3AF] mt-0.5">
                Choose between Light, Dark, or System theme preferences.
              </p>
            </div>

            <div className="flex items-center gap-1 bg-[#F3F4F6] p-1 rounded-pill self-start sm:self-auto">
              <ThemeButton
                active={theme === "light"}
                onClick={() => handleThemeChange("light")}
                icon={Sun}
                label="Light"
              />
              <ThemeButton
                active={theme === "dark"}
                onClick={() => handleThemeChange("dark")}
                icon={Moon}
                label="Dark"
              />
              <ThemeButton
                active={theme === "system"}
                onClick={() => handleThemeChange("system")}
                icon={Monitor}
                label="System"
              />
            </div>
          </div>

          <SettingsItem
            label="Reduced Motion"
            description="Automatically respects your OS prefers-reduced-motion accessibility setting."
          />
        </SettingsSection>

        {/* Data & APIs Section */}
        <SettingsSection title="Live Data & APIs">
          <SettingsItem
            label="Live Data Refresh Rate"
            description="Active train tracking refreshes every 30 seconds automatically."
            badge="30s Live"
          />
          <SettingsItem
            label="RailRadar Live API"
            description="Connected · Provides live train location, speed, delay, and station timeline."
            badge="Connected"
            badgeColor="bg-emerald-50 text-emerald-700 border-emerald-200"
          />
          <SettingsItem
            label="MapTiler Vector Maps"
            description="Connected · Provides HD Streets, Topo, Satellite, and Dark map tiles."
            badge="Connected"
            badgeColor="bg-emerald-50 text-emerald-700 border-emerald-200"
          />
          <SettingsItem
            label="OpenWeather API"
            description="Connected · Live station weather forecasts and rain probabilities."
            badge="Connected"
            badgeColor="bg-emerald-50 text-emerald-700 border-emerald-200"
          />
          <SettingsItem
            label="OpenTopography DEM"
            description="Connected · 30m resolution elevation profiling and terrain insights."
            badge="Connected"
            badgeColor="bg-emerald-50 text-emerald-700 border-emerald-200"
          />
        </SettingsSection>

        {/* Platform Info */}
        <SettingsSection title="About RailGaadi">
          <SettingsItem label="Platform Version" description="RailGaadi MVP v1.0 (Production Release)" />
          <SettingsItem
            label="Technology Stack"
            description="Next.js 15 · TypeScript · MapLibre GL · MapTiler · TanStack Query · Zustand"
          />
        </SettingsSection>
      </div>
    </div>
  );
}

function SettingsSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-2 px-1">
        {title}
      </h2>
      <div className="bg-white rounded-md border border-[#E5E7EB] divide-y divide-[#F3F4F6] shadow-card">
        {children}
      </div>
    </section>
  );
}

function SettingsItem({
  label,
  description,
  badge,
  badgeColor,
}: {
  label: string;
  description: string;
  badge?: string;
  badgeColor?: string;
}) {
  return (
    <div className="px-4 py-3.5 flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-semibold text-[#111318]">{label}</p>
        <p className="text-xs text-[#9CA3AF] mt-0.5">{description}</p>
      </div>
      {badge && (
        <span
          className={cn(
            "text-[10px] font-semibold px-2 py-0.5 rounded-pill border flex-shrink-0",
            badgeColor ?? "bg-[#EFF6FF] text-[#2563EB] border-blue-200"
          )}
        >
          {badge}
        </span>
      )}
    </div>
  );
}

function ThemeButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ElementType;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 px-3 py-1.5 rounded-pill text-xs font-medium transition-all duration-micro",
        active
          ? "bg-white text-[#111318] shadow-xs"
          : "text-[#6B7280] hover:text-[#111318]"
      )}
    >
      <Icon className="w-3.5 h-3.5" />
      <span>{label}</span>
    </button>
  );
}
