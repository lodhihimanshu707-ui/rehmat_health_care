import React from "react";
import { Mic, MicOff, Video, VideoOff, PhoneOff, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 rounded-full bg-slate-900/80 p-2 shadow-2xl backdrop-blur-md border border-white/10">
      {/* Mic Toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleAudio}
        className={`h-12 w-12 rounded-full transition-all ${
          isAudioMuted
            ? "bg-rose-500/20 text-rose-400 hover:bg-rose-500/30"
            : "bg-white/10 text-white hover:bg-white/20"
        }`}
        title={isAudioMuted ? "Unmute Mic" : "Mute Mic"}
      >
        {isAudioMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
      </Button>

      {/* Camera Toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleVideo}
        className={`h-12 w-12 rounded-full transition-all ${
          isVideoDisabled
            ? "bg-rose-500/20 text-rose-400 hover:bg-rose-500/30"
            : "bg-white/10 text-white hover:bg-white/20"
        }`}
        title={isVideoDisabled ? "Turn Video On" : "Turn Video Off"}
      >
        {isVideoDisabled ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
      </Button>

      {/* End Call Button */}
      <Button
        onClick={onEndCall}
        className="h-12 px-6 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold gap-2 shadow-lg shadow-rose-600/40 text-sm"
        title="End Consultation"
      >
        <PhoneOff className="h-5 w-5" />
        <span>End Call</span>
      </Button>
    </div>
  );
}

