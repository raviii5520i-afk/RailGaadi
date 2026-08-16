import type { Metadata } from "next";
import { JourneyDashboard } from "@/features/live-tracking/JourneyDashboard";

interface JourneyPageProps {
  params: Promise<{ trainNumber: string }>;
}

export async function generateMetadata({
  params,
}: JourneyPageProps): Promise<Metadata> {
  const { trainNumber } = await params;
  return {
    title: `Train ${trainNumber} — Live Status`,
    description: `Track Train ${trainNumber} in real-time. See live location, ETA, delay, and journey progress on RailGaadi.`,
  };
}

export default async function JourneyPage({ params }: JourneyPageProps) {
  const { trainNumber } = await params;
  return <JourneyDashboard trainNumber={trainNumber} />;
}
