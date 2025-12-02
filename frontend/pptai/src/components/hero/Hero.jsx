import React from "react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="max-w-6xl mx-auto px-6 md:px-10 py-16 md:py-20 relative overflow-hidden bg-white text-slate-900">
      {/* Background decorations */}
      <div className="absolute -top-1/2 -right-1/2 w-full h-[200%] bg-gradient-radial from-[#c6f1e6]/60 via-[#d5ecff]/60 to-transparent animate-float pointer-events-none"></div>
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0 bg-grid-pattern"
          style={{ backgroundSize: "40px 40px" }}
        ></div>
      </div>

      {/* Glowing orbs */}
      <div className="absolute top-16 left-6 w-32 h-32 bg-[#7cd4c9]/70 rounded-full filter blur-3xl opacity-30 animate-float"></div>
      <div
        className="absolute bottom-12 right-6 w-40 h-40 bg-[#4aa3ff]/50 rounded-full filter blur-3xl opacity-25 animate-float"
        style={{ animationDelay: "2s" }}
      ></div>

      <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
        <div className="flex-1 animate-fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-slate-900 mb-4">
            AI-powered slide generation —{" "}
            <span className="bg-linear-to-r from-[#1d9bf0] to-[#27b96f] bg-clip-text text-transparent">
              fast
            </span>
            ,{" "}
            <span className="bg-linear-to-r from-[#1d9bf0] to-[#27b96f] bg-clip-text text-transparent">
              beautiful
            </span>
            , and tuned to your needs
          </h1>
          <p className="mt-6 text-xl max-w-2xl text-slate-600 leading-relaxed">
            Create professional slide decks with AI assistance. Use our advanced
            tools to generate layouts, suggest visuals, and craft compelling
            content that captivates your audience.
          </p>

          <div className="mt-8 flex flex-wrap gap-4 items-center animate-fade-in-up">
            <Link
              to="/signup"
              className="bg-linear-to-r from-[#1d9bf0] to-[#27b96f] text-white px-8 py-3.5 rounded-xl font-bold text-base transition-all duration-300 hover:shadow-glow hover:scale-105 shadow-md inline-flex items-center gap-2 group"
            >
              Create slides
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
            <a
              className="text-slate-500 hover:text-slate-900 text-base font-medium underline transition-colors duration-200"
              href="#features"
            >
              How it works
            </a>
          </div>

          <div
            className="mt-12 flex flex-wrap gap-6 animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            {[
              { label: "Presentations Created", value: "10K+" },
              { label: "Hours Saved", value: "500K+" },
              { label: "Uptime", value: "99.9%" },
              { label: "Templates", value: "50+" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex flex-col items-center text-center p-4 rounded-xl bg-white/90 border border-slate-200 shadow-sm transition-all duration-300 hover:shadow-glow hover:-translate-y-1 min-w-[140px]"
              >
                <span className="text-2xl font-bold text-slate-900">
                  {item.value}
                </span>
                <span className="text-sm text-slate-500 mt-1 font-medium">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 w-full max-w-lg animate-scale-in">
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-[#d8f5ec]/80 via-[#d0e8ff]/70 to-transparent pointer-events-none"></div>
            <div className="text-center relative z-10">
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 bg-slate-100 rounded-full px-4 py-2 text-sm font-medium text-slate-600">
                  <div className="w-2 h-2 bg-[#27b96f] rounded-full animate-pulse"></div>
                  Live preview
                </div>
              </div>
              <div className="text-lg font-semibold mb-3 text-slate-900">
                Slide size 16:9 • Shapes: rounded
              </div>
              <div className="text-sm text-slate-500">
                AI is generating your presentation...
              </div>

              {/* Preview slides */}
              <div className="mt-6 grid grid-cols-2 gap-3">
                {[...Array(4)].map((_, index) => (
                  <div
                    key={index}
                    className="bg-linear-to-br from-[#defaf5] to-[#dbe8ff] rounded-lg p-4 border border-[#b8e9d7] h-24 flex items-center justify-center"
                  >
                    <div className="w-full h-2 bg-linear-to-r from-[#1d9bf0] to-[#27b96f] rounded-full"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
