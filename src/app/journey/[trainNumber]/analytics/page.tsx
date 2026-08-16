import type { Metadata } from "next";
import { TopNavigation, BottomNavigation } from "@/components/ui/Navigation";
import { AnalyticsDashboard } from "@/features/analytics/AnalyticsDashboard";

interface AnalyticsPageProps {
  params: Promise<{ trainNumber: string }>;
}

export async function generateMetadata({ params }: AnalyticsPageProps): Promise<Metadata> {
  const { trainNumber } = await params;
  return { title: `Train ${trainNumber} — Analytics` };
}

export default async function AnalyticsPage({ params }: AnalyticsPageProps) {
  const { trainNumber } = await params;
  return (
    <>
      <TopNavigation />
      <main className="max-w-3xl mx-auto px-4 py-6 pb-24 md:pb-8">
        <AnalyticsDashboard trainNumber={trainNumber} />
      </main>
      <BottomNavigation />
    </>
  );
}
