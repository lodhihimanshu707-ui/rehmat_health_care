import React from "react";
import { ChatMessage } from "./types";
import { useAuthStore } from "@/stores/auth.store";
import { CheckCheck, FileText } from "lucide-react";

interface MessageBubbleProps {
  message: ChatMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const { currentUser } = useAuthStore();
  const isMe = message.senderId === currentUser.id;

  const timeFormatted = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const hasAttachment = message.text.includes("[Attached:");

  return (
    <div className={`flex w-full ${isMe ? "justify-end" : "justify-start"} my-1 px-2`}>
      <div
        className={`relative max-w-[85%] sm:max-w-[70%] rounded-2xl px-3.5 py-2 shadow-2xs text-[13px] sm:text-sm select-text ${
          isMe
            ? "bg-[#d9fdd3] text-[#111b21] rounded-tr-xs" // WhatsApp Outgoing Message Green
            : "bg-white text-[#111b21] rounded-tl-xs border border-[#e9edef]/60" // WhatsApp Incoming Message White
        }`}
      >
        {/* Attachment Box (WhatsApp Document Card style) */}
        {hasAttachment ? (
          <div className="space-y-1.5 pb-1">
            <p className="leading-relaxed whitespace-pre-wrap">
              {message.text.split("[Attached:")[0].trim()}
            </p>
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/70 border border-[#e2e8f0] shadow-2xs">
              <div className="h-9 w-9 rounded-lg bg-[#00a884]/15 text-[#00a884] flex items-center justify-center shrink-0">
                <FileText className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-xs text-[#111b21] truncate">
                  Mohan_XRay_Scan_Report.pdf
                </p>
                <p className="text-[10px] text-[#667781]">2 pages • 1.4 MB • PDF</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="leading-relaxed whitespace-pre-wrap break-words">{message.text}</p>
        )}

        {/* WhatsApp Timestamp & Blue Double Ticks */}
        <div className="flex items-center justify-end gap-1 -mb-0.5 mt-0.5 ml-3 float-right">
          <span className="text-[10px] text-[#667781] leading-none">{timeFormatted}</span>
          {isMe && (
            <CheckCheck className="h-3.5 w-3.5 text-[#53bdeb] stroke-[2.5]" />
          )}
        </div>
      </div>
    </div>
  );
}
