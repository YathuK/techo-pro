import type { Metadata } from "next";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";

export const metadata: Metadata = {
  title: "Techo-Pro | Smart Business Management for Hardscape Contractors",
  description: "Manage your hardscaping business with Techo. Quotes, invoices, customers, employees, jobs, and inventory — all in one place.",
  icons: {
    icon: "/favicon.svg",
    apple: "/apple-touch-icon.svg",
  },
  openGraph: {
    title: "Techo-Pro | Smart Business Management for Hardscape Contractors",
    description: "Quotes, schedules, crews, inventory, invoices — one platform with Techo that actually understands hardscaping.",
    url: "https://techo-pro.vercel.app",
    siteName: "Techo-Pro",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Techo-Pro — Hardscape Contractor Management",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Techo-Pro | Smart Business Management for Hardscape Contractors",
    description: "Quotes, schedules, crews, inventory, invoices — one platform with Techo that actually understands hardscaping.",
    images: ["/og-image.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-stone-50">
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
