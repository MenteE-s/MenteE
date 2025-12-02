import React from "react";

export default function CTA() {
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-radial from-[#c6f1e6]/90 to-transparent"></div>
      </div>

      {/* Glowing orbs */}
      <div className="absolute top-6 left-8 w-32 h-32 bg-[#7cd4c9]/60 rounded-full filter blur-3xl opacity-25 animate-float"></div>
      <div
        className="absolute bottom-6 right-6 w-40 h-40 bg-[#4aa3ff]/50 rounded-full filter blur-3xl opacity-20 animate-float"
        style={{ animationDelay: "2s" }}
      ></div>

      <div className="max-w-4xl mx-auto text-center px-6 relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 animate-fade-in">
          Ready to{" "}
          <span className="bg-linear-to-r from-[#1d9bf0] to-[#27b96f] bg-clip-text text-transparent">
            Transform
          </span>{" "}
          Your Presentations?
        </h2>
        <p
          className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto animate-fade-in"
          style={{ animationDelay: "0.2s" }}
        >
          Join thousands of professionals who are already creating stunning
          presentations with AIppt
        </p>
        <div
          className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up"
          style={{ animationDelay: "0.4s" }}
        >
          <button className="bg-linear-to-r from-[#1d9bf0] to-[#27b96f] text-white px-8 py-3.5 rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-glow hover:scale-105 shadow-md animate-pulse-glow">
            Get Started Free
          </button>
          <button className="border-2 border-[#1d9bf0] text-[#1d9bf0] px-8 py-3.5 rounded-xl font-semibold text-lg transition-all duration-300 hover:bg-[#1d9bf0] hover:text-white hover:shadow-glow">
            Schedule a Demo
          </button>
        </div>
        <p
          className="mt-6 text-slate-500 text-sm animate-fade-in"
          style={{ animationDelay: "0.6s" }}
        >
          No credit card required • 14-day free trial • Cancel anytime
        </p>
      </div>
    </section>
  );
}
