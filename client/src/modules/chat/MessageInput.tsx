import React, { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/shared/ui/button";

interface MessageInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export function MessageInput({ onSend, disabled }: MessageInputProps) {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || disabled) return;
    onSend(text);
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 p-3 bg-white border-t border-slate-200">
      <input
        type="text"
        placeholder="Type medical query, symptoms, or follow-up note..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={disabled}
        className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all disabled:opacity-50"
      />
      <Button
        type="submit"
        disabled={!text.trim() || disabled}
        className="h-10 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-1 text-xs"
      >
        <Send className="h-4 w-4" />
        <span className="hidden sm:inline">Send</span>
      </Button>
    </form>
  );
}

