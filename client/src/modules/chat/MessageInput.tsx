import React, { useState, useEffect } from "react";
import { Send, Paperclip } from "lucide-react";
import { Button } from "@/shared/ui/button";

interface MessageInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
  presetText?: string;
  onClearPreset?: () => void;
}

export function MessageInput({ onSend, disabled, presetText, onClearPreset }: MessageInputProps) {
  const [text, setText] = useState("");

  useEffect(() => {
    if (presetText) {
      setText(presetText);
      if (onClearPreset) onClearPreset();
    }
  }, [presetText, onClearPreset]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || disabled) return;
    onSend(text);
    setText("");
  };

  const handleAttachReport = () => {
    setText((prev) =>
      prev
        ? `${prev}\n[Attached: Mohan X-Ray Scan #MXR-9842.pdf]`
        : "[Attached: Mohan X-Ray Scan #MXR-9842.pdf]"
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 p-3 bg-white border-t border-slate-200">
      <button
        type="button"
        onClick={handleAttachReport}
        className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors shrink-0"
        title="Attach Mohan X-Ray / Lab Report"
      >
        <Paperclip className="h-4 w-4" />
      </button>

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
        className="h-10 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-1 text-xs shrink-0"
      >
        <Send className="h-4 w-4" />
        <span className="hidden sm:inline">Send</span>
      </Button>
    </form>
  );
}
