import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AVA Skin - Healthcare & Beauty",
  description: "Discover premium skincare and beauty products at AVA Skin. We offer a curated selection of high-quality skincare solutions, from cleansers to advanced treatments, all designed to help you achieve your best skin.",
  keywords: ["skincare", "beauty products", "healthcare", "cosmetics", "skin treatments", "beauty care"],
  authors: [{ name: "AVA Skin" }],
  creator: "AVA Skin",
  publisher: "AVA Skin",
  openGraph: {

    title: "AVA Skin - Healthcare & Beauty",
    description: "Premium skincare and beauty products for your daily routine",
    images: ["https://images.unsplash.com/photo-1570554886111-e80fcca6a029?q=80&w=1200"],
    type: "website",
    siteName: "AVA Skin Healthcare",
    url: process.env.NEXT_PUBLIC_BASE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "AVA Skin - Healthcare & Beauty",
    description: "Premium skincare and beauty products for your daily routine",
    images: ["https://images.unsplash.com/photo-1601049676869-702ea24cfd58?q=80&w=1200"],
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <NuqsAdapter>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
          <Toaster />
        </body>
      </html>
    </NuqsAdapter>
  );
}
