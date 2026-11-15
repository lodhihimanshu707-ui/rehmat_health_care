"use client";

import React from "react";
import { Navbar } from "@/shared/components/Navbar";
import { Footer } from "@/shared/components/Footer";
import { WebsiteView } from "@/modules/website/WebsiteView";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  const handleOpenChat = (doctorId: string, doctorName: string) => {
    router.push(`/chat?doctorId=${doctorId}&doctorName=${encodeURIComponent(doctorName)}`);
  };

  const handleNavigateTab = (tab: string) => {
    if (tab === "teleconsult") {
      router.push("/teleconsult");
    } else if (tab === "chat") {
      router.push("/chat");
    } else if (tab === "wallet") {
      router.push("/wallet");
    } else {
      router.push("/");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1">
        <WebsiteView
          onNavigateTab={handleNavigateTab}
          onOpenChat={handleOpenChat}
        />
      </main>

      <Footer />
    </div>
  );
}
