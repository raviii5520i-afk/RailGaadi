import { create } from "zustand";
import { APP_CONFIG } from "@/constants/config";

type MapLayer = "route" | "stations" | "geography" | "attractions" | "weather";

interface MapState {
  // Camera
  center: [number, number];
  zoom: number;
  pitch: number;
  bearing: number;
  setCenter: (center: [number, number]) => void;
  setZoom: (zoom: number) => void;
  setPitch: (pitch: number) => void;
  setBearing: (bearing: number) => void;

  // Follow mode
  followMode: boolean;
  setFollowMode: (enabled: boolean) => void;
  toggleFollowMode: () => void;

  // Active layers
  activeLayers: Set<MapLayer>;
  toggleLayer: (layer: MapLayer) => void;
  isLayerActive: (layer: MapLayer) => boolean;

  // Map theme & style
  isDarkMap: boolean;
  setDarkMap: (dark: boolean) => void;
  mapStyleType: "streets" | "outdoor" | "satellite" | "dark";
  setMapStyleType: (style: "streets" | "outdoor" | "satellite" | "dark") => void;

  // Fullscreen
  isFullscreen: boolean;
  setFullscreen: (fullscreen: boolean) => void;

  // User panned (disables follow temporarily)
  userHasPanned: boolean;
  setUserHasPanned: (panned: boolean) => void;
}

export const useMapStore = create<MapState>()((set, get) => ({
  center: APP_CONFIG.map.defaultCenter,
  zoom: APP_CONFIG.map.defaultZoom,
  pitch: 0,
  bearing: 0,

  setCenter: (center) => set({ center }),
  setZoom: (zoom) => set({ zoom }),
  setPitch: (pitch) => set({ pitch }),
  setBearing: (bearing) => set({ bearing }),

  followMode: true,
  setFollowMode: (followMode) => set({ followMode }),
  toggleFollowMode: () => set((state) => ({ followMode: !state.followMode })),

  activeLayers: new Set<MapLayer>(["route", "stations"]),
  toggleLayer: (layer) => {
    set((state) => {
      const next = new Set(state.activeLayers);
      if (next.has(layer)) {
        next.delete(layer);
      } else {
        next.add(layer);
      }
      return { activeLayers: next };
    });
  },
  isLayerActive: (layer) => get().activeLayers.has(layer),

  isDarkMap: false,
  setDarkMap: (isDarkMap) => set({ isDarkMap }),

  mapStyleType: "streets",
  setMapStyleType: (mapStyleType) => set({ mapStyleType }),

  isFullscreen: false,
  setFullscreen: (isFullscreen) => set({ isFullscreen }),

  userHasPanned: false,
  setUserHasPanned: (userHasPanned) => set({ userHasPanned }),
}));
