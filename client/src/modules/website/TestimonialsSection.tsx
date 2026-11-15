"use client";

import React from "react";
import { Star, Quote, CheckCircle2 } from "lucide-react";

export function TestimonialsSection() {
  const reviews = [
    {
      name: "Mohd. Farhan",
      initials: "MF",
      locality: "Civil Lines, Moradabad",
      doctor: "Dr. Rehmat Ali",
      rating: 5,
      date: "Last month",
      text: "Dr. Rehmat Ali is our family physician. When my elderly father developed high fever late in the evening, we started a video call from the app. Within 2 minutes Dr. Rehmat was reviewing his symptoms and prescribed antibiotics. Extremely reassuring and polite doctor!",
    },
    {
      name: "Shazia Parveen",
      initials: "SP",
      locality: "Malviya Nagar, Moradabad",
      doctor: "Dr. Sana Khan",
      rating: 5,
      date: "2 weeks ago",
      text: "Dr. Sana Khan is one of the kindest gynecologists in Moradabad. She explains everything in clear Urdu and Hindi, answered all my PCOD questions without rushing, and the digital prescription was sent to my WhatsApp immediately.",
    },
    {
      name: "Rajesh Kumar Gupta",
      initials: "RG",
      locality: "Majhola, Moradabad",
      doctor: "Dr. Rehmat Ali",
      rating: 5,
      date: "3 days ago",
      text: "The per-minute wallet system is genuinely honest! I just needed Dr. Rehmat to review my fasting blood sugar and cholesterol report. The call took exactly 3 minutes, and I was billed just ₹45 from my wallet. No clinic in UP offers this kind of transparency.",
    },
    {
      name: "Imran Siddiqui",
      initials: "IS",
      locality: "Line Par, Moradabad",
      doctor: "Dr. Tariq Mansoor",
      rating: 5,
      date: "1 week ago",
      text: "Having Mohan X-Ray right next to Rehmat Health Care is a blessing. We got our child's chest X-ray done next door and Dr. Tariq immediately reviewed the film and prescribed medication. Clean clinic, very polite staff.",
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-white relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center space-y-4">
          <span className="inline-block rounded-full bg-emerald-100 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-emerald-800">
            Patient Stories
          </span>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Trusted by Moradabad Families
          </h2>
          <p className="text-base text-slate-600 sm:text-lg leading-relaxed max-w-2xl mx-auto font-normal">
            See how Rehmat Health Care has helped thousands of patients in Moradabad receive timely, compassionate medical advice.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-slate-50/70 p-8 sm:p-9 shadow-sm hover:border-emerald-300 hover:bg-white hover:shadow-lg transition-all duration-300 relative group"
            >
              <div>
                {/* Rating Stars & Date */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                    <span className="text-xs font-black text-slate-700 ml-1.5">5.0</span>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">{rev.date}</span>
                </div>

                {/* Review Text */}
                <p className="mt-5 text-sm text-slate-700 leading-relaxed italic font-normal">
                  "{rev.text}"
                </p>
              </div>

              {/* Patient Profile Footer */}
              <div className="mt-8 pt-5 border-t border-slate-200/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                    {rev.initials}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-extrabold text-slate-900 text-sm">{rev.name}</h4>
                      <span title="Verified Patient">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">{rev.locality}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-block rounded-xl bg-emerald-100/90 px-3 py-1 text-xs font-bold text-emerald-800">
                    {rev.doctor}
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
