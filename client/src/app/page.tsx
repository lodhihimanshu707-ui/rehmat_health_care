"use client";

import React, { useState } from "react";
import { Navbar } from "@/shared/components/Navbar";
import { Footer } from "@/shared/components/Footer";
import { WebsiteView } from "@/modules/website/WebsiteView";
import { DoctorsView } from "@/modules/doctors/DoctorsView";
import { WalletView } from "@/modules/wallet/WalletView";
import { ChatView } from "@/modules/chat/ChatView";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<string>("website");
  const [chatRecipient, setChatRecipient] = useState<{ id: string; name: string } | undefined>(
    undefined
  );

  const handleOpenChat = (doctorId: string, doctorName: string) => {
    setChatRecipient({ id: doctorId, name: doctorName });
    setActiveTab("chat");
  };

  const handleCallInitiated = () => {
    // Handled by VideoRoom in providers.tsx
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1">
        {activeTab === "website" && (
          <WebsiteView
            onNavigateTab={setActiveTab}
            onOpenChat={handleOpenChat}
          />
        )}

        {activeTab === "teleconsult" && (
          <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24 py-8">
            <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
              <div>
                <span className="inline-block rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
                  Virtual OPD
                </span>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Live Doctor Teleconsultation
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select a verified doctor to start an encrypted WebRTC video call with transparent per-minute wallet billing.
                </p>
              </div>
              <button
                onClick={() => setActiveTab("website")}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-white border border-slate-200 hover:border-emerald-300 px-3.5 py-2 rounded-xl shadow-xs transition-all"
              >
                ← Return to Clinic Website
              </button>
            </div>
            <DoctorsView onOpenChat={handleOpenChat} onCallInitiated={handleCallInitiated} />
          </div>
        )}

        {activeTab === "chat" && (
          <div className="py-6">
            <ChatView
              initialRecipientId={chatRecipient?.id}
              initialRecipientName={chatRecipient?.name}
            />
          </div>
        )}

        {activeTab === "wallet" && (
          <div className="py-6">
            <WalletView />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
