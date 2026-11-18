"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { getSocket } from "@/lib/socket";
import { CallStatus } from "@/stores/call.store";

const RTC_CONFIG: RTCConfiguration = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
  ],
};

export function useWebRTC(
  consultationId: string | null,
  isInitiator: boolean,
  callStatus: CallStatus,
  participantLabel: string = "User"
) {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoDisabled, setIsVideoDisabled] = useState(false);
  const [isRemoteAudioMuted, setIsRemoteAudioMuted] = useState(false);
  const [isRemoteVideoDisabled, setIsRemoteVideoDisabled] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<string>("idle");
  const [hasMicrophonePermission, setHasMicrophonePermission] = useState<boolean>(true);

  const localStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
  const remoteMediaStreamRef = useRef<MediaStream | null>(null);
  const pendingCandidatesRef = useRef<RTCIceCandidateInit[]>([]);
  const isNegotiatingRef = useRef(false);

  const isConnected = callStatus === "connected";
  const isCallActive =
    callStatus === "ringing_outgoing" ||
    callStatus === "incoming" ||
    callStatus === "connected";

  // Comprehensive camera & audio hardware release
  const stopMediaTracks = useCallback(() => {
    // 1. Stop localStreamRef tracks
    if (localStreamRef.current) {
      try {
        localStreamRef.current.getTracks().forEach((track) => {
          track.stop();
          track.enabled = false;
        });
      } catch (e) {
        console.warn("Error stopping track in localStreamRef:", e);
      }
      localStreamRef.current = null;
    }

    // 2. Stop localStream state tracks
    if (localStream) {
      try {
        localStream.getTracks().forEach((track) => {
          track.stop();
          track.enabled = false;
        });
      } catch (e) {
        console.warn("Error stopping local track:", e);
      }
      setLocalStream(null);
    }

    // 3. Stop tracks attached to localVideoRef srcObject
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      try {
        const stream = localVideoRef.current.srcObject as MediaStream;
        if (stream && typeof stream.getTracks === "function") {
          stream.getTracks().forEach((track) => {
            track.stop();
            track.enabled = false;
          });
        }
      } catch (e) { }
      localVideoRef.current.srcObject = null;
    }

    // 4. Stop remoteStream tracks
    if (remoteStream) {
      try {
        remoteStream.getTracks().forEach((track) => {
          track.stop();
          track.enabled = false;
        });
      } catch (e) { }
      setRemoteStream(null);
    }

    // 5. Stop remoteMediaStreamRef
    if (remoteMediaStreamRef.current) {
      try {
        remoteMediaStreamRef.current.getTracks().forEach((t) => {
          t.stop();
          t.enabled = false;
        });
      } catch (e) { }
      remoteMediaStreamRef.current = null;
    }

    // 6. Stop tracks attached to remote video & audio refs
    if (remoteVideoRef.current && remoteVideoRef.current.srcObject) {
      try {
        const stream = remoteVideoRef.current.srcObject as MediaStream;
        if (stream && typeof stream.getTracks === "function") {
          stream.getTracks().forEach((t) => {
            t.stop();
            t.enabled = false;
          });
        }
      } catch (e) { }
      remoteVideoRef.current.srcObject = null;
    }
    if (remoteAudioRef.current && remoteAudioRef.current.srcObject) {
      try {
        const stream = remoteAudioRef.current.srcObject as MediaStream;
        if (stream && typeof stream.getTracks === "function") {
          stream.getTracks().forEach((t) => {
            t.stop();
            t.enabled = false;
          });
        }
      } catch (e) { }
      remoteAudioRef.current.srcObject = null;
    }

    // 7. Stop all senders on RTCPeerConnection and close connection
    if (peerConnectionRef.current) {
      try {
        peerConnectionRef.current.getSenders().forEach((sender) => {
          if (sender.track) {
            sender.track.stop();
            sender.track.enabled = false;
          }
        });
        peerConnectionRef.current.close();
      } catch (e) {
        console.warn("Error closing RTCPeerConnection:", e);
      }
      peerConnectionRef.current = null;
    }

    console.log("🛑 Camera & audio hardware completely released. LED light off.");
  }, [localStream, remoteStream]);

  // High-fidelity fallback simulated video/audio stream if hardware camera is not available
  const createFallbackStream = useCallback((): MediaStream => {
    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext("2d")!;
    let frame = 0;

    const draw = () => {
      frame++;
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      grad.addColorStop(0, isInitiator ? "#064e3b" : "#0f172a");
      grad.addColorStop(1, isInitiator ? "#022c22" : "#1e293b");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const pulse = Math.sin(frame * 0.06);
      ctx.strokeStyle = "rgba(16, 185, 129, 0.4)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(320, 210, 85 + pulse * 12, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = isInitiator ? "#10b981" : "#059669";
      ctx.beginPath();
      ctx.arc(320, 210, 75, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 38px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(isInitiator ? "PT" : "RA", 320, 210);

      ctx.font = "bold 20px sans-serif";
      ctx.fillText(participantLabel, 320, 325);

      ctx.font = "14px sans-serif";
      ctx.fillStyle = "#a7f3d0";
      ctx.fillText("HD Tele-OPD Video (Live)", 320, 355);

      requestAnimationFrame(draw);
    };
    draw();

    const stream = canvas.captureStream(30);

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        const audioCtx = new AudioContextClass();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        gain.gain.value = 0.0001;
        osc.connect(gain);
        const dst = gain.connect(audioCtx.createMediaStreamDestination());
        osc.start();
        const track = (dst as any).stream.getAudioTracks()[0];
        if (track) stream.addTrack(track);
      }
    } catch (e) {
      console.warn("AudioContext fallback error:", e);
    }

    return stream;
  }, [isInitiator, participantLabel]);

  // 1. Acquire Local Camera & Microphone Media
  useEffect(() => {
    if (!consultationId || !isCallActive) {
      return;
    }

    let mounted = true;

    async function getMedia() {
      let stream: MediaStream | null = null;

      // Step A: Attempt full video + high quality audio
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              width: { ideal: 640 },
              height: { ideal: 480 },
              facingMode: "user",
            },
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true,
            },
          });
          console.log("✅ Successfully acquired hardware camera & microphone.");
          setHasMicrophonePermission(true);
        } else {
          throw new Error("getUserMedia not supported in this browser context (likely insecure HTTP on mobile)");
        }
      } catch (err) {
        console.warn("Full video+audio getUserMedia failed, attempting audio-only:", err);

        // Step B: Attempt audio-only if camera is busy or restricted
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          try {
            const audioStream = await navigator.mediaDevices.getUserMedia({
              audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true,
              },
            });
            console.log("✅ Successfully acquired hardware microphone (audio-only).");
            setHasMicrophonePermission(true);

            const fallbackCanvas = createFallbackStream();
            const realAudioTrack = audioStream.getAudioTracks()[0];
            if (realAudioTrack) {
              fallbackCanvas.getAudioTracks().forEach((t) => fallbackCanvas.removeTrack(t));
              fallbackCanvas.addTrack(realAudioTrack);
            }
            stream = fallbackCanvas;
          } catch (audioErr) {
            console.warn("Audio-only getUserMedia also failed:", audioErr);
            setHasMicrophonePermission(false);
          }
        } else {
          setHasMicrophonePermission(false);
        }

        // Step C: If both hardware accesses failed, use fallback simulation
        if (!stream) {
          stream = createFallbackStream();
        }
      }

      if (!mounted) {
        stream.getTracks().forEach((t) => {
          t.stop();
          t.enabled = false;
        });
        return;
      }

      // Ensure audio track is enabled
      stream.getAudioTracks().forEach((t) => {
        t.enabled = true;
      });

      localStreamRef.current = stream;
      setLocalStream(stream);
    }

    getMedia();

    return () => {
      mounted = false;
      if (localStreamRef.current && (!isCallActive || !consultationId)) {
        localStreamRef.current.getTracks().forEach((t) => {
          t.stop();
          t.enabled = false;
        });
        localStreamRef.current = null;
      }
    };
  }, [consultationId, isCallActive, createFallbackStream]);

  // 2. Shut down hardware camera & mic immediately when call ends or goes idle
  useEffect(() => {
    if (!isCallActive || !consultationId) {
      stopMediaTracks();
    }
  }, [isCallActive, consultationId, stopMediaTracks]);

  // 3. Attach localStream to local video element
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      if (localVideoRef.current.srcObject !== localStream) {
        localVideoRef.current.srcObject = localStream;
      }
      localVideoRef.current.play().catch(() => { });
    }
  }, [localStream, isConnected]);

  // 4. Attach remoteStream to remote video and dedicated audio elements
  useEffect(() => {
    if (remoteStream) {
      if (remoteVideoRef.current && remoteVideoRef.current.srcObject !== remoteStream) {
        remoteVideoRef.current.srcObject = remoteStream;
        remoteVideoRef.current.play().catch((e) => console.warn("remoteVideoRef.play:", e));
      }
      if (remoteAudioRef.current && remoteAudioRef.current.srcObject !== remoteStream) {
        remoteAudioRef.current.srcObject = remoteStream;
        remoteAudioRef.current.play().catch((e) => console.warn("remoteAudioRef.play:", e));
      }
    }
  }, [remoteStream, isConnected]);

  // 5. WebRTC Peer Connection & Signaling
  useEffect(() => {
    if (!consultationId || !isConnected || !localStream) return;

    const socket = getSocket();
    let pc: RTCPeerConnection;

    try {
      pc = new RTCPeerConnection(RTC_CONFIG);
      peerConnectionRef.current = pc;
    } catch (e) {
      console.error("Failed to construct RTCPeerConnection:", e);
      return;
    }

    // Add local tracks (both audio and video)
    localStream.getTracks().forEach((track) => {
      console.log(`[WebRTC] Adding local track (${track.kind}) to connection.`);
      pc.addTrack(track, localStream);
    });

    // Reset remoteMediaStream accumulator
    const currentRemoteStream = new MediaStream();
    remoteMediaStreamRef.current = currentRemoteStream;

    pc.ontrack = (event) => {
      console.log(`[WebRTC] 🔊 Received remote track: ${event.track.kind}`);
      currentRemoteStream.addTrack(event.track);

      if (event.streams && event.streams[0]) {
        event.streams[0].getTracks().forEach((t) => {
          if (!currentRemoteStream.getTracks().find((existing) => existing.id === t.id)) {
            currentRemoteStream.addTrack(t);
          }
        });
      }

      setRemoteStream(currentRemoteStream);

      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = currentRemoteStream;
        remoteVideoRef.current.play().catch(() => { });
      }
      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = currentRemoteStream;
        remoteAudioRef.current.volume = 1.0;
        remoteAudioRef.current.play().catch((err) => console.warn("remoteAudio play:", err));
      }
    };

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
      console.log("[WebRTC] Connection state:", pc.connectionState);
    };

    const processPendingCandidates = async () => {
      if (pc.remoteDescription && pendingCandidatesRef.current.length > 0) {
        for (const candidate of pendingCandidatesRef.current) {
          try {
            await pc.addIceCandidate(new RTCIceCandidate(candidate));
          } catch (e) {
            console.warn("Error adding queued ICE candidate:", e);
          }
        }
        pendingCandidatesRef.current = [];
      }
    };

    const handleOffer = async (data: { sdp: RTCSessionDescriptionInit }) => {
      if (!pc) return;
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
        await processPendingCandidates();

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        socket.emit("webrtc-answer", {
          consultationId,
          sdp: answer,
        });
      } catch (err) {
        console.error("Error handling WebRTC offer:", err);
      }
    };

    const handleAnswer = async (data: { sdp: RTCSessionDescriptionInit }) => {
      if (!pc) return;
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
        await processPendingCandidates();
      } catch (err) {
        console.error("Error handling WebRTC answer:", err);
      }
    };

    const handleCandidate = async (data: { candidate: RTCIceCandidateInit }) => {
      if (!pc) return;
      if (pc.remoteDescription && pc.remoteDescription.type) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
        } catch (err) {
          console.warn("Error adding ICE candidate:", err);
        }
      } else {
        pendingCandidatesRef.current.push(data.candidate);
      }
    };

    const initiateOffer = async () => {
      if (!pc || isNegotiatingRef.current) return;
      isNegotiatingRef.current = true;
      try {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit("webrtc-offer", {
          consultationId,
          sdp: offer,
        });
      } catch (err) {
        console.error("Error creating WebRTC offer:", err);
      } finally {
        isNegotiatingRef.current = false;
      }
    };

    const handlePeerMediaState = (data: {
      isAudioMuted: boolean;
      isVideoDisabled: boolean;
    }) => {
      console.log("[WebRTC] Peer media state updated:", data);
      setIsRemoteAudioMuted(data.isAudioMuted);
      setIsRemoteVideoDisabled(data.isVideoDisabled);

      if (remoteAudioRef.current) {
        remoteAudioRef.current.muted = data.isAudioMuted;
      }
      if (remoteVideoRef.current) {
        remoteVideoRef.current.muted = data.isAudioMuted;
      }
    };

    socket.on("webrtc-offer", handleOffer);
    socket.on("webrtc-answer", handleAnswer);
    socket.on("ice-candidate", handleCandidate);
    socket.on("peer-media-state", handlePeerMediaState);

    if (isInitiator) {
      initiateOffer();
    }

    socket.on("peer-ready", () => {
      if (isInitiator) {
        initiateOffer();
      }
    });

    return () => {
      socket.off("webrtc-offer", handleOffer);
      socket.off("webrtc-answer", handleAnswer);
      socket.off("ice-candidate", handleCandidate);
      socket.off("peer-media-state", handlePeerMediaState);
      socket.off("peer-ready");

      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }
    };
  }, [consultationId, isConnected, localStream, isInitiator]);

  // Tab unload cleanup
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (localStream) {
        localStream.getTracks().forEach((t) => t.stop());
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [localStream]);

  const toggleAudio = useCallback(() => {
    setIsAudioMuted((prev) => {
      const nextMuted = !prev;
      if (localStreamRef.current) {
        localStreamRef.current.getAudioTracks().forEach((track) => {
          track.enabled = !nextMuted;
        });
      }
      if (localStream) {
        localStream.getAudioTracks().forEach((track) => {
          track.enabled = !nextMuted;
        });
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.getSenders().forEach((sender) => {
          if (sender.track && sender.track.kind === "audio") {
            sender.track.enabled = !nextMuted;
          }
        });
      }

      if (consultationId) {
        getSocket().emit("media-state-changed", {
          consultationId,
          isAudioMuted: nextMuted,
          isVideoDisabled,
        });
      }

      return nextMuted;
    });
  }, [localStream, consultationId, isVideoDisabled]);

  const toggleVideo = useCallback(() => {
    setIsVideoDisabled((prev) => {
      const nextDisabled = !prev;
      if (localStreamRef.current) {
        localStreamRef.current.getVideoTracks().forEach((track) => {
          track.enabled = !nextDisabled;
        });
      }
      if (localStream) {
        localStream.getVideoTracks().forEach((track) => {
          track.enabled = !nextDisabled;
        });
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.getSenders().forEach((sender) => {
          if (sender.track && sender.track.kind === "video") {
            sender.track.enabled = !nextDisabled;
          }
        });
      }

      if (consultationId) {
        getSocket().emit("media-state-changed", {
          consultationId,
          isAudioMuted,
          isVideoDisabled: nextDisabled,
        });
      }

      return nextDisabled;
    });
  }, [localStream, consultationId, isAudioMuted]);

  return {
    localStream,
    remoteStream,
    localVideoRef,
    remoteVideoRef,
    remoteAudioRef,
    isAudioMuted,
    isVideoDisabled,
    isRemoteAudioMuted,
    isRemoteVideoDisabled,
    toggleAudio,
    toggleVideo,
    stopMediaTracks,
    connectionStatus,
    hasMicrophonePermission,
  };
}
