import type { Metadata } from "next";
import { FullscreenMapView } from "@/features/live-tracking/FullscreenMapView";

interface FullscreenMapPageProps {
  params: Promise<{ trainNumber: string }>;
}

export async function generateMetadata({ params }: FullscreenMapPageProps): Promise<Metadata> {
  const { trainNumber } = await params;
  return { title: `Train ${trainNumber} — Live Map` };
}

export default async function FullscreenMapPage({ params }: FullscreenMapPageProps) {
  const { trainNumber } = await params;
  return <FullscreenMapView trainNumber={trainNumber} />;
}
