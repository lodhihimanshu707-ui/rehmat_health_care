"use client";

import React, { useState, useEffect } from "react";
import {
  Star,
  Quote,
  CheckCircle2,
  ThumbsUp,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Play,
  Pause,
  Layers,
  LayoutGrid,
  Sparkles,
  MapPin,
  Calendar,
  Stethoscope,
  Video,
  FileCheck2,
  MoveHorizontal,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PatientReview {
  id: string;
  name: string;
  initials: string;
  locality: string;
  doctor: string;
  rating: number;
  date: string;
  consultationType: "Video OPD (₹15/min)" | "Walk-in OPD" | "Diagnostic Review";
  costBilled?: string;
  duration?: string;
  tags: string[];
  headline: string;
  text: string;
  clinicalOutcome: string;
}

const reviewsData: PatientReview[] = [
  {
    id: "rev-1",
    name: "Aarav Sharma",
    initials: "AS",
    locality: "Civil Lines, Moradabad",
    doctor: "Dr. Raees Akhtar",
    rating: 5,
    date: "2 weeks ago",
    consultationType: "Video OPD (₹15/min)",
    costBilled: "₹75 (5 mins)",
    duration: "5 mins",
    tags: ["Late Night Video OPD", "Viral Fever", "Immediate Rx"],
    headline: "Reviewed fever late at night within 2 minutes",
    text: "Dr. Raees Akhtar is our family physician in Moradabad. When my elderly father developed a 102°F fever late in the evening, we started a video call from the app. Within 2 minutes Dr. Raees was reviewing his symptoms and prescribed medication. Extremely polite and caring doctor!",
    clinicalOutcome: "Fever stabilized within 24 hours. Digital prescription accepted at Civil Lines pharmacy.",
  },
  {
    id: "rev-2",
    name: "Pooja Verma",
    initials: "PV",
    locality: "Malviya Nagar, Moradabad",
    doctor: "Dr. Raees Akhtar",
    rating: 5,
    date: "3 weeks ago",
    consultationType: "Walk-in OPD",
    costBilled: "Walk-in OPD Slot",
    duration: "15 mins",
    tags: ["Walk-in OPD", "Detailed Explanation", "Family Care"],
    headline: "Most ethical and patient listener in Malviya Nagar",
    text: "Dr. Raees Akhtar is one of the most patient and ethical doctors in Malviya Nagar. He explains the diagnosis in clear, simple language, answered all our questions without any rush, and the digital prescription was sent to my WhatsApp right away.",
    clinicalOutcome: "Diagnosed mild bronchitis, clear 5-day regimen with complete recovery.",
  },
  {
    id: "rev-3",
    name: "Rajesh Kumar Gupta",
    initials: "RG",
    locality: "Majhola, Moradabad",
    doctor: "Dr. Raees Akhtar",
    rating: 5,
    date: "4 days ago",
    consultationType: "Video OPD (₹15/min)",
    costBilled: "₹45 (3 mins)",
    duration: "3 mins",
    tags: ["₹15/min Wallet", "Blood Report Review", "Transparent"],
    headline: "Billed strictly for 3 minutes — genuine ₹15/min wallet!",
    text: "The per-minute wallet billing is genuinely honest! I just needed Dr. Raees to review my fasting blood sugar and lipid profile report. The video call lasted exactly 3 minutes, and I was billed just ₹45 from my wallet. No hospital or clinic in UP offers this kind of transparency.",
    clinicalOutcome: "Adjusted metformin dosage based on HbA1c with personalized diet chart.",
  },
  {
    id: "rev-4",
    name: "Sunil Mehta",
    initials: "SM",
    locality: "Line Par, Moradabad",
    doctor: "Dr. Raees Akhtar",
    rating: 5,
    date: "1 week ago",
    consultationType: "Diagnostic Review",
    costBilled: "Mohan X-Ray Synergy",
    duration: "8 mins",
    tags: ["Mohan X-Ray Synergy", "Chest Infection", "Instant Film Review"],
    headline: "Mohan X-Ray next door saved us hours of travel",
    text: "Having Mohan X-Ray right next to Rehmat Health Care is a blessing. We got our child's digital chest X-ray done next door, and Dr. Raees immediately reviewed the film and prescribed medication. Clean clinic, very polite staff.",
    clinicalOutcome: "Immediate confirmation of mild chest congestion; prevented unnecessary admission.",
  },
  {
    id: "rev-5",
    name: "Farheen Khan",
    initials: "FK",
    locality: "Asalatpura, Moradabad",
    doctor: "Dr. Raees Akhtar",
    rating: 5,
    date: "5 days ago",
    consultationType: "Video OPD (₹15/min)",
    costBilled: "₹60 (4 mins)",
    duration: "4 mins",
    tags: ["Pediatric Care", "Seasonal Cough", "WhatsApp Rx"],
    headline: "Prompt dosage guidance without braving clinic queues",
    text: "During rainy season, my young daughter was coughing non-stop. Rather than taking her through rainy traffic, I loaded ₹100 into the Health Wallet and hopped onto video call with Dr. Raees. He prescribed pediatric drops and clear steam instructions right away.",
    clinicalOutcome: "Cough subsided in 48 hours. No waiting room viral exposure.",
  },
  {
    id: "rev-6",
    name: "Dr. Neeraj Saxena",
    initials: "NS",
    locality: "Kanth Road, Moradabad",
    doctor: "Dr. Raees Akhtar",
    rating: 5,
    date: "Yesterday",
    consultationType: "Walk-in OPD",
    costBilled: "Hypertension Review",
    duration: "12 mins",
    tags: ["Hypertension", "Geriatric Care", "Senior Citizen"],
    headline: "Regular BP monitoring with meticulous medical records",
    text: "As a retired teacher, I appreciate doctors who don't prescribe ten unnecessary tests. Dr. Raees monitored my BP over three visits, made minimal medication tweaks, and gave practical salt reduction advice. Truly dependable family care.",
    clinicalOutcome: "BP stabilized at 124/82 mmHg with routine 3-month digital follow-up.",
  },
];

export function TestimonialsSection() {
  const [layoutMode, setLayoutMode] = useState<"coverflow" | "stack" | "grid">("coverflow");
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [selectedReview, setSelectedReview] = useState<PatientReview | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [filterTag, setFilterTag] = useState<string>("All");
  const [windowWidth, setWindowWidth] = useState<number>(1024);

  const filterOptions = ["All", "Video OPD", "Walk-in OPD", "Mohan X-Ray Synergy", "Civil Lines", "Malviya Nagar"];

  // Window resize handler for true responsive layout
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filteredReviews = reviewsData.filter((r) => {
    if (filterTag === "All") return true;
    if (filterTag === "Video OPD") return r.consultationType.includes("Video");
    if (filterTag === "Walk-in OPD") return r.consultationType.includes("Walk-in");
    if (filterTag === "Mohan X-Ray Synergy") return r.tags.includes("Mohan X-Ray Synergy");
    if (filterTag === "Civil Lines") return r.locality.includes("Civil Lines");
    if (filterTag === "Malviya Nagar") return r.locality.includes("Malviya Nagar");
    return true;
  });

  // Autoplay rotation for Coverflow & Stack modes
  useEffect(() => {
    if (!isPlaying || layoutMode === "grid" || selectedReview !== null || filteredReviews.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % filteredReviews.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPlaying, layoutMode, selectedReview, filteredReviews.length]);

  const handleNext = () => {
    if (filteredReviews.length === 0) return;
    setActiveIdx((prev) => (prev + 1) % filteredReviews.length);
  };

  const handlePrev = () => {
    if (filteredReviews.length === 0) return;
    setActiveIdx((prev) => (prev - 1 + filteredReviews.length) % filteredReviews.length);
  };

  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;

  return (
    <section id="testimonials" className="py-16 sm:py-24 md:py-32 bg-gradient-to-b from-white via-slate-50/70 to-white relative overflow-hidden">
      {/* Background Radial Lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[320px] sm:w-[600px] lg:w-[850px] h-[300px] sm:h-[550px] bg-gradient-to-tr from-emerald-100/40 via-teal-50/30 to-blue-50/30 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="w-full px-3.5 sm:px-8 md:px-0">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl text-center space-y-3 sm:space-y-4"
        >
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100/90 px-3.5 py-1 text-[11px] sm:text-xs font-black uppercase tracking-wider text-emerald-800 border border-emerald-200">
            <ThumbsUp className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-emerald-700" />
            <span>Patient Stories & Evidence</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Trusted by Moradabad Families
          </h2>

          <p className="text-xs sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal px-2">
            Explore authentic experiences from patients treated by <strong>Dr. Raees Akhtar</strong> in Malviya Nagar and via 24/7 video OPD.
          </p>

          {/* Social Proof Trust Bar */}
          <div className="pt-1.5 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-[11px] sm:text-xs font-bold text-slate-600">
            <span className="flex items-center gap-1.5 bg-amber-50 text-amber-900 border border-amber-200 px-2.5 sm:px-3 py-1 rounded-full shadow-2xs">
              <Star className="h-3 sm:h-3.5 w-3 sm:w-3.5 fill-amber-500 text-amber-500 shrink-0" />
              <span>4.5 ★ Justdial Rating (Verified)</span>
            </span>
            <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-900 border border-emerald-200 px-2.5 sm:px-3 py-1 rounded-full shadow-2xs">
              <ShieldCheck className="h-3 sm:h-3.5 w-3 sm:w-3.5 text-emerald-600 shrink-0" />
              <span>15,000+ Consultations</span>
            </span>
            <span className="hidden xs:flex items-center gap-1.5 bg-blue-50 text-blue-900 border border-blue-200 px-2.5 sm:px-3 py-1 rounded-full shadow-2xs">
              <MapPin className="h-3 sm:h-3.5 w-3 sm:w-3.5 text-blue-600 shrink-0" />
              <span>Beside Mohan X-Ray</span>
            </span>
          </div>
        </motion.div>


        {/* ========================================================= */}
        {/* LAYOUT MODE 1: 3D COVERFLOW PLAYGROUND (RESPONSIVE) */}
        {/* ========================================================= */}
        {layoutMode === "coverflow" && (
          <div className="mt-8 sm:mt-14 max-w-6xl mx-auto relative perspective-[1200px] min-h-[440px] sm:min-h-[480px] flex items-center justify-center overflow-hidden sm:overflow-visible">
            <div className="relative w-full flex items-center justify-center py-4 sm:py-6">
              {filteredReviews.map((rev, idx) => {
                const total = filteredReviews.length;
                let offset = idx - activeIdx;
                if (offset > total / 2) offset -= total;
                if (offset < -total / 2) offset += total;

                const isCurrent = offset === 0;
                const isLeft = offset < 0;
                const absOffset = Math.abs(offset);

                // Responsive offset distance calculation
                const stepDistance = isMobile ? 70 : isTablet ? 150 : 230;
                const xTransform = offset * stepDistance;
                const rotateY = isCurrent ? 0 : isLeft ? (isMobile ? 18 : 28) : (isMobile ? -18 : -28);
                const scale = isCurrent ? 1 : isMobile ? 0.88 : 0.85 - (absOffset - 1) * 0.08;
                const zIndex = 30 - absOffset * 10;
                const opacity = isCurrent ? 1 : absOffset === 1 ? (isMobile ? 0.45 : 0.75) : 0.3;

                // On mobile, hide 2-away cards to keep the center card clean and fully legible
                if (isMobile && absOffset > 1) return null;
                if (!isMobile && absOffset > 2) return null;

                return (
                  <motion.div
                    key={rev.id}
                    layoutId={`review-${rev.id}`}
                    animate={{
                      x: xTransform,
                      scale: scale,
                      rotateY: rotateY,
                      opacity: opacity,
                      zIndex: zIndex,
                    }}
                    drag={isCurrent ? "x" : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.4}
                    onDragEnd={(_, info) => {
                      if (info.offset.x > 60) handlePrev();
                      else if (info.offset.x < -60) handleNext();
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 24,
                    }}
                    onClick={() => {
                      if (!isCurrent) {
                        setActiveIdx(idx);
                      } else {
                        setSelectedReview(rev);
                      }
                    }}
                    className={`absolute w-[88vw] max-w-[340px] sm:max-w-[420px] md:max-w-[460px] rounded-3xl border cursor-pointer select-none transition-shadow ${isCurrent
                      ? "bg-white border-emerald-300 shadow-2xl shadow-emerald-950/15 ring-2 ring-emerald-400/40"
                      : "bg-white/95 border-slate-200/90 shadow-md hover:bg-white"
                      } p-5 sm:p-8 flex flex-col justify-between`}
                    style={{
                      transformStyle: "preserve-3d",
                      touchAction: "pan-y",
                    }}
                  >
                    <div>
                      {/* Top Bar: Badge, Rating & Fullscreen trigger */}
                      <div className="flex items-center justify-between gap-1.5 border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-1">
                          <div className="flex items-center text-amber-400">
                            {[...Array(rev.rating)].map((_, i) => (
                              <Star key={i} className="h-3.5 w-3.5 fill-amber-400" />
                            ))}
                          </div>
                          <span className="text-xs font-black text-slate-800 ml-1">5.0</span>
                        </div>

                        <span className="rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 text-[10px] sm:text-[11px] font-extrabold flex items-center gap-1 shrink-0">
                          {rev.consultationType.includes("Video") ? (
                            <Video className="h-3 w-3 text-emerald-600" />
                          ) : (
                            <Stethoscope className="h-3 w-3 text-emerald-600" />
                          )}
                          <span className="truncate max-w-[120px] sm:max-w-none">{rev.consultationType}</span>
                        </span>
                      </div>

                      {/* Headline & Locality */}
                      <div className="mt-3.5">
                        <h4 className="text-sm sm:text-base md:text-lg font-black text-slate-900 leading-snug line-clamp-2">
                          "{rev.headline}"
                        </h4>
                        <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-500 font-medium">
                          <MapPin className="h-3 w-3 text-rose-500 shrink-0" />
                          <span className="truncate">{rev.locality}</span>
                          <span>•</span>
                          <span className="shrink-0">{rev.date}</span>
                        </div>
                      </div>

                      {/* Review Paragraph */}
                      <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal line-clamp-3 sm:line-clamp-4">
                        "{rev.text}"
                      </p>

                      {/* Treatment Tags */}
                      <div className="flex flex-wrap gap-1 mt-3">
                        {rev.tags.slice(0, isMobile ? 2 : 3).map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="rounded-md bg-slate-100 text-slate-700 px-2 py-0.5 text-[10px] font-bold"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Patient Footer */}
                    <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-black flex items-center justify-center text-xs shadow-xs shrink-0">
                          {rev.initials}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1">
                            <span className="font-extrabold text-slate-900 text-xs sm:text-sm truncate">{rev.name}</span>
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                          </div>
                          <span className="text-[10px] sm:text-[11px] text-emerald-700 font-semibold truncate block">{rev.doctor}</span>
                        </div>
                      </div>

                      {isCurrent && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedReview(rev);
                          }}
                          className="flex items-center gap-1 text-[11px] font-black text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg transition-colors shrink-0"
                        >
                          <span>Full Case</span>
                          <Maximize2 className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Mobile Swipe Hint */}
            {isMobile && (
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-white/80 px-2.5 py-0.5 rounded-full border border-slate-200/80 shadow-2xs pointer-events-none">
                <MoveHorizontal className="h-3 w-3 text-emerald-600" />
                <span>Swipe left / right</span>
              </div>
            )}
          </div>
        )}


        {/* Pagination Dots (for Coverflow & Stack modes) */}
        {layoutMode !== "grid" && (
          <div className="mt-6 sm:mt-8 flex items-center justify-center gap-2">
            {filteredReviews.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveIdx(idx)}
                className={`transition-all duration-300 rounded-full ${activeIdx === idx
                  ? "w-7 sm:w-8 h-2 sm:h-2.5 bg-emerald-600"
                  : "w-2 sm:w-2.5 h-2 sm:h-2.5 bg-slate-300 hover:bg-slate-400"
                  }`}
                title={`Go to story ${idx + 1}`}
              />
            ))}
          </div>
        )}

        {/* ========================================================= */}
        {/* EXPANDED DETAIL MODAL (RESPONSIVE DIALOG) */}
        {/* ========================================================= */}
        <AnimatePresence>
          {selectedReview && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-md"
              onClick={() => setSelectedReview(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ type: "spring", duration: 0.35 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-xl md:max-w-2xl rounded-3xl border border-emerald-200 bg-white p-5 sm:p-8 shadow-2xl overflow-hidden max-h-[88vh] overflow-y-auto"
              >
                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setSelectedReview(null)}
                  className="absolute top-4 right-4 sm:top-5 sm:right-5 h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
                  aria-label="Close dialog"
                >
                  <X className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>

                {/* Patient Header */}
                <div className="flex items-center gap-3.5 border-b border-slate-100 pb-4 pr-10">
                  <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-black flex items-center justify-center text-base sm:text-lg shadow-md shadow-emerald-600/20 shrink-0">
                    {selectedReview.initials}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="text-base sm:text-xl font-black text-slate-900 truncate">{selectedReview.name}</h3>
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] sm:text-[11px] font-extrabold text-emerald-800">
                        <CheckCircle2 className="h-3 w-3 text-emerald-700" />
                        <span>Verified Patient</span>
                      </span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-slate-500 font-semibold mt-0.5 truncate">
                      {selectedReview.locality} • {selectedReview.date}
                    </p>
                  </div>
                </div>

                {/* Consultation Details Bento (Responsive columns) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 my-4 sm:my-5">
                  <div className="p-2.5 sm:p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Consult Mode
                    </span>
                    <span className="text-[11px] sm:text-xs font-black text-slate-800 flex items-center gap-1 mt-0.5 truncate">
                      <Video className="h-3 w-3 text-emerald-600 shrink-0" />
                      <span className="truncate">{selectedReview.consultationType}</span>
                    </span>
                  </div>

                  <div className="p-2.5 sm:p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Billing Deducted
                    </span>
                    <span className="text-[11px] sm:text-xs font-black text-emerald-700 mt-0.5 block truncate">
                      {selectedReview.costBilled || "Wallet ₹15/min"}
                    </span>
                  </div>

                  <div className="p-2.5 sm:p-3 rounded-2xl bg-slate-50 border border-slate-100 col-span-2 sm:col-span-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Doctor Assigned
                    </span>
                    <span className="text-[11px] sm:text-xs font-black text-slate-800 flex items-center gap-1 mt-0.5 truncate">
                      <Stethoscope className="h-3 w-3 text-blue-600 shrink-0" />
                      <span className="truncate">{selectedReview.doctor}</span>
                    </span>
                  </div>
                </div>

                {/* Headline & Full Review */}
                <div className="space-y-2 sm:space-y-3">
                  <h4 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                    "{selectedReview.headline}"
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                    "{selectedReview.text}"
                  </p>
                </div>

                {/* Clinical Outcome Box */}
                <div className="mt-4 p-3.5 sm:p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 space-y-1">
                  <span className="text-[11px] sm:text-xs font-black text-emerald-950 flex items-center gap-1.5">
                    <FileCheck2 className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
                    <span>Clinical Outcome & Diagnosis</span>
                  </span>
                  <p className="text-[11px] sm:text-xs text-emerald-900 leading-relaxed font-normal">
                    {selectedReview.clinicalOutcome}
                  </p>
                </div>

                {/* Treatment Tags */}
                <div className="mt-3.5 flex flex-wrap gap-1.5">
                  {selectedReview.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="rounded-lg bg-slate-100 text-slate-700 px-2 py-0.5 text-[11px] font-bold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Modal Footer CTA */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <span className="text-[11px] text-slate-500 font-medium">
                    Verified Moradabad Consultation • Rehmat Health Care
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedReview(null)}
                    className="w-full sm:w-auto px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors"
                  >
                    Close Story
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
