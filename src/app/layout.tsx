import type { Metadata } from "next";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";

export const metadata: Metadata = {
  title: "Techo-Pro | #1 Business Management Software for Hardscape Contractors",
  description: "The all-in-one platform for hardscape contractors. Generate quotes in seconds, schedule crews on a calendar, track inventory, record voice notes on site, send invoices, and manage customers. Built for paver, retaining wall, and outdoor living contractors. Free to start.",
  keywords: [
    "hardscape contractor software",
    "hardscaping business management",
    "paver contractor CRM",
    "hardscape quote builder",
    "contractor scheduling software",
    "hardscape inventory management",
    "contractor invoicing",
    "Techo-Bloc contractor tools",
    "hardscape estimating software",
    "outdoor living contractor app",
    "retaining wall contractor software",
    "patio installation management",
    "contractor voice notes",
    "hardscape crew scheduling",
    "landscape contractor CRM",
  ],
  icons: {
    icon: "/favicon.svg",
    apple: "/apple-touch-icon.svg",
  },
  openGraph: {
    title: "Techo-Pro | #1 Business Management for Hardscape Contractors",
    description: "Generate quotes in seconds, schedule crews, track inventory, record voice notes, and send invoices. Built specifically for hardscape contractors. Free to start.",
    url: "https://techo-pro.vercel.app",
    siteName: "Techo-Pro",
    images: [{ url: "/og-image.svg", width: 1200, height: 630, alt: "Techo-Pro — Hardscape Contractor Management Platform" }],
    type: "website",
    locale: "en_CA",
  },
  twitter: {
    card: "summary_large_image",
    title: "Techo-Pro | #1 Business Management for Hardscape Contractors",
    description: "Generate quotes in seconds, schedule crews, track inventory, record voice notes, and send invoices. Free to start.",
    images: ["/og-image.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
  },
  alternates: {
    canonical: "https://techo-pro.vercel.app",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "Techo-Pro",
              applicationCategory: "BusinessApplication",
              operatingSystem: "Web",
              description: "All-in-one business management platform for hardscape contractors. Quotes, scheduling, CRM, inventory, invoicing, and voice notes.",
              url: "https://techo-pro.vercel.app",
              offers: [
                { "@type": "Offer", price: "0", priceCurrency: "CAD", name: "Starter — Free" },
                { "@type": "Offer", price: "49", priceCurrency: "CAD", name: "Pro — $49/mo" },
                { "@type": "Offer", price: "149", priceCurrency: "CAD", name: "Business — $149/mo" },
              ],
              aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", ratingCount: "127", bestRating: "5" },
            }),
          }}
        />
      </head>
      <body className="antialiased bg-stone-50">
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
