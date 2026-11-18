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
      className={`group relative flex w-full ${isMe ? "justify-end" : "justify-start"} my-1.5 px-1 select-text`}
      onMouseLeave={() => setShowReactionPicker(false)}
    >
      {/* Modern Medical Consultation Message Card */}
      <div
        className={`relative max-w-[85%] sm:max-w-[70%] text-[13.5px] sm:text-[14px] transition-shadow ${
          isMe
            ? "bg-emerald-600 text-white rounded-2xl rounded-br-xs shadow-xs"
            : "bg-white text-slate-800 rounded-2xl rounded-bl-xs border border-slate-200 shadow-xs"
        }`}
      >
        <div className="p-2.5 sm:p-3 space-y-1.5">
          {/* 1. Voice Note Player (Audio Consultation) */}
          {isVoiceNote ? (
            <div className="flex items-center gap-2.5 py-1 min-w-[210px] sm:min-w-[240px]">
              <button
                type="button"
                onClick={() => setIsPlayingVoice(!isPlayingVoice)}
                className={`h-9 w-9 rounded-full flex items-center justify-center transition-all ${
                  isMe ? "bg-white/20 hover:bg-white/30 text-white" : "bg-emerald-600 hover:bg-emerald-700 text-white"
                }`}
              >
                {isPlayingVoice ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current ml-0.5" />}
              </button>

              <div className="flex-1 space-y-1">
                {/* Audio Waveform Bars */}
                <div className="flex items-center gap-0.5 h-6">
                  {[4, 12, 18, 8, 14, 20, 10, 16, 6, 14, 22, 16, 8, 12, 18, 10, 6].map((h, i) => (
                    <div
                      key={i}
                      className={`w-1 rounded-full transition-all ${
                        isMe
                          ? isPlayingVoice && i < 8 ? "bg-white" : "bg-emerald-300/70"
                          : isPlayingVoice && i < 8 ? "bg-emerald-600" : "bg-slate-300"
                      }`}
                      style={{ height: `${h}px` }}
                    />
                  ))}
                </div>
                <div className={`flex justify-between text-[10px] ${isMe ? "text-emerald-100" : "text-slate-500"}`}>
                  <span>{isPlayingVoice ? "0:04" : "0:14"}</span>
                  <span className="font-semibold">Audio Consultation Note</span>
                </div>
              </div>
            </div>
          ) : isAttachment ? (
            /* 2. PDF Document Attachment (Mohan X-Ray Card) */
            <div className="space-y-2">
              <p className="leading-relaxed whitespace-pre-wrap break-words">
                {message.text.split("[Attached:")[0].trim()}
              </p>
              <div
                className={`flex items-center gap-3 p-2.5 rounded-xl border transition-colors cursor-pointer ${
                  isMe
                    ? "bg-black/15 border-white/20 hover:bg-black/20"
                    : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <div className="h-10 w-10 rounded-lg bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-2xs font-bold text-xs uppercase">
                  PDF
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold text-xs truncate ${isMe ? "text-white" : "text-slate-900"}`}>
                    Mohan_XRay_Report_#MXR-9842.pdf
                  </p>
                  <p className={`text-[10px] ${isMe ? "text-emerald-100/90" : "text-slate-500"}`}>
                    2 pages • 1.4 MB • Mohan X-Ray Diagnostics
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* 3. Standard Text Message */
            <p className="leading-relaxed whitespace-pre-wrap break-words">{message.text}</p>
          )}

          {/* Time & Read Status Ticks */}
          <div className="flex items-center justify-end gap-1 float-right ml-2 -mb-0.5 mt-0.5">
            <span className={`text-[10px] select-none ${isMe ? "text-emerald-100/90" : "text-slate-400"}`}>
              {timeFormatted}
            </span>
            {isMe && (
              message.isRead ? (
                <CheckCheck
                  className="h-3.5 w-3.5 text-sky-200 stroke-[2.5]"
                  aria-label="Seen by doctor"
                />
              ) : (
                <CheckCheck
                  className="h-3.5 w-3.5 text-emerald-200/80 stroke-[2]"
                  aria-label="Delivered"
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
