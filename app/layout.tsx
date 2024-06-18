// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Candao Revenue and Reward Simulation",
  description:
    "Explore the Candao platform's revenue and reward simulation. Analyze different income streams and reward distribution strategies to maximize your understanding of platform economics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Pobranie wersji symulatora z pliku .env
  const simulatorVersion = process.env.NEXT_PUBLIC_SIMULATOR_VERSION;

  return (
    <html lang="en">
      <body className={`${inter.className} relative`}>
        {children}
        {/* Dodanie wersji symulatora */}
        <div className="absolute bottom-2 right-2 text-xs text-gray-600">
          v.{simulatorVersion}
        </div>
      </body>
    </html>
  );
}
