import type { Metadata } from "next";
import { Roboto_Slab, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const display = Roboto_Slab({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-display",
});
const body = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Brickwise — NYC property records, read plainly",
  description:
    "Search New York City's public building records in plain English, with AI-written briefings on every tax lot.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-line px-6 py-6 text-xs text-inkSoft font-mono">
          Data: NYC Dept. of City Planning — PLUTO. Not affiliated with the City of New York. Listing
          prices are not part of this tool; this is a records-and-insight explorer, not a marketplace.
        </footer>
      </body>
    </html>
  );
}
