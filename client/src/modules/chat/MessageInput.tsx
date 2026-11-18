import React, { useState, useEffect } from "react";
import { Send, Paperclip, Smile, Camera, Mic } from "lucide-react";

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
      className="p-2 sm:p-2.5 bg-transparent flex items-center gap-2 select-none"
    >
      {/* 1. WhatsApp White Input Capsule */}
      <div className="flex-1 flex items-center gap-2 bg-white rounded-full px-3.5 py-1.5 sm:py-2 shadow-sm border border-[#e9edef] focus-within:border-[#00a884]/40 transition-all">
        {/* Smile Emoji */}
        <button
          type="button"
          className="text-[#8696a0] hover:text-[#111b21] p-0.5 rounded-full transition-colors shrink-0"
          title="Emojis"
        >
          <Smile className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>

        {/* Text Input */}
        <input
          type="text"
          placeholder="Message"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={disabled}
          className="flex-1 bg-transparent text-[14px] sm:text-base text-[#111b21] placeholder-[#8696a0] focus:outline-none min-w-0"
        />

        {/* Paperclip (Mohan X-Ray Attachment) */}
        <button
          type="button"
          onClick={handleAttach}
          className="text-[#8696a0] hover:text-[#00a884] p-0.5 rounded-full transition-colors shrink-0"
          title="Attach Mohan X-Ray / Lab Report"
        >
          <Paperclip className="h-5 w-5 rotate-45" />
        </button>

        {/* Camera Icon */}
        <button
          type="button"
          onClick={() => {
            setText((prev) =>
              prev
                ? `${prev}\n[Attached: Prescription_Photo.jpg]`
                : "[Attached: Prescription_Photo.jpg]"
            );
          }}
          className="text-[#8696a0] hover:text-[#00a884] p-0.5 rounded-full transition-colors shrink-0"
          title="Take / Send Photo"
        >
          <Camera className="h-5 w-5" />
        </button>
      </div>

      {/* 2. Floating Circular WhatsApp Green Send Button OR Voice Note Button */}
      {text.trim() ? (
        <button
          type="submit"
          disabled={disabled}
          className="h-11 w-11 sm:h-12 sm:w-12 rounded-full bg-[#00a884] hover:bg-[#008f6f] text-white flex items-center justify-center shadow-lg shadow-[#00a884]/30 active:scale-90 transition-transform shrink-0 cursor-pointer"
          title="Send"
        >
          <Send className="h-5 w-5 ml-0.5" />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => {
            setText("Doctor, sharing my voice message regarding symptoms.");
          }}
          className="h-11 w-11 sm:h-12 sm:w-12 rounded-full bg-[#00a884] hover:bg-[#008f6f] text-white flex items-center justify-center shadow-lg shadow-[#00a884]/30 active:scale-90 transition-transform shrink-0 cursor-pointer"
          title="Record Voice Note"
        >
          <Mic className="h-5 w-5" />
        </button>
      )}
    </form>
  );
}
