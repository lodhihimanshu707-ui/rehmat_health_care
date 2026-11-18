"use client";

import React, { useState, useEffect, useRef } from "react";
import { useChat } from "./useChat";
import { MessageBubble } from "./MessageBubble";
import { MessageInput } from "./MessageInput";
import {
  useAuthStore,
  DEMO_PATIENT_1,
  DEMO_PATIENT_2,
  DEMO_DOCTOR,
  DEMO_ADMIN,
} from "@/stores/auth.store";
import { useCallStore } from "@/stores/call.store";
import { getSocket } from "@/lib/socket";
import { soundManager } from "@/lib/sound";
import { Avatar, AvatarImage, AvatarFallback } from "@/shared/ui/avatar";
import Link from "next/link";
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
  MessageSquare,
  PhoneIncoming,
  PhoneOutgoing,
  X,
  Home,
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
  lastMessageFromMe?: boolean;
  lastMessageRead?: boolean;
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

  // Authentic WhatsApp contacts based on current user role
  const contacts: Contact[] = isDoctor
    ? [
        {
          id: DEMO_PATIENT_1.id,
          name: DEMO_PATIENT_1.name,
          role: "Patient #RH-101",
          subtitle: "Viral Fever & Sore Throat • OPD Queue",
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
          role: "Clinic Coordinator",
          subtitle: "Front Desk & Mohan X-Ray Synergy",
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
  // Default to list view on mobile unless specific recipient query parameter was supplied
  const [mobileScreen, setMobileScreen] = useState<"list" | "chat">(
    initialRecipientId || initialRecipientName ? "chat" : "list"
  );
  const [activeTab, setActiveTab] = useState<"chats" | "calls">("chats");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [presetText, setPresetText] = useState("");
  const [isMuted, setIsMuted] = useState(soundManager.isMuted());
  const [showMenu, setShowMenu] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const { messages, isLoading, sendMessage, markOutgoingAsRead } = useChat(activeRecipient.id);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const toggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundManager.setMuted(next);
    if (!next) {
      soundManager.playMessageReceived();
    }
  };

  const handleSendWrapper = (text: string) => {
    sendMessage(text);

    // Authentic WhatsApp flow:
    // Message is initially DELIVERED (grey ticks).
    // When the doctor actually opens/views the chat, the doctor begins typing and ticks turn BLUE (Seen).
    if (isPatient && activeRecipient.id === DEMO_DOCTOR.id) {
      setTimeout(() => {
        markOutgoingAsRead(); // Turns ticks from grey to blue upon doctor viewing
        setIsTyping(true);
      }, 2500);

      setTimeout(() => {
        setIsTyping(false);
      }, 5500);
    }
  };

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

  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    <div className="h-[calc(100dvh-56px)] md:h-[100dvh] w-full flex bg-[#efeae2] overflow-hidden select-none">
      
      {/* ========================================================================= */}
      {/* 1. WHATSAPP CHATS LIST / CALLS TAB (Mobile List View & Desktop Left Side) */}
      {/* ========================================================================= */}
      <div
        className={`w-full md:w-[380px] lg:w-[420px] bg-white border-r border-[#d1d7db] flex flex-col shrink-0 h-full ${
          mobileScreen === "chat" ? "hidden md:flex" : "flex"
        }`}
      >
        {/* ========================================================================= */}
        {/* Modern Clean Header (Rehmat Health Care Consultation Desk)               */}
        {/* ========================================================================= */}
        <div className="bg-white border-b border-[#e9edef] px-4 pt-3.5 pb-2.5 space-y-3 shrink-0 select-none">
          {/* Top Title & Quick Action Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Avatar className="h-9 w-9 border border-slate-200 shrink-0">
                <AvatarImage src={currentUser?.avatarUrl} />
                <AvatarFallback className="bg-[#008069] text-white font-bold text-xs">
                  {currentUser?.name?.slice(0, 2).toUpperCase() || "PT"}
                </AvatarFallback>
              </Avatar>

              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="text-lg sm:text-xl font-black text-[#111b21] tracking-tight leading-none">
                    Consultations
                  </h1>
                  <span className="text-[10px] font-bold text-[#008069] bg-[#008069]/10 px-2 py-0.5 rounded-full">
                    Rehmat Care
                  </span>
                </div>
                <span className="text-[11px] text-[#667781] block mt-0.5">
                  {isDoctor ? "Doctor Cockpit Desk" : "Patient Medical Desk"}
                </span>
              </div>
            </div>

            {/* Right Action Icons: Sound Mute & Dashboard Link */}
            <div className="flex items-center gap-1.5 text-[#54656f]">
              <button
                onClick={toggleSound}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                  isMuted
                    ? "bg-slate-100 text-slate-400 border-slate-200"
                    : "bg-[#008069]/10 text-[#008069] border-[#008069]/20 hover:bg-[#008069]/20"
                }`}
                title={isMuted ? "Unmute Consultation Sounds" : "Mute Consultation Sounds"}
              >
                {isMuted ? (
                  <>
                    <VolumeX className="h-3.5 w-3.5 text-rose-500" />
                    <span className="text-[10px]">Muted</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="h-3.5 w-3.5 text-[#008069]" />
                    <span className="text-[10px]">Sound</span>
                  </>
                )}
              </button>

              <Link
                href={isDoctor ? "/doctor" : "/patient"}
                className="p-1.5 hover:bg-slate-100 rounded-full text-[#54656f] hover:text-[#111b21] transition-colors"
                title="Back to Dashboard"
              >
                <Home className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Integrated Modern Search Capsule */}
          <div className="flex items-center gap-2 bg-[#f0f2f5] hover:bg-[#eaeef1] focus-within:bg-white focus-within:border-[#008069]/40 border border-[#e9edef] rounded-xl px-3 py-1.5 transition-all">
            <Search className="h-4 w-4 text-[#54656f] shrink-0" />
            <input
              type="text"
              placeholder="Search doctor, patient, symptoms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-xs text-[#111b21] placeholder-[#8696a0] focus:outline-none"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="text-[#8696a0] hover:text-[#111b21]">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Modern Filter Pills (All / Doctors / Staff / Calls) */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
            <button
              onClick={() => setActiveTab("chats")}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all shrink-0 border ${
                activeTab === "chats"
                  ? "bg-[#008069] text-white border-[#008069] shadow-xs"
                  : "bg-[#f0f2f5] text-[#54656f] hover:bg-[#e9edef] border-transparent"
              }`}
            >
              All Chats ({contacts.length})
            </button>

            <button
              onClick={() => setActiveTab("calls")}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all shrink-0 flex items-center gap-1 border ${
                activeTab === "calls"
                  ? "bg-[#008069] text-white border-[#008069] shadow-xs"
                  : "bg-[#f0f2f5] text-[#54656f] hover:bg-[#e9edef] border-transparent"
              }`}
            >
              <Phone className="h-3 w-3" />
              <span>Call Log</span>
            </button>
          </div>
        </div>

        {/* Tab 1: CHATS LIST */}
        {activeTab === "chats" && (
          <div className="flex-1 overflow-y-auto divide-y divide-[#f2f2f2] bg-white">
            {filteredContacts.map((contact) => {
              const isSelected = contact.id === activeRecipient.id;
              return (
                <div
                  key={contact.id}
                  onClick={() => {
                    setActiveRecipient(contact);
                    setMobileScreen("chat");
                  }}
                  className={`flex items-center gap-3.5 px-4 py-3 cursor-pointer transition-colors ${
                    isSelected ? "bg-[#f0f2f5]" : "hover:bg-[#f5f6f6]"
                  }`}
                >
                  <div className="relative shrink-0">
                    <Avatar className="h-12 w-12 border border-slate-200">
                      <AvatarImage src={contact.avatarUrl} />
                      <AvatarFallback className="bg-[#008069] text-white font-bold text-sm">
                        {contact.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {contact.isOnline && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-[#00a884] border-2 border-white" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-[14.5px] text-[#111b21] truncate">
                        {contact.name}
                      </h3>
                      <span
                        className={`text-[11px] shrink-0 ${
                          contact.unreadCount ? "text-[#00a884] font-bold" : "text-[#667781]"
                        }`}
                      >
                        {contact.lastTime}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-0.5">
                      <p className="text-xs text-[#667781] truncate flex items-center gap-1">
                        {contact.lastMessageFromMe && (
                          contact.lastMessageRead ? (
                            <CheckCheck className="h-3.5 w-3.5 text-[#53bdeb] shrink-0" />
                          ) : (
                            <CheckCheck className="h-3.5 w-3.5 text-[#8696a0] shrink-0" />
                          )
                        )}
                        <span className={`truncate ${contact.unreadCount ? "text-[#111b21] font-medium" : "text-[#667781]"}`}>
                          {contact.lastMessage}
                        </span>
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
        )}

        {/* Tab 2: CALLS LOG */}
        {activeTab === "calls" && (
          <div className="flex-1 overflow-y-auto divide-y divide-[#f2f2f2] bg-white p-2">
            <div className="px-3 py-2 text-xs font-bold text-[#667781] uppercase tracking-wider">
              Recent Consultations
            </div>

            <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors">
              <div className="flex items-center gap-3">
                <Avatar className="h-11 w-11">
                  <AvatarImage src={DEMO_DOCTOR.avatarUrl} />
                  <AvatarFallback className="bg-[#008069] text-white font-bold text-xs">RA</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-bold text-sm text-[#111b21]">Dr. Raees Akhtar</h4>
                  <p className="text-xs text-[#667781] flex items-center gap-1 mt-0.5">
                    <PhoneIncoming className="h-3.5 w-3.5 text-[#00a884]" />
                    <span>Today, 11:42 AM (8 mins)</span>
                  </p>
                </div>
              </div>
              <button
                onClick={handleStartCall}
                className="p-2.5 rounded-full hover:bg-emerald-50 text-[#008069]"
                title="Call Again"
              >
                <Video className="h-5 w-5" />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors">
              <div className="flex items-center gap-3">
                <Avatar className="h-11 w-11">
                  <AvatarImage src={DEMO_PATIENT_1.avatarUrl} />
                  <AvatarFallback className="bg-[#008069] text-white font-bold text-xs">RS</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-bold text-sm text-[#111b21]">Rahul Sharma</h4>
                  <p className="text-xs text-[#667781] flex items-center gap-1 mt-0.5">
                    <PhoneOutgoing className="h-3.5 w-3.5 text-[#00a884]" />
                    <span>Yesterday, 04:15 PM (12 mins)</span>
                  </p>
                </div>
              </div>
              <button
                onClick={handleStartCall}
                className="p-2.5 rounded-full hover:bg-emerald-50 text-[#008069]"
                title="Call Again"
              >
                <Video className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. REHMAT HEALTH CARE CHAT ROOM (Mobile Full Screen & Desktop Right Side) */}
      {/* ========================================================================= */}
      <div
        className={`flex-1 flex flex-col h-full bg-slate-50 relative min-w-0 ${
          mobileScreen === "list" ? "hidden md:flex" : "flex"
        }`}
      >
        {/* Modern Medical Consultation Header */}
        <div className="h-16 px-4 bg-white border-b border-slate-200 text-slate-800 flex items-center justify-between shrink-0 shadow-xs z-20 select-none">
          <div className="flex items-center gap-3 min-w-0">
            {/* Back button returns to consultations list on mobile */}
            <button
              onClick={() => setMobileScreen("list")}
              className="p-1.5 -ml-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors md:hidden cursor-pointer"
              title="Back to Consultations"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <div className="relative shrink-0">
              <Avatar className="h-10 w-10 border border-slate-200 shadow-2xs">
                <AvatarImage src={activeRecipient.avatarUrl} />
                <AvatarFallback className="bg-emerald-600 text-white font-bold text-xs">
                  {activeRecipient.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {activeRecipient.isOnline && (
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white" />
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h2 className="font-bold text-sm sm:text-base text-slate-900 truncate leading-tight">
                  {activeRecipient.name}
                </h2>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-full shrink-0">
                  Verified
                </span>
              </div>
              {isTyping ? (
                <p className="text-[11px] text-emerald-600 font-bold animate-pulse flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                  <span>Doctor is replying...</span>
                </p>
              ) : (
                <p className="text-[11px] text-slate-500 truncate flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span className="font-medium text-emerald-700">Online</span>
                  <span className="text-slate-400 hidden sm:inline">• MBBS, MD (Beside Mohan X-Ray)</span>
                </p>
              )}
            </div>
          </div>

          {/* Consultation Action Buttons: Direct Video OPD & Audio Call */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleStartCall}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
              title="Start Live Video Tele-OPD"
            >
              <Video className="h-4 w-4" />
              <span className="hidden sm:inline">Video OPD</span>
            </button>

            <button
              onClick={handleStartCall}
              className="p-2 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              title="Audio Consultation Call"
            >
              <Phone className="h-4 w-4" />
            </button>

            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                title="Options"
              >
                <MoreVertical className="h-4 w-4" />
              </button>

              {showMenu && (
                <div className="absolute right-0 top-10 w-44 bg-white text-slate-800 rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 text-xs">
                  <Link
                    href={isDoctor ? "/doctor" : "/patient"}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 font-bold text-slate-700"
                  >
                    <Home className="h-4 w-4 text-emerald-600" />
                    <span>Exit to Dashboard</span>
                  </Link>
                  <button
                    onClick={toggleSound}
                    className="w-full text-left flex items-center gap-2 px-3 py-2 hover:bg-slate-50 font-semibold cursor-pointer"
                  >
                    <Volume2 className="h-4 w-4 text-slate-500" />
                    <span>{isMuted ? "Unmute Sounds" : "Mute Sounds"}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Medical Consultation Messages Canvas */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5">
          {/* Medical Privacy & Confidentiality Badge */}
          <div className="mx-auto max-w-md rounded-xl bg-emerald-50/80 border border-emerald-200/70 px-3.5 py-2 text-center shadow-2xs select-none">
            <div className="flex items-center justify-center gap-1.5 font-bold text-xs text-emerald-800 mb-0.5">
              <Lock className="h-3.5 w-3.5 text-emerald-600" />
              <span>Confidential Tele-OPD Consultation</span>
            </div>
            <p className="text-[11px] text-emerald-700/90 leading-tight">
              Direct clinic desk with Dr. Raees Akhtar. Diagnostics synced with Mohan X-Ray, Malviya Nagar.
            </p>
          </div>

          {/* Date Separator Pill */}
          <div className="flex justify-center my-2 select-none">
            <span className="rounded-full bg-slate-200/80 px-3 py-0.5 text-[10px] font-bold text-slate-600">
              TODAY
            </span>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-48 text-xs text-[#667781]">
              Loading consultation messages...
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center space-y-2 select-none">
              <div className="h-12 w-12 rounded-full bg-[#008069]/10 text-[#008069] flex items-center justify-center">
                <Lock className="h-6 w-6" />
              </div>
              <h4 className="font-bold text-sm text-[#111b21]">
                Direct Consultation with {activeRecipient.name}
              </h4>
              <p className="text-xs text-[#667781] max-w-sm">
                Discuss medical symptoms, medication dosage, lab results, and follow-up advice in real-time with instant sound chimes.
              </p>
            </div>
          ) : (
            messages.map((msg, idx) => <MessageBubble key={msg.id || idx} message={msg} />)
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Consultation Template Chips */}
        <div className="px-3 py-1.5 bg-[#f0f2f5]/95 border-t border-[#e9edef] flex items-center gap-1.5 overflow-x-auto scrollbar-none select-none">
          <span className="text-[10px] font-bold text-[#54656f] uppercase tracking-wider flex items-center gap-1 shrink-0">
            <Sparkles className="h-3 w-3 text-[#008069]" />
            Quick:
          </span>
          {quickChips.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setPresetText(chip)}
              className="text-[11px] whitespace-nowrap bg-white hover:bg-[#008069]/10 text-[#111b21] hover:text-[#008069] border border-[#d1d7db] hover:border-[#008069] px-2.5 py-1 rounded-full transition-all shadow-2xs cursor-pointer"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* WhatsApp Mobile Input Bar */}
        <MessageInput
          onSend={handleSendWrapper}
          presetText={presetText}
          onClearPreset={() => setPresetText("")}
        />
      </div>

    </div>
  );
}
