import type { Metadata } from "next";
import { TopNavigation, BottomNavigation } from "@/components/ui/Navigation";
import { FluxorHeroScene } from "@/features/cinematic/FluxorHeroScene";

export const metadata: Metadata = {
  title: "RailGaadi — Find Your Train. Plan Your Journey.",
  description: "Discover direct trains between stations and track live location with MapTiler vector maps, weather forecasts, and elevation intelligence.",
};

export default function HomePage() {
  return (
    <>
      <TopNavigation />
      <main className="min-h-screen">
        <FluxorHeroScene />
      </main>
      <BottomNavigation />
    </>
  );
}
