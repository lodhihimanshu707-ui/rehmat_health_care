import React, { useState, useEffect } from "react";
import { Send, Paperclip, Smile, Mic } from "lucide-react";

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

  const handleAttach = () => {
    setText((prev) =>
      prev
        ? `${prev}\n[Attached: Mohan_XRay_Scan_Report.pdf]`
        : "[Attached: Mohan_XRay_Scan_Report.pdf]"
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 px-3 py-2.5 bg-[#f0f2f5] border-t border-[#e9edef] select-none"
    >
      {/* 1. Emoji / Smile Icon */}
      <button
        type="button"
        className="p-1.5 text-[#54656f] hover:text-[#111b21] hover:bg-slate-200/60 rounded-full transition-colors shrink-0"
        title="Emojis"
      >
        <Smile className="h-5 w-5" />
      </button>

      {/* 2. Paperclip Attachment Icon (Mohan X-Ray / Docs) */}
      <button
        type="button"
        onClick={handleAttach}
        className="p-1.5 text-[#54656f] hover:text-[#00a884] hover:bg-slate-200/60 rounded-full transition-colors shrink-0"
        title="Attach Mohan X-Ray / Lab Report"
      >
        <Paperclip className="h-5 w-5 rotate-45" />
      </button>

      {/* 3. WhatsApp Message Input Field */}
      <div className="flex-1 relative">
        <input
          type="text"
          placeholder="Type a message"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={disabled}
          className="w-full rounded-lg bg-white px-4 py-2 text-[13px] sm:text-sm text-[#111b21] placeholder-[#667781] focus:outline-none shadow-2xs border border-[#ffffff] focus:border-[#00a884]/40 transition-all disabled:opacity-50"
        />
      </div>

      {/* 4. Action Button: WhatsApp Green Send Button OR Voice Note Mic */}
      {text.trim() ? (
        <button
          type="submit"
          disabled={disabled}
          className="h-10 w-10 rounded-full bg-[#00a884] hover:bg-[#008f6f] active:scale-95 text-white flex items-center justify-center shadow-md transition-all shrink-0 cursor-pointer"
          title="Send message"
        >
          <Send className="h-4 w-4 ml-0.5" />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => {
            setText("Doctor, here is my voice note update regarding symptoms.");
          }}
          className="p-2 text-[#54656f] hover:text-[#00a884] hover:bg-slate-200/60 rounded-full transition-colors shrink-0"
          title="Hold to record voice note"
        >
          <Mic className="h-5 w-5" />
        </button>
      )}
    </form>
  );
}
