import React from "react";
import { ChatMessage } from "./types";
import { useAuthStore } from "@/stores/auth.store";
import { Avatar, AvatarImage, AvatarFallback } from "@/shared/ui/avatar";

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
        className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm shadow-xs ${
          isMe
            ? "bg-emerald-600 text-white rounded-br-xs"
            : "bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs"
        }`}
      >
        <p className="leading-relaxed whitespace-pre-wrap">{message.text}</p>
        <div
          className={`text-[9px] mt-1 text-right ${
            isMe ? "text-emerald-200" : "text-slate-400"
          }`}
        >
          {timeFormatted}
        </div>
      </div>
    </div>
  );
}

