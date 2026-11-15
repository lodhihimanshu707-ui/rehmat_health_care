"use client";

import React from "react";
import { Star, Quote, CheckCircle2 } from "lucide-react";

export function TestimonialsSection() {
  const reviews = [
    {
      name: "Mohd. Farhan",
      locality: "Civil Lines, Moradabad",
      doctor: "Dr. Rehmat Ali",
      rating: 5,
      date: "Last month",
      text: "Dr. Rehmat Ali is our family physician. When my elderly father developed high fever late in the evening, we started a video call from the app. Within 2 minutes Dr. Rehmat was reviewing his symptoms and prescribed antibiotics. Extremely reassuring and polite doctor!",
    },
    {
      name: "Shazia Parveen",
      locality: "Malviya Nagar, Moradabad",
      doctor: "Dr. Sana Khan",
      rating: 5,
      date: "2 weeks ago",
      text: "Dr. Sana Khan is one of the kindest gynecologists in Moradabad. She explains everything in clear Urdu and Hindi, answered all my PCOD questions without rushing, and the digital prescription was sent to my WhatsApp immediately.",
    },
    {
      name: "Rajesh Kumar Gupta",
      locality: "Majhola, Moradabad",
      doctor: "Dr. Rehmat Ali",
      rating: 5,
      date: "3 days ago",
      text: "The per-minute wallet system is genuinely honest! I just needed Dr. Rehmat to review my fasting blood sugar and cholesterol report. The call took exactly 3 minutes, and I was billed just ₹45 from my wallet. No clinic in UP offers this kind of transparency.",
    },
    {
      name: "Imran Siddiqui",
      locality: "Line Par, Moradabad",
      doctor: "Dr. Tariq Mansoor",
      rating: 5,
      date: "1 week ago",
      text: "Having Mohan X-Ray right next to Rehmat Health Care is a blessing. We got our child's chest X-ray done next door and Dr. Tariq immediately reviewed the film and prescribed medication. Clean clinic, very polite staff.",
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-800">
            Patient Stories
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Trusted by Moradabad Families
          </h2>
          <p className="mt-4 text-base text-slate-600 sm:text-lg">
            See how Rehmat Health Care has helped thousands of patients in Moradabad receive timely, compassionate medical advice.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50/70 p-6 sm:p-7 shadow-sm hover:border-emerald-300 hover:bg-white transition-all relative"
            >
              <div>
                {/* Rating Stars */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-xs text-slate-400">{rev.date}</span>
                </div>

                {/* Review Text */}
                <p className="mt-4 text-sm text-slate-700 leading-relaxed italic">
                  "{rev.text}"
                </p>
              </div>

              {/* Patient Footer */}
              <div className="mt-6 pt-4 border-t border-slate-200/80 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-slate-900 text-sm">{rev.name}</h4>
                    <span title="Verified Patient">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{rev.locality}</p>
                </div>
                <div className="text-right">
                  <span className="inline-block rounded-md bg-emerald-100/70 px-2 py-0.5 text-[11px] font-semibold text-emerald-800">
                    Consulted {rev.doctor}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
