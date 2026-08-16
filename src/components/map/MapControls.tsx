"use client";

import { Plus, Minus, Compass, Crosshair, Navigation2, Layers, Globe, Mountain, Moon } from "lucide-react";
import { useMapStore } from "@/store/mapStore";
import { cn } from "@/utils/cn";
import type { RefObject } from "react";
import type * as maptilersdk from "@maptiler/sdk";

interface MapControlsProps {
  mapRef: RefObject<maptilersdk.Map | null>;
}

export function MapControls({ mapRef }: MapControlsProps) {
  const { followMode, setFollowMode, setUserHasPanned, mapStyleType, setMapStyleType } =
    useMapStore();

  const zoomIn = () => mapRef.current?.zoomIn({ duration: 300 });
  const zoomOut = () => mapRef.current?.zoomOut({ duration: 300 });
  const resetBearing = () => mapRef.current?.resetNorth({ duration: 300 });
  const recenter = () => {
    setFollowMode(true);
    setUserHasPanned(false);
  };

  return (
    <>
      {/* MapTiler Style Selector Bar (Top Left) */}
      <div className="absolute top-3 left-3 z-10 flex items-center bg-white/90 backdrop-blur-md border border-[#E5E7EB] rounded-pill p-1 shadow-map-control gap-0.5">
        <StyleButton
          active={mapStyleType === "streets"}
          onClick={() => setMapStyleType("streets")}
          label="MapTiler Streets"
          icon={Layers}
        >
          Streets
        </StyleButton>
        <StyleButton
          active={mapStyleType === "outdoor"}
          onClick={() => setMapStyleType("outdoor")}
          label="MapTiler Topo Outdoor"
          icon={Mountain}
        >
          Topo
        </StyleButton>
        <StyleButton
          active={mapStyleType === "satellite"}
          onClick={() => setMapStyleType("satellite")}
          label="MapTiler Satellite Hybrid"
          icon={Globe}
        >
          Satellite
        </StyleButton>
        <StyleButton
          active={mapStyleType === "dark"}
          onClick={() => setMapStyleType("dark")}
          label="MapTiler Dark Mode"
          icon={Moon}
        >
          Dark
        </StyleButton>
      </div>

      {/* Zoom controls (Top Right) */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-px shadow-map-control rounded-sm overflow-hidden border border-[#E5E7EB]">
        <MapControlButton onClick={zoomIn} label="Zoom in">
          <Plus className="w-4 h-4" />
        </MapControlButton>
        <MapControlButton onClick={zoomOut} label="Zoom out">
          <Minus className="w-4 h-4" />
        </MapControlButton>
      </div>

      {/* Compass + Recenter (Middle Right) */}
      <div className="absolute top-20 right-3 z-10 flex flex-col gap-1.5">
        <MapControlButton onClick={resetBearing} label="Reset bearing">
          <Compass className="w-4 h-4" />
        </MapControlButton>
        <MapControlButton onClick={recenter} label="Recenter on train">
          <Crosshair className="w-4 h-4" />
        </MapControlButton>
      </div>

      {/* Follow Train Floating Action Button (Bottom Right) */}
      {!followMode && (
        <div className="absolute bottom-4 right-3 z-10">
          <button
            type="button"
            onClick={recenter}
            aria-label="Follow train"
            className={cn(
              "flex items-center gap-2 px-3.5 py-2.5 rounded-pill shadow-map-control",
              "bg-[#2563EB] text-white text-xs font-semibold tracking-wide",
              "hover:bg-[#1d4ed8] transition-colors duration-micro",
              "animate-[slide-up_0.2s_ease-out]"
            )}
          >
            <Navigation2 className="w-4 h-4" />
            Follow Train
          </button>
        </div>
      )}
    </>
  );
}

function StyleButton({
  active,
  onClick,
  label,
  icon: Icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        "flex items-center gap-1 px-2.5 py-1 rounded-pill text-[11px] font-medium transition-all duration-micro",
        active
          ? "bg-[#2563EB] text-white shadow-xs"
          : "text-[#6B7280] hover:text-[#111318] hover:bg-[#F3F4F6]"
      )}
    >
      <Icon className="w-3 h-3" />
      <span className="hidden sm:inline">{children}</span>
    </button>
  );
}

function MapControlButton({
  onClick,
  label,
  children,
}: {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        "w-9 h-9 bg-white flex items-center justify-center",
        "text-[#6B7280] hover:text-[#111318] hover:bg-[#F8F9FB]",
        "transition-colors duration-micro",
        "focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#2563EB]"
      )}
    >
      {children}
    </button>
  );
}
