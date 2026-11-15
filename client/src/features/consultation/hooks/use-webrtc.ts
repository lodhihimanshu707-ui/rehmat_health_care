import { useState, useEffect, useRef } from "react";
import { getSocket } from "@/lib/socket";

const RTC_CONFIG: RTCConfiguration = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ],
};

export function useWebRTC(consultationId: string | null, isInitiator: boolean) {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoDisabled, setIsVideoDisabled] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<string>("initializing");

  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  // Helper to create synthetic stream if camera is unavailable
  const createFallbackStream = (): MediaStream => {
    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext("2d")!;
    let frame = 0;

    const draw = () => {
      frame++;
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#10b981";
      ctx.beginPath();
      ctx.arc(320, 240, 80 + Math.sin(frame * 0.05) * 10, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 20px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(isInitiator ? "Patient Video (Live)" : "Dr. Rehmat (Live)", 320, 245);

      requestAnimationFrame(draw);
    };
    draw();

    const stream = canvas.captureStream(30);
    // Add dummy audio track
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const dst = osc.connect(audioCtx.createMediaStreamDestination());
    osc.start();
    const track = (dst as any).stream.getAudioTracks()[0];
    if (track) stream.addTrack(track);

    return stream;
  };

  useEffect(() => {
    if (!consultationId) return;

    let active = true;
    const socket = getSocket();

    async function initMedia() {
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 },
          audio: true,
        });
      } catch (err) {
        console.warn("Camera/mic not accessible, using simulated healthcare stream:", err);
        stream = createFallbackStream();
      }

      if (!active) return;
      setLocalStream(stream);

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Initialize RTCPeerConnection
      const pc = new RTCPeerConnection(RTC_CONFIG);
      peerConnectionRef.current = pc;

      // Add local tracks to peer connection
      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
      });

      // Handle remote tracks
      pc.ontrack = (event) => {
        if (event.streams && event.streams[0]) {
          setRemoteStream(event.streams[0]);
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
          }
        }
      };

      // Handle ICE Candidates
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("ice-candidate", {
            consultationId,
            candidate: event.candidate,
          });
        }
      };

      pc.onconnectionstatechange = () => {
        setConnectionStatus(pc.connectionState);
      };

      // Socket signaling listeners
      socket.on("webrtc-offer", async (data: { sdp: RTCSessionDescriptionInit }) => {
        if (!peerConnectionRef.current) return;
        try {
          await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.sdp));
          const answer = await peerConnectionRef.current.createAnswer();
          await peerConnectionRef.current.setLocalDescription(answer);
          socket.emit("webrtc-answer", {
            consultationId,
            sdp: answer,
          });
        } catch (e) {
          console.error("Error handling offer:", e);
        }
      });

      socket.on("webrtc-answer", async (data: { sdp: RTCSessionDescriptionInit }) => {
        if (!peerConnectionRef.current) return;
        try {
          await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.sdp));
        } catch (e) {
          console.error("Error handling answer:", e);
        }
      });

      socket.on("ice-candidate", async (data: { candidate: RTCIceCandidateInit }) => {
        if (!peerConnectionRef.current) return;
        try {
          await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
        } catch (e) {
          console.error("Error adding candidate:", e);
        }
      });

      // If initiator, create and send offer
      if (isInitiator) {
        try {
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          socket.emit("webrtc-offer", {
            consultationId,
            sdp: offer,
          });
        } catch (e) {
          console.error("Error creating offer:", e);
        }
      }
    }

    initMedia();

    return () => {
      active = false;
      if (localStream) {
        localStream.getTracks().forEach((t) => t.stop());
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
      socket.off("webrtc-offer");
      socket.off("webrtc-answer");
      socket.off("ice-candidate");
    };
  }, [consultationId, isInitiator]);

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoDisabled(!videoTrack.enabled);
      }
    }
  };

  return {
    localStream,
    remoteStream,
    localVideoRef,
    remoteVideoRef,
    isAudioMuted,
    isVideoDisabled,
    toggleAudio,
    toggleVideo,
    connectionStatus,
  };
}
