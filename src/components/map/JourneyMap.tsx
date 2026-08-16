"use client";

import { useEffect, useRef } from "react";
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import { useMapStore } from "@/store/mapStore";
import { APP_CONFIG } from "@/constants/config";
import { MapControls } from "./MapControls";
import type { TrainLocation, TrainRoute } from "@/types/train";

interface JourneyMapProps {
  trainLocation?: TrainLocation;
  route?: TrainRoute;
  currentStationIdx?: number;
  className?: string;
}

const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_API_KEY || "yaSEf8Ffg64XQv6lkqcg";
maptilersdk.config.apiKey = MAPTILER_KEY;

// MapTiler SDK Style mapping
function getMapTilerStyle(styleType: "streets" | "outdoor" | "satellite" | "dark") {
  switch (styleType) {
    case "outdoor":
      return maptilersdk.MapStyle.OUTDOOR;
    case "satellite":
      return maptilersdk.MapStyle.SATELLITE;
    case "dark":
      return maptilersdk.MapStyle.DATAVIZ.DARK;
    case "streets":
    default:
      return maptilersdk.MapStyle.STREETS;
  }
}

export function JourneyMap({
  trainLocation,
  route,
  currentStationIdx = -1,
  className,
}: JourneyMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maptilersdk.Map | null>(null);
  const markerRef = useRef<maptilersdk.Marker | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const { followMode, mapStyleType, setUserHasPanned, setFollowMode } = useMapStore();

  // Initialize MapTiler SDK Map (MapLibre Engine under the hood)
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maptilersdk.Map({
      container: containerRef.current,
      style: getMapTilerStyle(mapStyleType),
      center: trainLocation
        ? [trainLocation.longitude, trainLocation.latitude]
        : APP_CONFIG.map.defaultCenter,
      zoom: trainLocation
        ? APP_CONFIG.map.journeyZoom
        : APP_CONFIG.map.defaultZoom,
      geolocateControl: false,
      navigationControl: false,
    });

    // Detect manual user pan → pause follow mode
    map.on("dragstart", () => {
      setUserHasPanned(true);
      setFollowMode(false);
    });

    map.on("load", () => {
      if (route?.geometry) {
        addRouteLayer(map, route, currentStationIdx);
      }
      if (trainLocation) {
        addOrUpdateMarker(map, trainLocation);
      }
    });

    mapRef.current = map;

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Handle MapTiler Style Changes dynamically
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.setStyle(getMapTilerStyle(mapStyleType));

    map.once("style.load", () => {
      if (route?.geometry) {
        addRouteLayer(map, route, currentStationIdx);
      }
      if (trainLocation) {
        addOrUpdateMarker(map, trainLocation);
      }
    });
  }, [mapStyleType]);

  // Update Route geometry when route changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded() || !route?.geometry) return;

    if (map.getSource("route")) {
      (map.getSource("route") as maptilersdk.GeoJSONSource).setData(
        buildRouteGeoJSON(route, currentStationIdx)
      );
    } else {
      addRouteLayer(map, route, currentStationIdx);
    }
  }, [route, currentStationIdx]);

  // Smooth train marker animation & follow mode
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !trainLocation) return;

    if (!markerRef.current) {
      addOrUpdateMarker(map, trainLocation);
    } else {
      const startLng = markerRef.current.getLngLat().lng;
      const startLat = markerRef.current.getLngLat().lat;
      const endLng = trainLocation.longitude;
      const endLat = trainLocation.latitude;
      const duration = 2000;
      const start = performance.now();

      const animate = (now: number) => {
        const t = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - t, 3);
        markerRef.current?.setLngLat([
          startLng + (endLng - startLng) * ease,
          startLat + (endLat - startLat) * ease,
        ]);
        if (t < 1) {
          animFrameRef.current = requestAnimationFrame(animate);
        }
      };
      animFrameRef.current = requestAnimationFrame(animate);
    }

    if (followMode && map.isStyleLoaded()) {
      map.easeTo({
        center: [trainLocation.longitude, trainLocation.latitude],
        zoom: Math.max(map.getZoom(), APP_CONFIG.map.followZoom),
        duration: 400,
      });
    }
  }, [trainLocation, followMode]);

  function addOrUpdateMarker(map: maptilersdk.Map, loc: TrainLocation) {
    const el = createTrainMarkerElement(loc.heading);
    const marker = new maptilersdk.Marker({ element: el, anchor: "center" })
      .setLngLat([loc.longitude, loc.latitude])
      .addTo(map);
    markerRef.current = marker;
  }

  return (
    <div className={`relative w-full h-full ${className ?? ""}`}>
      <div ref={containerRef} className="w-full h-full" aria-label="MapTiler live map" role="application" />
      <MapControls mapRef={mapRef as any} />
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function createTrainMarkerElement(heading?: number): HTMLElement {
  const el = document.createElement("div");
  el.className = "train-marker";
  el.setAttribute("aria-label", "Train location");
  el.innerHTML = `
    <div style="
      width: 34px; height: 34px;
      background: #2563EB;
      border-radius: 50% 50% 50% 0;
      transform: rotate(${(heading ?? 0) - 45}deg);
      box-shadow: 0 4px 12px rgba(37,99,235,0.6);
      border: 2px solid white;
      display: flex; align-items: center; justify-content: center;
      animation: train-pulse 2s ease-in-out infinite;
    ">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="white" style="transform: rotate(${45 - (heading ?? 0)}deg)">
        <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z"/>
      </svg>
    </div>
  `;
  return el;
}

function buildRouteGeoJSON(
  route: TrainRoute,
  currentStationIdx: number
): GeoJSON.FeatureCollection {
  if (!route.geometry) {
    return { type: "FeatureCollection", features: [] };
  }

  const coords = route.geometry.coordinates;
  const splitAt = currentStationIdx >= 0
    ? Math.floor((currentStationIdx / (route.stations.length - 1)) * coords.length)
    : 0;

  const completedCoords = coords.slice(0, splitAt + 1);
  const remainingCoords = coords.slice(splitAt);

  const features: GeoJSON.Feature[] = [];

  if (remainingCoords.length >= 2) {
    features.push({
      type: "Feature",
      properties: { segment: "remaining" },
      geometry: { type: "LineString", coordinates: remainingCoords },
    });
  }

  if (completedCoords.length >= 2) {
    features.push({
      type: "Feature",
      properties: { segment: "completed" },
      geometry: { type: "LineString", coordinates: completedCoords },
    });
  }

  return { type: "FeatureCollection", features };
}

function addRouteLayer(
  map: maptilersdk.Map,
  route: TrainRoute,
  currentStationIdx: number
) {
  const geojson = buildRouteGeoJSON(route, currentStationIdx);

  if (map.getSource("route")) {
    (map.getSource("route") as maptilersdk.GeoJSONSource).setData(geojson);
    return;
  }

  map.addSource("route", { type: "geojson", data: geojson });

  // Remaining route (dashed)
  map.addLayer({
    id: "route-remaining",
    type: "line",
    source: "route",
    filter: ["==", ["get", "segment"], "remaining"],
    layout: { "line-cap": "round", "line-join": "round" },
    paint: {
      "line-color": "#9CA3AF",
      "line-width": 3,
      "line-dasharray": [2, 2],
    },
  });

  // Completed route (accent blue glow)
  map.addLayer({
    id: "route-completed",
    type: "line",
    source: "route",
    filter: ["==", ["get", "segment"], "completed"],
    layout: { "line-cap": "round", "line-join": "round" },
    paint: {
      "line-color": "#2563EB",
      "line-width": 4,
    },
  });

  // Station dots
  const stationFeatures: GeoJSON.Feature[] = route.stations
    .filter((s) => s.station.latitude && s.station.longitude)
    .map((s) => ({
      type: "Feature" as const,
      properties: {
        name: s.station.name,
        code: s.station.code,
        status: s.status,
      },
      geometry: {
        type: "Point" as const,
        coordinates: [s.station.longitude!, s.station.latitude!],
      },
    }));

  map.addSource("stations", {
    type: "geojson",
    data: { type: "FeatureCollection", features: stationFeatures },
  });

  map.addLayer({
    id: "station-dots",
    type: "circle",
    source: "stations",
    paint: {
      "circle-radius": 5,
      "circle-color": [
        "match",
        ["get", "status"],
        "completed", "#2563EB",
        "current", "#2563EB",
        "#E5E7EB",
      ],
      "circle-stroke-width": 2,
      "circle-stroke-color": "#FFFFFF",
    },
  });
}
