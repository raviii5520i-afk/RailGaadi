import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { Providers } from "./providers";
import { APP_CONFIG } from "@/constants/config";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: APP_CONFIG.name,
    template: `%s — ${APP_CONFIG.name}`,
  },
  description: APP_CONFIG.description,
  keywords: ["train tracking", "Indian Railways", "live train status", "PNR", "train location"],
  authors: [{ name: "RailGaadi" }],
  creator: "RailGaadi",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: APP_CONFIG.url,
    title: APP_CONFIG.name,
    description: APP_CONFIG.description,
    siteName: APP_CONFIG.name,
  },
  twitter: {
    card: "summary_large_image",
    title: APP_CONFIG.name,
    description: APP_CONFIG.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F8F9FB" },
    { media: "(prefers-color-scheme: dark)", color: "#0E1117" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-[#F8F9FB] text-[#111318]`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
