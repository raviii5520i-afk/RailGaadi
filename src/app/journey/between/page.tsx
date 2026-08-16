import type { Metadata } from "next";
import { TopNavigation, BottomNavigation } from "@/components/ui/Navigation";
import { TrainsBetweenContent } from "@/features/train-search/TrainsBetweenContent";

interface PageProps {
  searchParams: Promise<{ from?: string; to?: string; date?: string; time?: string }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { from = "ST", to = "NDLS" } = await searchParams;
  return {
    title: `Trains from ${from} to ${to} — RailGaadi`,
    description: `Find all trains running between ${from} and ${to}. See departure times, duration, and track live on RailGaadi.`,
  };
}

export default async function TrainsBetweenPage({ searchParams }: PageProps) {
  const { from = "ST", to = "NDLS", date, time } = await searchParams;

  return (
    <>
      <TopNavigation />
      <main className="max-w-4xl mx-auto px-4 py-6 pb-24 md:pb-8">
        <TrainsBetweenContent fromCode={from} toCode={to} initialDate={date} initialTime={time} />
      </main>
      <BottomNavigation />
    </>
  );
}
