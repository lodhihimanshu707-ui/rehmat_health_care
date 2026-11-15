"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle, Sparkles } from "lucide-react";

export function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: "Do I need to visit a hospital for a mild viral infection or seasonal fever?",
      a: "No, it is not necessary to visit a large crowded hospital for a mild infection. You can consult a general physician at Rehmat Health Care in Malviya Nagar or connect over a 1-click video call from home to get evaluated and treated. If symptoms suggest a major complication, our doctor will guide and refer you accordingly.",
    },
    {
      q: "Where is Rehmat Health Care located in Moradabad?",
      a: "Rehmat Health Care is located on Malviya Nagar Main Road, Moradabad, right beside Mohan Xray & Ultrasound Centre (UP 244001). It is easily accessible by public transportation, e-rickshaws, and autos from Moradabad Railway Station (3.2 km) and Roadways Bus Stand (2.8 km).",
    },
    {
      q: "Do I need an appointment before visiting Rehmat Health Care?",
      a: "While walk-ins are welcomed during our clinic hours (Monday – Saturday: 10:00 AM – 07:00 PM), booking an appointment beforehand or calling our reception helps avoid waiting during peak hours. You can also start an instant video consultation online without any prior appointment.",
    },
    {
      q: "Is there an X-Ray, ultrasound, and blood test facility available?",
      a: "Yes! Rehmat Health Care operates with seamless adjacent synergy with Mohan X-Ray & Ultrasound Centre right next door. Patients can complete digital X-Rays, 3D/4D ultrasound, ECG, and pathology blood panels in minutes with expedited review by our doctors.",
    },
    {
      q: "How does the per-minute online video consultation work?",
      a: "Unlike traditional clinics that charge upfront consultation fees of ₹500+, Rehmat Health Care allows you to pay strictly for the minutes you talk (e.g. ₹15/min for Dr. Raees Akhtar). You add credits to your Health Wallet (e.g. ₹100), click 'Video Consult', and talk. An on-screen timer tracks elapsed time. When the call ends, your balance is deducted for the exact duration. Unused credits never expire!",
    },
    {
      q: "Are digital prescriptions valid at Moradabad pharmacies?",
      a: "Yes! All digital prescriptions issued through Rehmat Health Care are signed by NMC/MCI registered medical practitioners and comply with Telemedicine Practice Guidelines of India. They contain verifiable doctor credentials and can be presented at any pharmacy or diagnostic centre across Moradabad.",
    },
    {
      q: "How can I contact Rehmat Health Care in Malviya Nagar, Moradabad?",
      a: "You can contact Rehmat Health Care directly by phone (+91 98370 12345), Landline (+91 591 2410987), WhatsApp chat (+91 98370 12345), or through our in-app online consultation portal.",
    },
  ];

  return (
    <section id="faq" className="py-20 sm:py-28 bg-slate-50 border-t border-slate-200/90 relative">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4">
          <span className="inline-block rounded-full bg-emerald-100 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-emerald-800">
            Got Questions?
          </span>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="text-base text-slate-600 max-w-2xl mx-auto font-normal">
            Everything you need to know about our clinic visits and online per-minute teleconsultation.
          </p>
        </div>

        <div className="mt-14 space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? "border-emerald-300 bg-white shadow-md"
                    : "border-slate-200/90 bg-white hover:border-slate-300 shadow-2xs"
                }`}
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between p-6 text-left font-black text-slate-900 hover:text-emerald-700 transition-colors"
                >
                  <span className="text-sm sm:text-base pr-4 leading-snug">{faq.q}</span>
                  <div
                    className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      isOpen ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>
                {isOpen && (
                  <div className="border-t border-slate-100 bg-emerald-50/20 px-6 py-5 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
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
