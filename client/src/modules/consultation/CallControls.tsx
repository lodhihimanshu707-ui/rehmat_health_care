import React from "react";
import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";

interface CallControlsProps {
  isAudioMuted: boolean;
  isVideoDisabled: boolean;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
  onEndCall: () => void;
}

export function CallControls({
  isAudioMuted,
  isVideoDisabled,
  onToggleAudio,
  onToggleVideo,
  onEndCall,
}: CallControlsProps) {
  return (
    <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 sm:gap-3.5 rounded-full bg-slate-900/95 px-3 py-2 sm:px-4 sm:py-2.5 shadow-2xl backdrop-blur-xl border border-white/20 max-w-[95vw]">
      {/* Mic Toggle */}
      <button
        type="button"
        onClick={onToggleAudio}
        className={`h-11 w-11 sm:h-12 sm:w-12 rounded-full transition-all shrink-0 flex items-center justify-center outline-none ring-0 focus:outline-none focus:ring-0 active:scale-90 select-none cursor-pointer ${
          isAudioMuted
            ? "bg-rose-600 text-white shadow-lg shadow-rose-600/40 hover:bg-rose-700"
            : "bg-white/15 text-white border border-white/20 hover:bg-white/25"
        }`}
        title={isAudioMuted ? "Unmute Mic" : "Mute Mic"}
      >
        {isAudioMuted ? (
          <MicOff className="h-5 w-5 text-white" />
        ) : (
          <Mic className="h-5 w-5 text-white" />
        )}
      </button>

      {/* Video Toggle */}
      <button
        type="button"
        onClick={onToggleVideo}
        className={`h-11 w-11 sm:h-12 sm:w-12 rounded-full transition-all shrink-0 flex items-center justify-center outline-none ring-0 focus:outline-none focus:ring-0 active:scale-90 select-none cursor-pointer ${
          isVideoDisabled
            ? "bg-rose-600 text-white shadow-lg shadow-rose-600/40 hover:bg-rose-700"
            : "bg-white/15 text-white border border-white/20 hover:bg-white/25"
        }`}
        title={isVideoDisabled ? "Turn Video On" : "Turn Video Off"}
      >
        {isVideoDisabled ? (
          <VideoOff className="h-5 w-5 text-white" />
        ) : (
          <Video className="h-5 w-5 text-white" />
        )}
      </button>

      {/* End Call Button */}
      <button
        type="button"
        onClick={onEndCall}
        className="h-11 sm:h-12 px-5 sm:px-7 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold gap-2 shadow-xl shadow-rose-600/50 text-xs sm:text-sm shrink-0 flex items-center justify-center transition-all active:scale-95 outline-none focus:outline-none focus:ring-0 cursor-pointer"
        title="End Consultation"
      >
        <PhoneOff className="h-4 w-4 sm:h-5 sm:w-5" />
        <span>End Call</span>
      </button>
    </div>
  );
}
