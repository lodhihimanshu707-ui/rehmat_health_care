"use client";

import React, { useState } from "react";
import { HeroSection } from "./HeroSection";
import { AboutSection } from "./AboutSection";
import { ServicesSection } from "./ServicesSection";
import { DoctorsSection } from "./DoctorsSection";
import { TeleconsultExplainerSection } from "./TeleconsultExplainerSection";
import { ClinicTimingsSection } from "./ClinicTimingsSection";
import { TestimonialsSection } from "./TestimonialsSection";
import { FaqSection } from "./FaqSection";
import { AppointmentModal } from "./AppointmentModal";
import { useDoctors } from "@/modules/doctors/useDoctors";
import { Doctor } from "@/modules/doctors/types";
import { useAuthStore } from "@/stores/auth.store";
import { useWalletStore } from "@/stores/wallet.store";
import { useCallStore } from "@/stores/call.store";
import { apiClient } from "@/api/client";
import { formatCurrency } from "@/shared/utils/format";

interface WebsiteViewProps {
  onNavigateTab: (tab: string) => void;
  onOpenChat: (doctorId: string, doctorName: string) => void;
}

export function WebsiteView({ onNavigateTab, onOpenChat }: WebsiteViewProps) {
  const { data: doctors = [], isLoading } = useDoctors();
  const { currentUser } = useAuthStore();
  const { cachedBalance, openRechargeModal } = useWalletStore();
  const { startOutgoingCall } = useCallStore();

  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [selectedDoctorForModal, setSelectedDoctorForModal] = useState("Dr. Rehmat Ali");

  const isPatient = currentUser.role === "patient";

  const handleCallDoctor = async (doc: Doctor) => {
    if (!isPatient) {
      alert("You are currently in Doctor Mode. Switch to Patient Mode in the header to place a consultation call.");
      return;
    }

    if (cachedBalance < doc.ratePerMinute) {
      alert(
        `Insufficient Balance: Dr. ${doc.user.name}'s rate is ${formatCurrency(doc.ratePerMinute)}/min. Your balance is ${formatCurrency(cachedBalance)}. Please recharge to proceed.`
      );
      openRechargeModal();
      return;
    }

    try {
      const result = await apiClient.post<{ consultation: any }>("/consultations/initiate", {
        doctorId: doc.id,
        patientId: currentUser.id,
        type: "video",
      });

      const consultation = result.consultation;

      startOutgoingCall({
        id: consultation.id,
        patientId: currentUser.id,
        patientName: currentUser.name,
        patientAvatar: currentUser.avatarUrl,
        doctorId: doc.id,
        doctorName: doc.user.name,
        doctorAvatar: doc.user.avatarUrl,
        ratePerMinute: doc.ratePerMinute,
      });
    } catch (err: any) {
      console.error("Failed to initiate call:", err);
      alert(err.message || "Failed to start call. Ensure backend is running.");
    }
  };

  const handleChatDoctor = (doc: Doctor) => {
    onOpenChat(doc.id, doc.user.name);
  };

  const handleBookClinicVisit = (doc?: Doctor) => {
    if (doc) {
      setSelectedDoctorForModal(doc.user.name);
    }
    setIsAppointmentModalOpen(true);
  };

  return (
    <div className="w-full space-y-0">
      {/* 1. Hero Section */}
      <HeroSection
        onStartTeleconsult={() => onNavigateTab("teleconsult")}
        onBookAppointment={() => handleBookClinicVisit()}
      />

      {/* 2. Clinic Heritage & Mission */}
      <AboutSection />

      {/* 3. Clinical Specialities */}
      <ServicesSection
        onSelectService={(serviceName) => {
          setSelectedDoctorForModal(serviceName.includes("Gynecology") ? "Dr. Sana Khan" : "Dr. Rehmat Ali");
          setIsAppointmentModalOpen(true);
        }}
      />

      {/* 4. Doctors Roster */}
      <DoctorsSection
        doctors={doctors}
        isLoading={isLoading}
        onCallDoctor={handleCallDoctor}
        onChatDoctor={handleChatDoctor}
        onBookClinicVisit={handleBookClinicVisit}
      />

      {/* 5. Smart Per-Minute Health Wallet Explainer */}
      <TeleconsultExplainerSection
        onOpenRecharge={openRechargeModal}
        onBrowseDoctors={() => {
          const el = document.getElementById("doctors");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
      />

      {/* 6. Clinic Timings, Directions & Mohan X-Ray Landmark */}
      <ClinicTimingsSection onBookAppointment={() => handleBookClinicVisit()} />

      {/* 7. Patient Testimonials (Moradabad) */}
      <TestimonialsSection />

      {/* 8. FAQs */}
      <FaqSection />

      {/* Interactive Appointment Modal */}
      <AppointmentModal
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
        initialDoctorName={selectedDoctorForModal}
        onSuccessTeleconsult={() => onNavigateTab("teleconsult")}
      />
    </div>
  );
}
