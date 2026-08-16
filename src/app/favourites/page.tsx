import type { Metadata } from "next";
import { TopNavigation, BottomNavigation } from "@/components/ui/Navigation";
import { FavouritesContent } from "@/features/favourites/FavouritesContent";

export const metadata: Metadata = {
  title: "Favourites",
  description: "Your favourite trains on RailGaadi.",
};

export default function FavouritesPage() {
  return (
    <>
      <TopNavigation />
      <main className="max-w-2xl mx-auto px-4 py-8 pb-24 md:pb-8">
        <FavouritesContent />
      </main>
      <BottomNavigation />
    </>
  );
}
