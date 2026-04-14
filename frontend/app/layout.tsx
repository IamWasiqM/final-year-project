// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import VapiWidget from "./components/VapiWidget";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Schedly - AI Appointment Scheduling",
  description: "Book, cancel, and manage appointments with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      suppressHydrationWarning  // ← Add this
    >
      <body className="relative min-h-screen" suppressHydrationWarning>  {/* ← Add suppressHydrationWarning */}
        {children}
        <VapiWidget />
      </body>
    </html>
  );
}