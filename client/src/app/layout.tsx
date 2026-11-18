import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { Providers } from "./providers";
import { MobileBottomNav } from "@/shared/components/MobileBottomNav";
import "./globals.css";

export const metadata: Metadata = {
  title: `${siteConfig.name} - Teleconsultation (Moradabad)`,
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 font-sans selection:bg-emerald-100 selection:text-emerald-900">
        <Providers>
          {children}
          <MobileBottomNav />
        </Providers>
      </body>
    </html>
  );
}

