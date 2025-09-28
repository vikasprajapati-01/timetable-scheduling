import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Smart Timetable Scheduler | Intelligent Scheduling for Educational Institutions",
  description: "Advanced timetable scheduling platform with AI-powered optimization, conflict resolution, and multi-role dashboards for students, faculty, and administrators.",
  keywords: "timetable, scheduling, education, AI, optimization, school, college, university",
  authors: [{ name: "Smart Timetable Team" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
