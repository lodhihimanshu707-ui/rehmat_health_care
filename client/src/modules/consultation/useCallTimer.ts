import { useEffect, useRef } from "react";
import { useCallStore } from "@/stores/call.store";
import { apiClient } from "@/api/client";
import { getSocket } from "@/lib/socket";

export function useCallTimer(consultationId: string | null, ratePerMinute: number) {
  const {
    callStatus,
    durationSeconds,
    updateTick,
    endCall,
    activeConsultation,
  } = useCallStore();

  const secondsRef = useRef(durationSeconds);
  secondsRef.current = durationSeconds;

  useEffect(() => {
    if (callStatus !== "connected" || !consultationId) return;

    let localSeconds = 0;

    const interval = setInterval(async () => {
      localSeconds += 1;

      const billedMinutes = Math.max(1, Math.ceil(localSeconds / 60));
      const liveCost = billedMinutes * ratePerMinute;

      if (localSeconds % 5 === 0 || localSeconds === 1) {
        try {
          const tickRes = await apiClient.post<any>(`/consultations/${consultationId}/tick`, {
            durationSeconds: localSeconds,
          });

          updateTick({
            durationSeconds: localSeconds,
            liveCost: tickRes.liveCost,
            remainingSeconds: tickRes.remainingSeconds,
            isLowBalance: tickRes.isLowBalance,
          });

          if (tickRes.isExhausted) {
            console.warn("Wallet balance exhausted! Initiating auto-cutoff.");
            const socket = getSocket();
            socket.emit("end-call", {
              consultationId,
              durationSeconds: localSeconds,
              reason: "ended_zero_balance",
            });

            endCall({
              consultationId,
              doctorName: activeConsultation?.doctorName || "Doctor",
              durationSeconds: localSeconds,
              billedMinutes: tickRes.billedMinutes,
              totalCost: tickRes.liveCost,
              ratePerMinute,
              endedReason: "ended_zero_balance",
            });
            return;
          }
        } catch (err) {
          console.error("Tick error:", err);
        }
      } else {
        updateTick({
          durationSeconds: localSeconds,
          liveCost,
          remainingSeconds: Math.max(0, 600 - localSeconds),
          isLowBalance: false,
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [callStatus, consultationId, ratePerMinute]);
}

