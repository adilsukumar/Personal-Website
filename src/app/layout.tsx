import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import AmbientSound from "@/components/AmbientSound";
import CustomCursor from "@/components/CustomCursor";
import { HeroRevealProvider } from "@/lib/heroReveal";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Adil Sukumar",
  description:
    "Adil Sukumar — software and embedded-systems developer, Pawsitive Diagnostics founder, and AI and bioinformatics student at VIT Bhopal.",
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
    >
      <body className="flex flex-col bg-black text-white">
        <HeroRevealProvider>
          <CustomCursor />
          <AmbientSound />
          {children}
        </HeroRevealProvider>
      </body>
    </html>
  );
}
