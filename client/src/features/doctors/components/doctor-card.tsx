import React from "react";
import { Doctor } from "../types/doctor.types";
import { useAuthStore } from "@/features/auth/store/use-auth-store";
import { useWalletStore } from "@/features/wallet/store/use-wallet-store";
import { useCallStore } from "@/features/consultation/store/use-call-store";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Video, MessageSquare, Star, Clock, CheckCircle2, ShieldAlert } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { getSocket } from "@/lib/socket";

interface DoctorCardProps {
  doctor: Doctor;
  onOpenChat: (doctorId: string, doctorName: string) => void;
  onCallInitiated: () => void;
}

export function DoctorCard({ doctor, onOpenChat, onCallInitiated }: DoctorCardProps) {
  const { currentUser } = useAuthStore();
  const { cachedBalance, openRechargeModal } = useWalletStore();
  const { startOutgoingCall } = useCallStore();
  const [isCalling, setIsCalling] = React.useState(false);

  const isPatient = currentUser.role === "patient";

  const handleStartCall = async () => {
    if (!isPatient) {
      alert("You are currently in Doctor Mode. Switch to Patient Mode in the header to place a consultation call.");
      return;
    }

    if (cachedBalance < doctor.ratePerMinute) {
      alert(
        `Insufficient Balance: Dr. ${doctor.user.name}'s rate is ${formatCurrency(doctor.ratePerMinute)}/min. Your balance is ${formatCurrency(cachedBalance)}. Please recharge to continue.`
      );
      openRechargeModal();
      return;
    }

    setIsCalling(true);
    try {
      // 1. Create consultation record on backend
      const result = await apiClient<{ consultation: any }>("/consultations/initiate", {
        method: "POST",
        body: JSON.stringify({
          doctorId: doctor.id,
          patientId: currentUser.id,
          type: "video",
        }),
      });

      const consultation = result.consultation;

      // 2. Update Zustand store
      startOutgoingCall({
        id: consultation.id,
        patientId: currentUser.id,
        patientName: currentUser.name,
        patientAvatar: currentUser.avatarUrl,
        doctorId: doctor.id,
        doctorName: doctor.user.name,
        doctorAvatar: doctor.user.avatarUrl,
        doctorSpecialization: doctor.specialization,
        ratePerMinute: doctor.ratePerMinute,
      });

      // 3. Emit socket event so doctor hears incoming call
      const socket = getSocket();
      socket.emit("call-user", {
        consultationId: consultation.id,
        patientId: currentUser.id,
        patientName: currentUser.name,
        patientAvatar: currentUser.avatarUrl,
        doctorId: doctor.id,
        doctorUserId: doctor.userId,
        ratePerMinute: doctor.ratePerMinute,
      });

      socket.emit("join-consultation", consultation.id);

      onCallInitiated();
    } catch (err: any) {
      alert(err.message || "Failed to initiate consultation");
    } finally {
      setIsCalling(false);
    }
  };

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md hover:border-emerald-200 bg-white">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div className="relative">
            <Avatar className="h-16 w-16 border-2 border-emerald-100 shadow-sm">
              <AvatarImage src={doctor.user.avatarUrl} alt={doctor.user.name} />
              <AvatarFallback className="bg-emerald-100 text-emerald-800 font-bold">
                {doctor.user.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span
              className={`absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-white ${
                doctor.isOnline ? "bg-emerald-500" : "bg-slate-400"
              }`}
              title={doctor.isOnline ? "Online & Ready" : "Offline"}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-bold text-slate-900 text-base truncate flex items-center gap-1.5">
                {doctor.user.name}
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" title="Verified Rehmat Doctor" />
              </h3>
              <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-900 gap-1 shrink-0">
                <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                <span>{doctor.rating}</span>
              </Badge>
            </div>

            <p className="text-xs font-semibold text-emerald-700">{doctor.specialization}</p>
            <p className="text-xs text-slate-500">{doctor.qualifications}</p>

            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-600">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                {doctor.experienceYears}+ years exp
              </span>
              <span className="text-slate-300">•</span>
              <span className="font-medium text-slate-700">{doctor.clinicName}</span>
            </div>
          </div>
        </div>

        {doctor.about && (
          <p className="mt-3 text-xs text-slate-600 line-clamp-2 bg-slate-50/80 p-2.5 rounded-lg border border-slate-100">
            {doctor.about}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Consultation Fee</span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-extrabold text-emerald-700">
                {formatCurrency(doctor.ratePerMinute)}
              </span>
              <span className="text-xs text-slate-500">/ min</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenChat(doctor.userId, doctor.user.name)}
              className="gap-1.5 text-xs text-slate-700 hover:text-emerald-700 hover:bg-emerald-50"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              <span>Chat</span>
            </Button>

            <Button
              variant="default"
              size="sm"
              disabled={!doctor.isOnline || isCalling}
              onClick={handleStartCall}
              className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm text-xs"
            >
              <Video className="h-3.5 w-3.5" />
              <span>{isCalling ? "Connecting..." : "Video Call"}</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
