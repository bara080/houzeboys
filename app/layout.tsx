import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import Providers from "@/components/Providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["900"],
});

export const metadata: Metadata = {
  title: "Houzeboys | Stay Connected",
  description:
    "Subscribe to get updates on new music, videos, events, and exclusive announcements from the houzeboys",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${montserrat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0f0f0f] text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
