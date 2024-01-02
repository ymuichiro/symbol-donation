import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "義援金募集",
  description: "石川県能登半島地震への義援金受付状況を開示します",
  metadataBase: new URL("https://steady-bunny-034595.netlify.app/"),
  twitter: {
    card: "summary_large_image",
    title: "義援金募集",
    description: "石川県能登半島地震への義援金受付状況を開示します",
    creator: "@faunsu19000",
    images: ["/twitter-image.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={"min-h-screen bg-background font-sans antialiased " + inter.variable}>{children}</body>
    </html>
  );
}
