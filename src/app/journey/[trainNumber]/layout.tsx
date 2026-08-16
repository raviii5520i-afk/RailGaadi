import { TopNavigation, BottomNavigation } from "@/components/ui/Navigation";
import { JourneyLayoutShell } from "@/features/live-tracking/JourneyLayoutShell";

interface JourneyLayoutProps {
  children: React.ReactNode;
  params: Promise<{ trainNumber: string }>;
}

export default async function JourneyLayout({
  children,
  params,
}: JourneyLayoutProps) {
  const { trainNumber } = await params;

  return (
    <>
      <TopNavigation />
      <JourneyLayoutShell trainNumber={trainNumber}>
        {children}
      </JourneyLayoutShell>
      <BottomNavigation />
    </>
  );
}
