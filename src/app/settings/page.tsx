import type { Metadata } from "next";
import { TopNavigation, BottomNavigation } from "@/components/ui/Navigation";
import { SettingsContent } from "@/features/settings/SettingsContent";

export const metadata: Metadata = {
  title: "Settings — RailGaadi",
  description: "Configure appearance, theme, and API preferences on RailGaadi.",
};

export default function SettingsPage() {
  return (
    <>
      <TopNavigation />
      <main className="max-w-2xl mx-auto px-4 py-8 pb-24 md:pb-8">
        <SettingsContent />
      </main>
      <BottomNavigation />
    </>
  );
}
