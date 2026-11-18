"use client";

import React, { useState, useEffect, useRef } from "react";
import { useChat } from "./useChat";
import { MessageBubble } from "./MessageBubble";
import { MessageInput } from "./MessageInput";
import { useAuthStore, DEMO_PATIENT_1, DEMO_PATIENT_2, DEMO_DOCTOR, DEMO_ADMIN } from "@/stores/auth.store";
import { useCallStore } from "@/stores/call.store";
import { getSocket } from "@/lib/socket";
import { soundManager } from "@/lib/sound";
import { Avatar, AvatarImage, AvatarFallback } from "@/shared/ui/avatar";
import {
  Video,
  Phone,
  Search,
  MoreVertical,
  Lock,
  Volume2,
  VolumeX,
  Sparkles,
  ArrowLeft,
  CheckCheck,
} from "lucide-react";

interface Contact {
  id: string;
  name: string;
  role: string;
  subtitle: string;
  lastMessage: string;
  lastTime: string;
  unreadCount?: number;
  avatarUrl?: string;
  phone?: string;
  isOnline: boolean;
}

interface ChatViewProps {
  initialRecipientId?: string;
  initialRecipientName?: string;
}

export function ChatView({ initialRecipientId, initialRecipientName }: ChatViewProps) {
  const { currentUser, isAuthenticated } = useAuthStore();
  const { startOutgoingCall } = useCallStore();
  const isPatient = currentUser?.role === "patient";
  const isDoctor = currentUser?.role === "doctor";

  // Build authentic WhatsApp contacts list based on role
  const contacts: Contact[] = isDoctor
    ? [
        {
          id: DEMO_PATIENT_1.id,
          name: DEMO_PATIENT_1.name,
          role: "Patient #RH-101",
          subtitle: "Viral Fever & Sore Throat • In-Clinic OPD",
          lastMessage: "Doctor, Paracetamol lene ke baad fever utar gaya.",
          lastTime: "11:42 AM",
          unreadCount: 1,
          avatarUrl: DEMO_PATIENT_1.avatarUrl,
          phone: "+91 94120 54321",
          isOnline: true,
        },
        {
          id: DEMO_PATIENT_2.id,
          name: DEMO_PATIENT_2.name,
          role: "Patient #RH-102",
          subtitle: "Chest Congestion • Mohan X-Ray Review",
          lastMessage: "Mohan X-Ray scan report attached below.",
          lastTime: "10:15 AM",
          avatarUrl: DEMO_PATIENT_2.avatarUrl,
          phone: "+91 94120 54322",
          isOnline: true,
        },
        {
          id: "a3000000-0000-0000-0000-000000000003",
          name: "Himanshu",
          role: "Patient #RH-103",
          subtitle: "Walk-in OPD • Token #RH-103",
          lastMessage: "Doctor cabin me kab aana hai?",
          lastTime: "Yesterday",
          phone: "8279799553",
          isOnline: false,
        },
        {
          id: DEMO_ADMIN.id,
          name: "Amit Verma (Reception)",
          role: "Clinic Desk",
          subtitle: "Front Desk & Mohan X-Ray Desk",
          lastMessage: "Today total 14 OPD walk-in tokens issued.",
          lastTime: "Yesterday",
          avatarUrl: DEMO_ADMIN.avatarUrl,
          isOnline: true,
        },
      ]
    : [
        {
          id: DEMO_DOCTOR.id,
          name: DEMO_DOCTOR.name,
          role: "Chief Physician",
          subtitle: "MBBS, MD - General Medicine (Beside Mohan X-Ray)",
          lastMessage: "Take medicines strictly as prescribed after meals.",
          lastTime: "11:50 AM",
          unreadCount: 1,
          avatarUrl: DEMO_DOCTOR.avatarUrl,
          phone: "+91 98370 12345",
          isOnline: true,
        },
        {
          id: DEMO_ADMIN.id,
          name: "Amit Verma (Reception)",
          role: "Front Desk Coordinator",
          subtitle: "Walk-in Slips & Mohan X-Ray Synergy",
          lastMessage: "Your digital OPD receipt #RH-101 is ready.",
          lastTime: "09:30 AM",
          avatarUrl: DEMO_ADMIN.avatarUrl,
          isOnline: true,
        },
      ];

  const defaultRecipient =
    contacts.find((c) => c.id === initialRecipientId) ||
    contacts.find((c) => c.name === initialRecipientName) ||
    contacts[0];

  const [activeRecipient, setActiveRecipient] = useState<Contact>(defaultRecipient);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTab, setFilterTab] = useState<"all" | "unread" | "clinic">("all");
  const [presetText, setPresetText] = useState("");
  const [isMuted, setIsMuted] = useState(soundManager.isMuted());
  const [mobileShowChat, setMobileShowChat] = useState(true);

  const { messages, isLoading, sendMessage } = useChat(activeRecipient.id);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const toggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundManager.setMuted(next);
    if (!next) {
      soundManager.playMessageReceived();
    }
  };

  // Direct Video Call from WhatsApp header
  const handleStartCall = () => {
    if (!currentUser) return;
    const isDoctorCalling = currentUser.role === "doctor";

    startOutgoingCall({
      id: `cons-${Date.now()}`,
      patientId: isDoctorCalling ? activeRecipient.id : currentUser.id,
      patientName: isDoctorCalling ? activeRecipient.name : currentUser.name,
      patientAvatar: isDoctorCalling ? activeRecipient.avatarUrl : currentUser.avatarUrl,
      doctorId: isDoctorCalling ? currentUser.id : activeRecipient.id,
      doctorName: isDoctorCalling ? currentUser.name : activeRecipient.name,
      doctorAvatar: isDoctorCalling ? currentUser.avatarUrl : activeRecipient.avatarUrl,
      ratePerMinute: 15,
      callerRole: isDoctorCalling ? "doctor" : "patient",
    });

    const socket = getSocket();
    socket.emit("call-user", {
      consultationId: `cons-${Date.now()}`,
      patientId: isDoctorCalling ? activeRecipient.id : currentUser.id,
      patientName: isDoctorCalling ? activeRecipient.name : currentUser.name,
      patientAvatar: isDoctorCalling ? activeRecipient.avatarUrl : currentUser.avatarUrl,
      doctorId: isDoctorCalling ? currentUser.id : activeRecipient.id,
      doctorUserId: isDoctorCalling ? activeRecipient.id : currentUser.id,
      ratePerMinute: 15,
      callerRole: isDoctorCalling ? "doctor" : "patient",
    });
  };

  const filteredContacts = contacts.filter((c) => {
    const match = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    if (!match) return false;
    if (filterTab === "unread") return !!c.unreadCount;
    return true;
  });

  const quickChips = isDoctor
    ? [
        "Take Tab. Paracetamol 650mg TDS after food.",
        "Please share your latest Mohan X-Ray chest report.",
        "Your vitals look normal. Keep monitoring temperature.",
        "Visit the clinic tomorrow at 11 AM for physical checkup.",
      ]
    : [
        "Doctor, I have high fever (101°F) and cough since yesterday.",
        "Sharing my Mohan X-Ray scan report for review.",
        "When should I take the prescribed dosage?",
        "Thank you Doctor, feeling much better today!",
      ];

  if (!isAuthenticated) return null;

  return (
    <div className="mx-auto max-w-7xl px-2 sm:px-4 py-2 sm:py-4">
      {/* WhatsApp Web Style Container */}
      <div className="overflow-hidden rounded-2xl sm:rounded-3xl border border-[#d1d7db] bg-white shadow-xl flex h-[calc(100dvh-140px)] min-h-[580px] max-h-[850px]">
        
        {/* ========================================================================= */}
        {/* LEFT PANEL: WhatsApp Contacts / Chats List Sidebar                        */}
        {/* ========================================================================= */}
        <div
          className={`w-full md:w-[380px] lg:w-[410px] border-r border-[#e9edef] bg-white flex flex-col shrink-0 ${
            mobileShowChat ? "hidden md:flex" : "flex"
          }`}
        >
          {/* 1. Sidebar Top Header */}
          <div className="h-16 px-4 bg-[#f0f2f5] border-b border-[#e9edef] flex items-center justify-between shrink-0 select-none">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border border-slate-200">
                <AvatarImage src={currentUser?.avatarUrl} />
                <AvatarFallback className="bg-[#00a884] text-white font-bold text-xs">
                  {currentUser?.name?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-sm font-bold text-[#111b21] leading-tight">
                  {currentUser?.name}
                </h2>
                <span className="text-[10px] text-[#00a884] font-semibold uppercase tracking-wider">
                  {currentUser?.role === "doctor" ? "Doctor Cockpit" : "Patient Portal"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[#54656f]">
              <button
                onClick={toggleSound}
                className="p-2 hover:bg-slate-200/60 rounded-full transition-colors"
                title={isMuted ? "Unmute WhatsApp sounds" : "Mute WhatsApp sounds"}
              >
                {isMuted ? <VolumeX className="h-5 w-5 text-rose-500" /> : <Volume2 className="h-5 w-5 text-[#00a884]" />}
              </button>
            </div>
          </div>

          {/* 2. WhatsApp Search Bar */}
          <div className="p-2.5 bg-white border-b border-[#e9edef]">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#f0f2f5] border border-[#f0f2f5] focus-within:border-[#00a884]/40 focus-within:bg-white transition-all">
              <Search className="h-4 w-4 text-[#54656f] shrink-0" />
              <input
                type="text"
                placeholder="Search or start new consultation"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-xs text-[#111b21] placeholder-[#667781] focus:outline-none"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 mt-2 overflow-x-auto scrollbar-none">
              {(["all", "unread", "clinic"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilterTab(tab)}
                  className={`text-[11px] font-semibold px-3 py-1 rounded-full transition-all capitalize ${
                    filterTab === tab
                      ? "bg-[#00a884]/15 text-[#00a884] font-bold"
                      : "bg-[#f0f2f5] text-[#54656f] hover:bg-[#e9edef]"
                  }`}
                >
                  {tab === "all" ? "All Chats" : tab}
                </button>
              ))}
            </div>
          </div>

          {/* 3. WhatsApp Contact List Items */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#e9edef]/60">
            {filteredContacts.map((contact) => {
              const isSelected = contact.id === activeRecipient.id;
              return (
                <div
                  key={contact.id}
                  onClick={() => {
                    setActiveRecipient(contact);
                    setMobileShowChat(true);
                  }}
                  className={`flex items-center gap-3 px-3.5 py-3 cursor-pointer transition-colors select-none ${
                    isSelected ? "bg-[#f0f2f5]" : "hover:bg-[#f5f6f6]"
                  }`}
                >
                  <div className="relative shrink-0">
                    <Avatar className="h-12 w-12 border border-slate-200">
                      <AvatarImage src={contact.avatarUrl} />
                      <AvatarFallback className="bg-emerald-100 text-emerald-800 font-bold text-sm">
                        {contact.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {contact.isOnline && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-[#00a884] border-2 border-white" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-sm text-[#111b21] truncate">
                        {contact.name}
                      </h4>
                      <span
                        className={`text-[10px] shrink-0 ${
                          contact.unreadCount ? "text-[#00a884] font-bold" : "text-[#667781]"
                        }`}
                      >
                        {contact.lastTime}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-0.5">
                      <p className="text-xs text-[#667781] truncate flex items-center gap-1">
                        <CheckCheck className="h-3.5 w-3.5 text-[#53bdeb] shrink-0" />
                        <span className="truncate">{contact.lastMessage}</span>
                      </p>

                      {contact.unreadCount ? (
                        <span className="h-5 min-w-[20px] px-1 rounded-full bg-[#00a884] text-white font-bold text-[10px] flex items-center justify-center shrink-0 ml-1.5 shadow-2xs">
                          {contact.unreadCount}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT PANEL: WhatsApp Conversation Area                                   */}
        {/* ========================================================================= */}
        <div
          className={`flex-1 flex flex-col bg-[#efeae2] relative min-w-0 ${
            !mobileShowChat ? "hidden md:flex" : "flex"
          }`}
          style={{
            backgroundImage: `radial-gradient(#d1d7db 0.75px, transparent 0.75px)`,
            backgroundSize: "20px 20px",
          }}
        >
          {/* 1. WhatsApp Active Chat Header */}
          <div className="h-16 px-4 bg-[#f0f2f5] border-b border-[#e9edef] flex items-center justify-between shrink-0 select-none z-10">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <button
                onClick={() => setMobileShowChat(false)}
                className="md:hidden p-1.5 -ml-1 text-[#54656f] hover:text-[#111b21] rounded-full"
                title="Back to chats"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>

              <div className="relative shrink-0">
                <Avatar className="h-10 w-10 border border-slate-200">
                  <AvatarImage src={activeRecipient.avatarUrl} />
                  <AvatarFallback className="bg-[#00a884] text-white font-bold text-xs">
                    {activeRecipient.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {activeRecipient.isOnline && (
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-[#00a884] border-2 border-white" />
                )}
              </div>

              <div className="min-w-0">
                <h3 className="font-bold text-sm text-[#111b21] truncate flex items-center gap-1.5">
                  {activeRecipient.name}
                </h3>
                <p className="text-[11px] text-[#00a884] font-medium truncate flex items-center gap-1">
                  <span>online for teleconsultation</span>
                  <span className="text-[#667781]">• Beside Mohan X-Ray</span>
                </p>
              </div>
            </div>

            {/* WhatsApp Call & Action Buttons */}
            <div className="flex items-center gap-1 text-[#54656f]">
              <button
                onClick={handleStartCall}
                className="p-2 hover:bg-slate-200/60 rounded-full transition-colors text-[#54656f] hover:text-[#00a884]"
                title="WhatsApp Video Consultation Call"
              >
                <Video className="h-5 w-5" />
              </button>

              <button
                onClick={handleStartCall}
                className="p-2 hover:bg-slate-200/60 rounded-full transition-colors text-[#54656f] hover:text-[#00a884]"
                title="Voice Consultation Call"
              >
                <Phone className="h-4 w-4" />
              </button>

              <div className="h-5 w-px bg-[#d1d7db] mx-1 hidden sm:block" />

              <button
                className="p-2 hover:bg-slate-200/60 rounded-full transition-colors hidden sm:block"
                title="Search conversation"
              >
                <Search className="h-4 w-4" />
              </button>

              <button
                className="p-2 hover:bg-slate-200/60 rounded-full transition-colors"
                title="More options"
              >
                <MoreVertical className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* 2. Message Thread Body */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2">
            {/* WhatsApp End-to-End Encryption Banner */}
            <div className="mx-auto max-w-md rounded-lg bg-[#ffeecd] px-3.5 py-2 text-[11px] text-[#54656f] text-center shadow-2xs border border-[#ffdb99]/60 select-none">
              <span className="font-bold flex items-center justify-center gap-1 text-[#111b21] mb-0.5">
                <Lock className="h-3 w-3 text-[#54656f]" />
                End-to-End Encrypted Consultation
              </span>
              Messages and calls are encrypted. No one outside of this chat, not even Rehmat Care, can read or listen to them.
            </div>

            {/* Date Pill: TODAY */}
            <div className="flex justify-center my-3 select-none">
              <span className="rounded-lg bg-white/90 backdrop-blur-xs px-3 py-1 text-[11px] font-semibold text-[#54656f] shadow-2xs border border-[#e9edef]">
                TODAY
              </span>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center h-48 text-xs text-[#667781]">
                Loading WhatsApp messages...
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-center space-y-2 select-none">
                <div className="h-12 w-12 rounded-full bg-[#00a884]/10 text-[#00a884] flex items-center justify-center shadow-xs">
                  <Lock className="h-6 w-6" />
                </div>
                <h4 className="font-bold text-sm text-[#111b21]">
                  Direct Consultation with {activeRecipient.name}
                </h4>
                <p className="text-xs text-[#667781] max-w-sm">
                  Send symptom updates, attach Mohan X-Ray scan reports, or ask prescription questions with instant WhatsApp audio chimes.
                </p>
              </div>
            ) : (
              messages.map((msg, idx) => <MessageBubble key={msg.id || idx} message={msg} />)
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* 3. Quick Consultation Template Chips */}
          <div className="px-3 py-2 bg-[#f0f2f5]/90 border-t border-[#e9edef] flex items-center gap-1.5 overflow-x-auto scrollbar-none select-none">
            <span className="text-[10px] font-bold text-[#54656f] uppercase tracking-wider flex items-center gap-1 shrink-0">
              <Sparkles className="h-3 w-3 text-[#00a884]" />
              Quick:
            </span>
            {quickChips.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setPresetText(chip)}
                className="text-[11px] whitespace-nowrap bg-white hover:bg-[#00a884]/10 text-[#111b21] hover:text-[#00a884] border border-[#d1d7db] hover:border-[#00a884] px-2.5 py-1 rounded-full transition-all shadow-2xs cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* 4. WhatsApp Message Input Bar */}
          <MessageInput
            onSend={sendMessage}
            presetText={presetText}
            onClearPreset={() => setPresetText("")}
          />
        </div>

      </div>
    </div>
  );
}
