import React from "react";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Marketing Director",
      company: "TechGrowth Inc.",
      content:
        "AIppt has revolutionized our presentation process. We create professional decks in minutes instead of hours. The AI suggestions are incredibly accurate!",
      avatar: "SJ",
    },
    {
      name: "Michael Chen",
      role: "Product Manager",
      company: "InnovateCo",
      content:
        "The collaboration features are game-changing. Our remote team can work on presentations simultaneously with real-time updates. Worth every penny!",
      avatar: "MC",
    },
    {
      name: "Elena Rodriguez",
      role: "Educator",
      company: "University of Excellence",
      content:
        "As a professor, I create numerous presentations each semester. AIppt saves me hours each week and helps me produce more engaging content for my students.",
      avatar: "ER",
    },
  ];

  return (
    <section className="py-20 bg-white text-slate-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0 bg-grid-pattern"
          style={{ backgroundSize: "40px 40px" }}
        ></div>
      </div>

      {/* Glowing orbs */}
      <div className="absolute top-8 left-8 w-32 h-32 bg-[#7cd4c9]/60 rounded-full filter blur-3xl opacity-25 animate-float"></div>
      <div
        className="absolute bottom-6 right-4 w-40 h-40 bg-[#4aa3ff]/50 rounded-full filter blur-3xl opacity-20 animate-float"
        style={{ animationDelay: "2s" }}
      ></div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
            Trusted by{" "}
            <span className="bg-linear-to-r from-[#1d9bf0] to-[#27b96f] bg-clip-text text-transparent">
              Professionals
            </span>
          </h2>
          <p className="text-xl text-slate-500">
            Hear what our users have to say about their experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-slate-200 transition-all duration-300 hover:shadow-glow hover:-translate-y-1 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-linear-to-br from-primary-600 to-accent-700 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-glow">
                  {testimonial.avatar}
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-slate-900">
                    {testimonial.name}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {testimonial.role}, {testimonial.company}
                  </p>
                </div>
              </div>
              <p className="text-slate-600 leading-relaxed mb-6 italic">
                "{testimonial.content}"
              </p>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-primary-400 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
