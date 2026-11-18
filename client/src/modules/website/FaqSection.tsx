"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle, Sparkles, MessageCircle, Phone, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "@/config/site";
import { MotionTabs } from "@/shared/ui/motion-tabs";

export function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", "Tele-OPD & Wallet", "In-Clinic Visits", "Mohan X-Ray & Tests", "Prescriptions"];

  const faqs = [
    {
      q: "How does the per-minute online video consultation work?",
      a: "Unlike traditional hospitals that charge upfront consultation fees of ₹500–₹1,000, Rehmat Health Care allows you to pay strictly for the minutes you talk (₹15/min for Dr. Raees Akhtar). You add credits to your Health Wallet (e.g. ₹100), click 'Start Video Consult', and talk. An on-screen timer tracks elapsed time. When the call ends, your balance is deducted for the exact duration. Unused credits never expire!",
      category: "Tele-OPD & Wallet",
    },
    {
      q: "Where is Rehmat Health Care located in Moradabad?",
      a: "Rehmat Health Care is situated on Malviya Nagar Main Road, Moradabad, right beside Mohan X-Ray & Ultrasound Centre (PIN 244001). It is easily accessible by public transportation, e-rickshaws, and autos from Moradabad Railway Station (3.2 km) and Roadways Bus Stand (2.8 km).",
      category: "In-Clinic Visits",
    },
    {
      q: "Do I need an appointment before visiting Rehmat Health Care?",
      a: "While walk-ins are welcomed during our regular clinic hours (Monday – Saturday: 10:00 AM – 07:00 PM), booking an appointment beforehand or calling our reception helps avoid waiting during peak hours. You can also start an instant video consultation online without any appointment 24/7.",
      category: "In-Clinic Visits",
    },
    {
      q: "Is there an X-Ray, ultrasound, and blood test facility available?",
      a: "Yes! Rehmat Health Care operates with seamless adjacent synergy with Mohan X-Ray & Ultrasound Centre right next door. Patients can complete digital X-Rays, 3D/4D ultrasound, ECG, and pathology blood panels in minutes with expedited review by Dr. Raees Akhtar.",
      category: "Mohan X-Ray & Tests",
    },
    {
      q: "Do I need to visit a hospital for a mild viral infection or seasonal fever?",
      a: "No, it is not necessary to visit a crowded hospital for a mild infection. You can consult Dr. Raees Akhtar at Rehmat Health Care in Malviya Nagar or connect over a 1-click video call from home to get evaluated and treated. If symptoms suggest a complication, our doctor will guide and refer you accordingly.",
      category: "Tele-OPD & Wallet",
    },
    {
      q: "Are digital prescriptions valid at Moradabad pharmacies?",
      a: "Yes! All digital prescriptions issued through Rehmat Health Care are signed by NMC/MCI registered medical practitioners and comply fully with Telemedicine Practice Guidelines of India. They contain verifiable doctor credentials and can be presented at any pharmacy or diagnostic centre across Moradabad.",
      category: "Prescriptions",
    },
    {
      q: "How can I contact Rehmat Health Care in Malviya Nagar, Moradabad?",
      a: "You can contact Rehmat Health Care directly by phone (+91 98370 12345), Landline (+91 591 2410987), WhatsApp chat (+91 98370 12345), or through our in-app online consultation portal.",
      category: "In-Clinic Visits",
    },
  ];

  const filteredFaqs = selectedCategory === "All"
    ? faqs
    : faqs.filter((f) => f.category === selectedCategory);

  return (
    <section id="faq" className="py-24 sm:py-32 bg-slate-50 border-t border-slate-200/90 relative overflow-hidden">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-emerald-800 border border-emerald-200">
            <HelpCircle className="h-3.5 w-3.5 text-emerald-700" />
            <span>Got Questions?</span>
          </span>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="text-base text-slate-600 max-w-2xl mx-auto font-normal">
            Everything you need to know about our Malviya Nagar clinic visits, diagnostic partnerships, and online per-minute video OPD.
          </p>

          {/* Category Tabs using Reusable MotionTabs */}
          <div className="flex justify-center pt-4">
            <MotionTabs
              layoutId="faq-category-tab"
              tabs={categories.map((c) => ({ id: c, label: c }))}
              activeTab={selectedCategory}
              onChange={(c) => setSelectedCategory(c)}
              fullWidth={false}
              className="flex-wrap justify-center p-1 rounded-2xl bg-white border border-slate-200/90 shadow-2xs"
            />
          </div>
        </motion.div>

        {/* FAQs Accordion with Framer Motion */}
        <div className="mt-12 space-y-3.5">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? "border-emerald-300 bg-white shadow-md shadow-emerald-950/5 ring-1 ring-emerald-300/50"
                    : "border-slate-200/90 bg-white hover:border-slate-300 shadow-2xs"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between p-5 sm:p-6 text-left font-black text-slate-900 hover:text-emerald-700 transition-colors"
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

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="border-t border-slate-100 bg-emerald-50/20 px-6 py-5 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Still have questions helper box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-14 rounded-3xl bg-white border border-emerald-200 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-5 shadow-sm"
        >
          <div>
            <h4 className="font-black text-slate-900 text-base">Still have questions?</h4>
            <p className="text-xs text-slate-500 mt-1 font-normal">
              Speak directly with our clinic desk or message Dr. Raees Akhtar on WhatsApp.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href="https://wa.me/919837012345?text=Hello%20Rehmat%20Health%20Care,%20I%20have%20a%20question%20regarding%20consultation"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-xs transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              <span>WhatsApp Us</span>
            </a>

            <a
              href={`tel:${siteConfig.phone.replace(/\s+/g, "")}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
            >
              <Phone className="h-4 w-4 text-slate-600" />
              <span>Call Clinic</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
