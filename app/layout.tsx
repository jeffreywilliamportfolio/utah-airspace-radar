import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Utah Airspace Monitor",
  description:
    "Realtime Utah airspace dashboard with source-cited stories, NOTAM feeds, aircraft map, and event logs."
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
