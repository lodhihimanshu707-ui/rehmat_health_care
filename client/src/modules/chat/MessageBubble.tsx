import React, { useState } from "react";
import { ChatMessage } from "./types";
import { useAuthStore } from "@/stores/auth.store";
import { Check, CheckCheck, FileText, Play, Pause, Heart, ThumbsUp } from "lucide-react";

interface MessageBubbleProps {
  message: ChatMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const { currentUser } = useAuthStore();
  const isMe = message.senderId === currentUser.id;
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [reaction, setReaction] = useState<string | null>(null);
  const [showReactionPicker, setShowReactionPicker] = useState(false);

  const timeFormatted = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const isAttachment = message.text.includes("[Attached:");
  const isVoiceNote = message.text.includes("[Voice Note");

  return (
    <div
      className={`group relative flex w-full ${isMe ? "justify-end" : "justify-start"} my-1.5 px-2 select-text`}
      onMouseLeave={() => setShowReactionPicker(false)}
    >
      {/* WhatsApp Message Bubble Container */}
      <div
        className={`relative max-w-[85%] sm:max-w-[65%] text-[13.5px] sm:text-[14.5px] shadow-xs transition-shadow ${
          isMe
            ? "bg-[#d9fdd3] text-[#111b21] rounded-2xl rounded-tr-xs" // WhatsApp Outgoing
            : "bg-white text-[#111b21] rounded-2xl rounded-tl-xs border border-[#e9edef]/80" // WhatsApp Incoming
        }`}
        style={{
          boxShadow: "0 1px 0.5px rgba(11, 20, 26, 0.13)",
        }}
      >
        {/* WhatsApp Tail Triangle */}
        {isMe ? (
          <div
            className="absolute top-0 -right-2 w-0 h-0 pointer-events-none"
            style={{
              borderTop: "10px solid #d9fdd3",
              borderRight: "10px solid transparent",
            }}
          />
        ) : (
          <div
            className="absolute top-0 -left-2 w-0 h-0 pointer-events-none"
            style={{
              borderTop: "10px solid #ffffff",
              borderLeft: "10px solid transparent",
            }}
          />
        )}

        <div className="p-2 sm:p-2.5 space-y-1">
          {/* 1. Voice Note Player (WhatsApp Audio Message UX) */}
          {isVoiceNote ? (
            <div className="flex items-center gap-2.5 py-1 min-w-[210px] sm:min-w-[240px]">
              <button
                type="button"
                onClick={() => setIsPlayingVoice(!isPlayingVoice)}
                className={`h-9 w-9 rounded-full flex items-center justify-center transition-all ${
                  isMe ? "bg-[#00a884] text-white" : "bg-[#00a884] text-white"
                }`}
              >
                {isPlayingVoice ? <Pause className="h-4 w-4 fill-white" /> : <Play className="h-4 w-4 fill-white ml-0.5" />}
              </button>

              <div className="flex-1 space-y-1">
                {/* Audio Waveform Bars */}
                <div className="flex items-center gap-0.5 h-6">
                  {[4, 12, 18, 8, 14, 20, 10, 16, 6, 14, 22, 16, 8, 12, 18, 10, 6].map((h, i) => (
                    <div
                      key={i}
                      className={`w-1 rounded-full transition-all ${
                        isPlayingVoice && i < 8 ? "bg-[#00a884]" : "bg-[#8696a0]"
                      }`}
                      style={{ height: `${h}px` }}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-[10px] text-[#667781]">
                  <span>{isPlayingVoice ? "0:04" : "0:14"}</span>
                  <span className="font-semibold">Voice Consultation</span>
                </div>
              </div>
            </div>
          ) : isAttachment ? (
            /* 2. PDF Document Attachment (WhatsApp File Card UX) */
            <div className="space-y-1.5">
              <p className="leading-relaxed whitespace-pre-wrap break-words">
                {message.text.split("[Attached:")[0].trim()}
              </p>
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-black/5 border border-black/5 hover:bg-black/10 transition-colors cursor-pointer">
                <div className="h-10 w-10 rounded-lg bg-[#ea0038] text-white flex items-center justify-center shrink-0 shadow-2xs font-bold text-xs uppercase">
                  PDF
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-xs text-[#111b21] truncate">
                    Mohan_XRay_Report_#MXR-9842.pdf
                  </p>
                  <p className="text-[10px] text-[#667781]">2 pages • 1.4 MB • Mohan X-Ray, Malviya Nagar</p>
                </div>
              </div>
            </div>
          ) : (
            /* 3. Standard Text Message */
            <p className="leading-relaxed whitespace-pre-wrap break-words">{message.text}</p>
          )}

          {/* Time & Read Status Ticks (Authentic WhatsApp UX: Grey = Delivered, Blue = Seen by Recipient) */}
          <div className="flex items-center justify-end gap-1 float-right ml-2 -mb-0.5 mt-0.5">
            <span className="text-[10px] text-[#667781] select-none">{timeFormatted}</span>
            {isMe && (
              message.isRead ? (
                <CheckCheck
                  className="h-3.5 w-3.5 text-[#53bdeb] stroke-[2.5]"
                  aria-label="Seen / Read by recipient"
                />
              ) : (
                <CheckCheck
                  className="h-3.5 w-3.5 text-[#8696a0] stroke-[2.2]"
                  aria-label="Delivered (Not seen yet)"
                />
              )
            )}
          </div>
        </div>

        {/* Reaction Pill (WhatsApp Emoji Reaction UX) */}
        {reaction && (
          <div className="absolute -bottom-2 right-2 bg-white rounded-full px-1.5 py-0.5 shadow-md border border-[#e9edef] text-xs flex items-center gap-0.5">
            <span>{reaction}</span>
          </div>
        )}

        {/* Reaction Picker Button on Hover */}
        <button
          onClick={() => setShowReactionPicker(!showReactionPicker)}
          className="absolute -top-3 right-0 opacity-0 group-hover:opacity-100 bg-white hover:bg-slate-50 text-slate-500 rounded-full h-6 w-6 shadow-md border border-slate-200 flex items-center justify-center text-xs transition-opacity"
          title="React"
        >
          😊
        </button>

        {showReactionPicker && (
          <div className="absolute -top-9 right-0 bg-white rounded-full px-2 py-1 shadow-xl border border-slate-200 flex items-center gap-1.5 text-sm z-30 animate-in fade-in zoom-in-95 duration-100">
            {["👍", "❤️", "🙏", "💊", "😊", "✅"].map((emoji) => (
              <button
                key={emoji}
                onClick={() => {
                  setReaction(emoji);
                  setShowReactionPicker(false);
                }}
                className="hover:scale-125 transition-transform p-0.5"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
