import type { Metadata } from "next";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";

export const metadata: Metadata = {
  title: "Techo-Pro | AI-Powered Business Management for Hardscaping Contractors",
  description: "Manage your hardscaping business with AI. Quotes, invoices, customers, employees, jobs, and inventory — all in one place.",
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
