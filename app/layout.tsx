import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import linkPreviewMetadata from "@/metadata";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = linkPreviewMetadata({
  description:
    "This is a date picker built with shadcn/ui and IOS-carousel style.",
  keywords: "ios, date picker, shadcn, shadcn-ui",
  title: "IOS Date Picker shadcn/ui",
  url: "/",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen `}
      >
        {children}
        <Toaster closeButton />
      </body>
    </html>
  );
}
