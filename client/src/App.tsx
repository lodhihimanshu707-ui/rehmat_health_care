import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { DoctorsView } from "@/features/doctors/pages/doctors-view";
import { WalletView } from "@/features/wallet/pages/wallet-view";
import { ChatView } from "@/features/chat/pages/chat-view";
import { VideoRoom } from "@/features/consultation/components/video-room";
import { IncomingCallModal } from "@/features/consultation/components/incoming-call-modal";
import { CallSummaryModal } from "@/features/consultation/components/call-summary-modal";
import { RechargeModal } from "@/features/wallet/components/recharge-modal";
import { useAuthStore } from "@/features/auth/store/use-auth-store";
import { useCallStore } from "@/features/consultation/store/use-call-store";
import { getSocket, syncSocketUser } from "@/lib/socket";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("doctors");
  const [chatRecipient, setChatRecipient] = useState<{ id: string; name: string } | undefined>(
    undefined
  );

  const { currentUser } = useAuthStore();
  const { receiveIncomingCall } = useCallStore();

  // Initialize socket listener for incoming calls
  useEffect(() => {
    const socket = getSocket();
    syncSocketUser(currentUser.id);

    const handleIncomingCall = (data: {
      consultationId: string;
      patientId: string;
      patientName: string;
      patientAvatar?: string;
      doctorId: string;
      doctorUserId: string;
      ratePerMinute: number;
    }) => {
      receiveIncomingCall({
        id: data.consultationId,
        patientId: data.patientId,
        patientName: data.patientName,
        patientAvatar: data.patientAvatar,
        doctorId: data.doctorId,
        ratePerMinute: data.ratePerMinute,
      });
    };

    socket.on("incoming-call", handleIncomingCall);

    return () => {
      socket.off("incoming-call", handleIncomingCall);
    };
  }, [currentUser.id, receiveIncomingCall]);

  const handleOpenChat = (doctorId: string, doctorName: string) => {
    setChatRecipient({ id: doctorId, name: doctorName });
    setActiveTab("chat");
  };

  const handleCallInitiated = () => {
    // When a call is initiated, the VideoRoom component handles the full-screen view
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Header with Navigation and Fast Role Switcher */}
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Tab View */}
      <main className="flex-1 pb-12">
        {activeTab === "doctors" && (
          <DoctorsView onOpenChat={handleOpenChat} onCallInitiated={handleCallInitiated} />
        )}

        {activeTab === "chat" && (
          <ChatView
            initialRecipientId={chatRecipient?.id}
            initialRecipientName={chatRecipient?.name}
          />
        )}

        {activeTab === "wallet" && <WalletView />}
      </main>

      {/* Global Modals & Live Overlays */}
      <VideoRoom />
      <IncomingCallModal />
      <CallSummaryModal />
      <RechargeModal />

      {/* Footer */}
      <Footer />
    </div>
  );
}
