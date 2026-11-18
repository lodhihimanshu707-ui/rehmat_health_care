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
    <div className="relative select-none bg-white border-t border-slate-200">
      {/* ========================================================================= */}
      {/* Consultation Medical Attachment Menu                                     */}
      {/* ========================================================================= */}
      {showAttachMenu && (
        <div className="absolute bottom-16 left-4 bg-white rounded-2xl p-4 shadow-xl border border-slate-200 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150 max-w-xs">
          <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Share Medical File
            </span>
            <button
              onClick={() => setShowAttachMenu(false)}
              className="p-1 hover:bg-slate-100 rounded-lg text-slate-400"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            {/* 1. Document (Mohan X-Ray Report) */}
            <button
              type="button"
              onClick={handleAttachDocument}
              className="flex flex-col items-center gap-1.5 group cursor-pointer"
            >
              <div className="h-11 w-11 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200 group-hover:scale-105 group-active:scale-95 flex items-center justify-center shadow-xs transition-all">
                <FileText className="h-5 w-5" />
              </div>
              <span className="text-[11px] font-semibold text-slate-700 leading-tight">Mohan X-Ray</span>
            </button>

            {/* 2. Camera (Prescription / Symptom Photo) */}
            <button
              type="button"
              onClick={handleAttachPhoto}
              className="flex flex-col items-center gap-1.5 group cursor-pointer"
            >
              <div className="h-11 w-11 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 group-hover:scale-105 group-active:scale-95 flex items-center justify-center shadow-xs transition-all">
                <Camera className="h-5 w-5" />
              </div>
              <span className="text-[11px] font-semibold text-slate-700 leading-tight">Symptom Pic</span>
            </button>

            {/* 3. Prescription Request */}
            <button
              type="button"
              onClick={handleAttachPrescription}
              className="flex flex-col items-center gap-1.5 group cursor-pointer"
            >
              <div className="h-11 w-11 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 group-hover:scale-105 group-active:scale-95 flex items-center justify-center shadow-xs transition-all">
                <Pill className="h-5 w-5" />
              </div>
              <span className="text-[11px] font-semibold text-slate-700 leading-tight">Request Rx</span>
            </button>
          </div>
        </div>
      )}

      {/* Voice Recording Mode */}
      {isRecordingVoice ? (
        <div className="p-2.5 sm:p-3 flex items-center gap-2.5 bg-rose-50/50">
          <button
            type="button"
            onClick={handleCancelVoice}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-100 rounded-xl transition-colors cursor-pointer"
            title="Cancel Audio Note"
          >
            <Trash2 className="h-5 w-5" />
          </button>

          {/* Recording Timer & Waveform */}
          <div className="flex-1 flex items-center gap-3 bg-white rounded-xl px-4 py-2 shadow-xs border border-rose-200">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500 animate-ping" />
            <span className="text-sm font-bold text-rose-600 font-mono">
              0:{recordingSeconds < 10 ? `0${recordingSeconds}` : recordingSeconds}
            </span>
            <span className="text-xs text-slate-500 font-medium">Recording consultation audio...</span>
          </div>

          {/* Send Voice Note */}
          <button
            type="button"
            onClick={handleSendVoiceNote}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs active:scale-95 transition-all shrink-0 cursor-pointer"
            title="Send Voice Note"
          >
            <Send className="h-4 w-4" />
            <span>Send Audio</span>
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="p-2.5 sm:p-3 flex items-center gap-2"
        >
          {/* Main Input Capsule */}
          <div className="flex-1 flex items-center gap-1.5 bg-slate-100 hover:bg-slate-100/80 focus-within:bg-white rounded-xl px-3 py-1.5 border border-slate-200 focus-within:border-emerald-500/50 transition-all">
            {/* Attachment Button */}
            <button
              type="button"
              onClick={() => setShowAttachMenu(!showAttachMenu)}
              className={`p-1.5 rounded-lg transition-colors shrink-0 ${
                showAttachMenu
                  ? "bg-emerald-600 text-white"
                  : "text-slate-500 hover:text-emerald-700 hover:bg-slate-200/60"
              }`}
              title="Attach Mohan X-Ray / Photo / Rx"
            >
              <Paperclip className="h-4 w-4" />
            </button>

            {/* Input Element */}
            <input
              type="text"
              placeholder="Type symptom update, report query, or message..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={disabled}
              className="flex-1 bg-transparent text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none min-w-0 py-1"
            />

            {/* Voice Mic Button */}
            <button
              type="button"
              onClick={() => setIsRecordingVoice(true)}
              className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-slate-200/60 rounded-lg transition-colors shrink-0"
              title="Record Voice Note"
            >
              <Mic className="h-4 w-4" />
            </button>
          </div>

          {/* Send Button */}
          <button
            type="submit"
            disabled={disabled || !text.trim()}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs active:scale-95 transition-all shrink-0 cursor-pointer"
            title="Send Message"
          >
            <Send className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      )}
    </div>
  );
}
