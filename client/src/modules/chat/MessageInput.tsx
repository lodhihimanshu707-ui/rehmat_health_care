import React, { useState, useEffect } from "react";
import {
  Send,
  Paperclip,
  Smile,
  Camera,
  Mic,
  FileText,
  Image as ImageIcon,
  Pill,
  Trash2,
  X,
} from "lucide-react";

interface MessageInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
  presetText?: string;
  onClearPreset?: () => void;
}

export function MessageInput({ onSend, disabled, presetText, onClearPreset }: MessageInputProps) {
  const [text, setText] = useState("");
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  useEffect(() => {
    if (presetText) {
      setText(presetText);
      if (onClearPreset) onClearPreset();
    }
  }, [presetText, onClearPreset]);

  // Voice note timer simulation
  useEffect(() => {
    let interval: any = null;
    if (isRecordingVoice) {
      interval = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRecordingVoice]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || disabled) return;
    onSend(text);
    setText("");
    setShowAttachMenu(false);
  };

  const handleSendVoiceNote = () => {
    onSend(`[Voice Note • 0:${recordingSeconds < 10 ? "0" + recordingSeconds : recordingSeconds}] Patient audio description of symptoms`);
    setIsRecordingVoice(false);
  };

  const handleCancelVoice = () => {
    setIsRecordingVoice(false);
  };

  const handleAttachDocument = () => {
    onSend("[Attached: Mohan_XRay_Report_#MXR-9842.pdf] Doctor, please find attached my Mohan X-Ray scan report from Malviya Nagar.");
    setShowAttachMenu(false);
  };

  const handleAttachPrescription = () => {
    onSend("Doctor, could you please issue the digital prescription based on my symptoms?");
    setShowAttachMenu(false);
  };

  const handleAttachPhoto = () => {
    onSend("[Attached: Symptom_Throat_Photo.jpg] Sharing high-res picture of inflamed throat for evaluation.");
    setShowAttachMenu(false);
  };

  return (
    <div className="relative select-none">
      {/* ========================================================================= */}
      {/* WhatsApp Attachment Sheet / Popup Grid                                   */}
      {/* ========================================================================= */}
      {showAttachMenu && (
        <div className="absolute bottom-16 left-4 bg-white rounded-3xl p-4 shadow-2xl border border-slate-100 z-50 animate-in fade-in slide-in-from-bottom-3 duration-150">
          <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
            <span className="text-xs font-bold text-[#54656f] uppercase tracking-wider">
              Share Consultation File
            </span>
            <button
              onClick={() => setShowAttachMenu(false)}
              className="p-1 hover:bg-slate-100 rounded-full text-slate-400"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            {/* 1. Document (Mohan X-Ray Report) */}
            <button
              type="button"
              onClick={handleAttachDocument}
              className="flex flex-col items-center gap-1.5 group cursor-pointer"
            >
              <div className="h-12 w-12 rounded-full bg-[#7f66ff] group-hover:scale-105 group-active:scale-95 text-white flex items-center justify-center shadow-md transition-all">
                <FileText className="h-6 w-6" />
              </div>
              <span className="text-[11px] font-semibold text-[#111b21]">Mohan X-Ray</span>
            </button>

            {/* 2. Camera (Prescription / Symptom Photo) */}
            <button
              type="button"
              onClick={handleAttachPhoto}
              className="flex flex-col items-center gap-1.5 group cursor-pointer"
            >
              <div className="h-12 w-12 rounded-full bg-[#d3396d] group-hover:scale-105 group-active:scale-95 text-white flex items-center justify-center shadow-md transition-all">
                <Camera className="h-6 w-6" />
              </div>
              <span className="text-[11px] font-semibold text-[#111b21]">Photo</span>
            </button>

            {/* 3. Prescription Request */}
            <button
              type="button"
              onClick={handleAttachPrescription}
              className="flex flex-col items-center gap-1.5 group cursor-pointer"
            >
              <div className="h-12 w-12 rounded-full bg-[#00a884] group-hover:scale-105 group-active:scale-95 text-white flex items-center justify-center shadow-md transition-all">
                <Pill className="h-6 w-6" />
              </div>
              <span className="text-[11px] font-semibold text-[#111b21]">Rx Request</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* WhatsApp Input Bar: Voice Recording Mode OR Text Mode                     */}
      {/* ========================================================================= */}
      {isRecordingVoice ? (
        <div className="p-2 sm:p-2.5 flex items-center gap-2 bg-[#f0f2f5] border-t border-[#e9edef]">
          {/* Trash Cancel Button */}
          <button
            type="button"
            onClick={handleCancelVoice}
            className="p-2 text-rose-500 hover:bg-rose-50 rounded-full transition-colors"
            title="Cancel Recording"
          >
            <Trash2 className="h-5 w-5" />
          </button>

          {/* Recording Timer & Waveform */}
          <div className="flex-1 flex items-center gap-3 bg-white rounded-full px-4 py-2 shadow-sm border border-slate-200">
            <span className="h-3 w-3 rounded-full bg-rose-500 animate-ping" />
            <span className="text-sm font-bold text-rose-600 font-mono">
              0:{recordingSeconds < 10 ? `0${recordingSeconds}` : recordingSeconds}
            </span>
            <span className="text-xs text-slate-400 font-medium">Recording consultation audio...</span>
          </div>

          {/* Send Voice Note (Green Checkmark / Send Button) */}
          <button
            type="button"
            onClick={handleSendVoiceNote}
            className="h-11 w-11 sm:h-12 sm:w-12 rounded-full bg-[#00a884] hover:bg-[#008f6f] text-white flex items-center justify-center shadow-lg active:scale-90 transition-transform shrink-0 cursor-pointer"
            title="Send Voice Note"
          >
            <Send className="h-5 w-5 ml-0.5" />
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="p-2 sm:p-2.5 bg-transparent flex items-center gap-2"
        >
          {/* WhatsApp White Capsule Input Field */}
          <div className="flex-1 flex items-center gap-2 bg-white rounded-full px-3.5 py-1.5 sm:py-2 shadow-xs border border-[#e9edef] focus-within:border-[#00a884]/40 transition-all">
            {/* Smile Emoji */}
            <button
              type="button"
              className="text-[#8696a0] hover:text-[#111b21] p-0.5 rounded-full transition-colors shrink-0"
              title="Emojis"
            >
              <Smile className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>

            {/* Input Element */}
            <input
              type="text"
              placeholder="Message"
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={disabled}
              className="flex-1 bg-transparent text-[14px] sm:text-base text-[#111b21] placeholder-[#8696a0] focus:outline-none min-w-0"
            />

            {/* Paperclip (Toggles WhatsApp Attachment Sheet) */}
            <button
              type="button"
              onClick={() => setShowAttachMenu(!showAttachMenu)}
              className={`p-1 rounded-full transition-colors shrink-0 ${
                showAttachMenu
                  ? "bg-[#00a884] text-white"
                  : "text-[#8696a0] hover:text-[#00a884]"
              }`}
              title="Attach Document / Photo / Rx"
            >
              <Paperclip className="h-5 w-5 rotate-45" />
            </button>

            {/* Camera Icon */}
            <button
              type="button"
              onClick={handleAttachPhoto}
              className="text-[#8696a0] hover:text-[#00a884] p-0.5 rounded-full transition-colors shrink-0"
              title="Send Photo"
            >
              <Camera className="h-5 w-5" />
            </button>
          </div>

          {/* WhatsApp Floating Green Button: Send Airplane OR Voice Note Mic */}
          {text.trim() ? (
            <button
              type="submit"
              disabled={disabled}
              className="h-11 w-11 sm:h-12 sm:w-12 rounded-full bg-[#00a884] hover:bg-[#008f6f] text-white flex items-center justify-center shadow-md active:scale-90 transition-transform shrink-0 cursor-pointer"
              title="Send Message"
            >
              <Send className="h-5 w-5 ml-0.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsRecordingVoice(true)}
              className="h-11 w-11 sm:h-12 sm:w-12 rounded-full bg-[#00a884] hover:bg-[#008f6f] text-white flex items-center justify-center shadow-md active:scale-90 transition-transform shrink-0 cursor-pointer"
              title="Hold / Tap to Record Voice Note"
            >
              <Mic className="h-5 w-5" />
            </button>
          )}
        </form>
      )}
    </div>
  );
}
