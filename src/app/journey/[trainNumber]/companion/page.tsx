import type { Metadata } from "next";
import { TopNavigation, BottomNavigation } from "@/components/ui/Navigation";
import { CompanionContent } from "@/features/companion/CompanionContent";

interface CompanionPageProps {
  params: Promise<{ trainNumber: string }>;
}

export async function generateMetadata({ params }: CompanionPageProps): Promise<Metadata> {
  const { trainNumber } = await params;
  return { title: `Train ${trainNumber} — Travel Companion` };
}

export default async function CompanionPage({ params }: CompanionPageProps) {
  const { trainNumber } = await params;
  return (
    <>
      <TopNavigation />
      <main className="max-w-3xl mx-auto px-4 py-6 pb-24 md:pb-8">
        <CompanionContent trainNumber={trainNumber} />
      </main>
      <BottomNavigation />
    </>
  );
}
