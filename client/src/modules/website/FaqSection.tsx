"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: "How does the per-minute online video consultation work?",
      a: "Unlike traditional clinics that charge upfront consultation fees of ₹500+, Rehmat Health Care allows you to pay strictly for the minutes you talk (e.g. ₹15/min for Dr. Rehmat Ali). You add credits to your Health Wallet (e.g. ₹100), click 'Video Consult', and talk. An on-screen timer tracks elapsed time. When the call ends, your balance is deducted for the exact duration. Unused credits never expire!",
    },
    {
      q: "What happens if my wallet balance runs out during a call?",
      a: "When you have 60 seconds of balance left, an on-screen audio/visual reminder alerts you. You can either wrap up the conversation or recharge in a couple of clicks without dropping the call. If balance reaches zero, the call ends automatically to prevent accidental charges.",
    },
    {
      q: "Is the digital prescription valid at Moradabad chemists?",
      a: "Yes! All digital prescriptions issued through Rehmat Health Care are signed by NMC/MCI registered medical practitioners and comply with Telemedicine Practice Guidelines of India. They contain doctor credentials and can be presented at any pharmacy or diagnostic centre across Moradabad.",
    },
    {
      q: "Can I get my X-Ray or blood tests done at Mohan X-Ray next door?",
      a: "Absolutely! Rehmat Health Care has a seamless clinical partnership with Mohan X-Ray & Ultrasound Centre, located right next to our clinic in Malviya Nagar. Dr. Rehmat Ali can coordinate required digital X-Rays, sonographies, and blood investigations directly, often with prioritized reporting.",
    },
    {
      q: "Do I need an appointment for walk-in clinic visits?",
      a: "Walk-ins are welcomed during our regular OPD hours (Mon–Sat 9:00 AM – 2:00 PM and 5:00 PM – 9:00 PM). However, booking an appointment online or calling our reception helps avoid waiting during peak evening hours.",
    },
    {
      q: "Is my video consultation private and secure?",
      a: "Yes, our video calls utilize peer-to-peer WebRTC technology with end-to-end DTLS/SRTP encryption. Your call audio, video, and medical history remain strictly confidential between you and your doctor.",
    },
  ];

  return (
    <section id="faq" className="py-16 sm:py-20 bg-slate-50 border-t border-slate-200/80">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="text-center">
          <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-800">
            Got Questions?
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-base text-slate-600">
            Everything you need to know about our clinic visits and online per-minute teleconsultation.
          </p>
        </div>

        <div className="mt-12 space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 bg-white transition-all overflow-hidden"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between p-5 text-left font-bold text-slate-900 hover:text-emerald-700 transition-colors"
                >
                  <span className="text-sm sm:text-base pr-4">{faq.q}</span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-emerald-600" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="border-t border-slate-100 bg-slate-50/50 p-5 pt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

