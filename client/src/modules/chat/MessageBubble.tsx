import React from "react";
import { ChatMessage } from "./types";
import { useAuthStore } from "@/stores/auth.store";
import { Avatar, AvatarImage, AvatarFallback } from "@/shared/ui/avatar";
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
  });

  const hasAttachment = message.text.includes("[Attached:");

  return (
    <div className={`flex items-end gap-2.5 ${isMe ? "justify-end" : "justify-start"}`}>
      {!isMe && (
        <Avatar className="h-7 w-7 border border-slate-200">
          <AvatarImage src={message.sender?.avatarUrl} />
          <AvatarFallback className="bg-emerald-100 text-emerald-800 text-[10px] font-bold">
            {message.sender?.name?.slice(0, 2).toUpperCase() || "DR"}
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm shadow-xs ${
          isMe
            ? "bg-emerald-600 text-white rounded-br-xs"
            : "bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs"
        }`}
      >
        {hasAttachment ? (
          <div className="space-y-1.5">
            <p className="leading-relaxed whitespace-pre-wrap">
              {message.text.split("[Attached:")[0].trim()}
            </p>
            <div
              className={`flex items-center gap-1.5 p-2 rounded-xl text-xs font-semibold ${
                isMe ? "bg-emerald-700/60 text-white" : "bg-slate-100 text-slate-800"
              }`}
            >
              <FileText className="h-4 w-4 shrink-0 text-emerald-300" />
              <span>Mohan X-Ray Scan #MXR-9842.pdf</span>
            </div>
          </div>
        ) : (
          <p className="leading-relaxed whitespace-pre-wrap">{message.text}</p>
        )}

        <div
          className={`text-[9px] mt-1 flex items-center justify-end gap-1 ${
            isMe ? "text-emerald-200" : "text-slate-400"
          }`}
        >
          <span>{timeFormatted}</span>
          {isMe && <CheckCheck className="h-3 w-3 text-emerald-300" />}
        </div>
      </div>
    </div>
  );
}
