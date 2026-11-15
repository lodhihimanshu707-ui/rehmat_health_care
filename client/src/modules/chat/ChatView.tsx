"use client";

import React, { useState } from "react";
import { useChat } from "./useChat";
import { MessageBubble } from "./MessageBubble";
import { MessageInput } from "./MessageInput";
import { useAuthStore, DEMO_PATIENT, DEMO_DOCTOR } from "@/stores/auth.store";
import { Avatar, AvatarImage, AvatarFallback } from "@/shared/ui/avatar";
import { MessageSquare, CheckCircle2, ShieldCheck } from "lucide-react";

interface ChatViewProps {
  initialRecipientId?: string;
  initialRecipientName?: string;
}

export function ChatView({ initialRecipientId, initialRecipientName }: ChatViewProps) {
  const { currentUser } = useAuthStore();
  const isPatient = currentUser.role === "patient";

  const defaultRecipientId = initialRecipientId || (isPatient ? DEMO_DOCTOR.id : DEMO_PATIENT.id);
  const defaultRecipientName = initialRecipientName || (isPatient ? DEMO_DOCTOR.name : DEMO_PATIENT.name);

  const [activeRecipientId, setActiveRecipientId] = useState(defaultRecipientId);
  const [activeRecipientName, setActiveRecipientName] = useState(defaultRecipientName);

  const { messages, isLoading, sendMessage } = useChat(activeRecipientId);

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md flex flex-col h-[650px]">
        {/* Chat Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-emerald-200">
              <AvatarImage
                src={
                  activeRecipientId === DEMO_DOCTOR.id
                    ? DEMO_DOCTOR.avatarUrl
                    : DEMO_PATIENT.avatarUrl
                }
              />
              <AvatarFallback className="bg-emerald-100 text-emerald-800 font-bold text-xs">
                {activeRecipientName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                {activeRecipientName}
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              </h3>
              <p className="text-[11px] text-emerald-700 flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
                <span>Online for Teleconsultation</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span className="hidden sm:inline">Encrypted Clinic Messaging</span>
          </div>
        </div>

        {/* Message Thread Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/30">
          {isLoading ? (
            <div className="flex items-center justify-center h-full text-xs text-slate-400">
              Loading chat messages...
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-2 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h4 className="font-bold text-sm text-slate-800">No messages yet</h4>
              <p className="text-xs text-slate-500 max-w-sm">
                Start a consultation conversation with {activeRecipientName}. You can ask questions, describe symptoms, or request prescription advice.
              </p>
            </div>
          ) : (
            messages.map((msg, index) => <MessageBubble key={msg.id || index} message={msg} />)
          )}
        </div>

        {/* Message Input Bar */}
        <MessageInput onSend={sendMessage} />
      </div>
    </div>
  );
}

