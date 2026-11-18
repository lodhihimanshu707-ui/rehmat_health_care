"use client";

import React, { useState, useEffect, useRef } from "react";
import { useChat } from "./useChat";
import { MessageBubble } from "./MessageBubble";
import { MessageInput } from "./MessageInput";
import { useAuthStore, DEMO_PATIENT_1, DEMO_PATIENT_2, DEMO_DOCTOR, DEMO_ADMIN } from "@/stores/auth.store";
import { Avatar, AvatarImage, AvatarFallback } from "@/shared/ui/avatar";
import { soundManager } from "@/lib/sound";
import {
  MessageSquare,
  CheckCircle2,
  ShieldCheck,
  Volume2,
  VolumeX,
  Sparkles,
  Users,
} from "lucide-react";

interface Contact {
  id: string;
  name: string;
  role: string;
  subtitle: string;
  avatarUrl?: string;
}

interface ChatViewProps {
  initialRecipientId?: string;
  initialRecipientName?: string;
}

export function ChatView({ initialRecipientId, initialRecipientName }: ChatViewProps) {
  const { currentUser, isAuthenticated } = useAuthStore();
  const isPatient = currentUser?.role === "patient";
  const isDoctor = currentUser?.role === "doctor";

  // Build contact list based on current user role
  const contacts: Contact[] = isDoctor
    ? [
        {
          id: DEMO_PATIENT_1.id,
          name: DEMO_PATIENT_1.name,
          role: "Patient #RH-101",
          subtitle: "Viral Fever & Sore Throat • OPD Queue",
          avatarUrl: DEMO_PATIENT_1.avatarUrl,
        },
        {
          id: DEMO_PATIENT_2.id,
          name: DEMO_PATIENT_2.name,
          role: "Patient #RH-102",
          subtitle: "Chest Congestion Review",
          avatarUrl: DEMO_PATIENT_2.avatarUrl,
        },
        {
          id: "a3000000-0000-0000-0000-000000000003",
          name: "Himanshu",
          role: "Patient #RH-103",
          subtitle: "Walk-in OPD Token • 8279799553",
          avatarUrl: undefined,
        },
        {
          id: DEMO_ADMIN.id,
          name: "Amit Verma (Reception)",
          role: "Clinic Coordinator",
          subtitle: "Front Desk & Mohan X-Ray Synergy",
          avatarUrl: DEMO_ADMIN.avatarUrl,
        },
      ]
    : [
        {
          id: DEMO_DOCTOR.id,
          name: DEMO_DOCTOR.name,
          role: "Chief Medical Consultant",
          subtitle: "MBBS, MD - General Medicine (Beside Mohan X-Ray)",
          avatarUrl: DEMO_DOCTOR.avatarUrl,
        },
        {
          id: DEMO_ADMIN.id,
          name: "Amit Verma (Reception)",
          role: "Front Desk Coordinator",
          subtitle: "OPD Slips, Payments & Lab Reports",
          avatarUrl: DEMO_ADMIN.avatarUrl,
        },
      ];

  const defaultRecipient =
    contacts.find((c) => c.id === initialRecipientId) ||
    contacts.find((c) => c.name === initialRecipientName) ||
    contacts[0];

  const [activeRecipient, setActiveRecipient] = useState<Contact>(defaultRecipient);
  const [presetText, setPresetText] = useState<string>("");
  const [isAudioMuted, setIsAudioMuted] = useState(soundManager.isMuted());

  const { messages, isLoading, sendMessage } = useChat(activeRecipient.id);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on message updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const toggleSound = () => {
    const next = !isAudioMuted;
    setIsAudioMuted(next);
    soundManager.setMuted(next);
    if (!next) {
      soundManager.playMessageReceived();
    }
  };

  const quickChips = isDoctor
    ? [
        "Please take Tab. Paracetamol 650mg TDS after food.",
        "Kindly share your latest Mohan X-Ray chest report.",
        "Your vitals look stable. Keep monitoring temperature.",
        "Visit the clinic tomorrow at 11 AM for physical review.",
      ]
    : [
        "Doctor, I have high fever (101°F) and cough since yesterday.",
        "Sharing my Mohan X-Ray scan report for your review.",
        "When should I take the prescribed antibiotic dosage?",
        "Thank you Doctor, feeling much better today!",
      ];

  if (!isAuthenticated) return null;

  return (
    <div className="mx-auto max-w-5xl px-2 sm:px-4 py-2 sm:py-4">
      {/* Contact Switcher Bar */}
      <div className="mb-3 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 shrink-0 px-1">
          <Users className="h-3.5 w-3.5" />
          Chat with:
        </span>
        {contacts.map((c) => {
          const isSelected = c.id === activeRecipient.id;
          return (
            <button
              key={c.id}
              onClick={() => setActiveRecipient(c)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 border ${
                isSelected
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                  : "bg-white text-slate-700 hover:bg-slate-100 border-slate-200"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  isSelected ? "bg-white animate-pulse" : "bg-emerald-500"
                }`}
              />
              <span>{c.name}</span>
            </button>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200 bg-white shadow-md flex flex-col h-[calc(100dvh-200px)] min-h-[480px] max-h-[720px]">
        {/* Chat Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 p-3 sm:p-4">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <Avatar className="h-9 w-9 sm:h-10 sm:w-10 border-2 border-emerald-300">
              <AvatarImage src={activeRecipient.avatarUrl} />
              <AvatarFallback className="bg-emerald-100 text-emerald-800 font-bold text-xs">
                {activeRecipient.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div>
              <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
                {activeRecipient.name}
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              </h3>
              <p className="text-[10px] sm:text-[11px] text-slate-500 truncate max-w-[200px] sm:max-w-md">
                {activeRecipient.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleSound}
              className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
                isAudioMuted
                  ? "bg-slate-100 text-slate-400 border-slate-200"
                  : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
              }`}
              title={isAudioMuted ? "Unmute chat sound" : "Mute chat sound"}
            >
              {isAudioMuted ? (
                <>
                  <VolumeX className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline text-[10px]">Muted</span>
                </>
              ) : (
                <>
                  <Volume2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="hidden sm:inline text-[10px]">Tone On</span>
                </>
              )}
            </button>

            <div className="hidden sm:flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100/60 px-2.5 py-1 rounded-full border border-emerald-200">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>Encrypted</span>
            </div>
          </div>
        </div>

        {/* Message Thread Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/40">
          {isLoading ? (
            <div className="flex items-center justify-center h-full text-xs text-slate-400">
              Loading chat messages...
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-2 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 shadow-xs">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h4 className="font-extrabold text-sm text-slate-800">
                Start conversation with {activeRecipient.name}
              </h4>
              <p className="text-xs text-slate-500 max-w-sm">
                Discuss medical symptoms, medication dosage, lab results, and follow-up advice in real-time with sound notifications.
              </p>
            </div>
          ) : (
            messages.map((msg, index) => <MessageBubble key={msg.id || index} message={msg} />)
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Consultation Chips */}
        <div className="px-3 py-2 bg-slate-50 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 shrink-0">
            <Sparkles className="h-3 w-3 text-emerald-500" />
            Quick:
          </span>
          {quickChips.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setPresetText(chip)}
              className="text-[11px] whitespace-nowrap bg-white hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 border border-slate-200/80 hover:border-emerald-300 px-2.5 py-1 rounded-lg transition-colors shadow-2xs"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Message Input Bar */}
        <MessageInput
          onSend={sendMessage}
          presetText={presetText}
          onClearPreset={() => setPresetText("")}
        />
      </div>
    </div>
  );
}
