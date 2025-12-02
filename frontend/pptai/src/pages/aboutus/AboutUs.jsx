import React from "react";

export default function AboutUs() {
  return (
    <section className="bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0 bg-grid-pattern"
          style={{ backgroundSize: "40px 40px" }}
        ></div>
      </div>

      {/* Glowing orbs */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary-400 rounded-full filter blur-3xl opacity-20 animate-float"></div>
      <div
        className="absolute bottom-20 right-10 w-40 h-40 bg-accent-400 rounded-full filter blur-3xl opacity-20 animate-float"
        style={{ animationDelay: "2s" }}
      ></div>

      <div className="max-w-6xl mx-auto px-6 md:px-10 py-16 lg:py-24 relative z-10">
        <div className="text-center animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            About{" "}
            <span className="bg-linear-to-r from-[#1d9bf0] to-[#27b96f] bg-clip-text text-transparent">
              AIppt
            </span>
          </h1>
          <p className="mt-4 text-xl max-w-3xl mx-auto text-slate-600">
            We're revolutionizing how presentations are created with the power
            of artificial intelligence.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in-up">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Our Mission
            </h2>
            <p className="mt-4 text-slate-600 leading-relaxed">
              At AIppt, we believe that great ideas deserve great presentations.
              Our mission is to empower professionals, educators, and creators
              to communicate their ideas more effectively by removing the
              barriers between imagination and presentation.
            </p>
            <p className="mt-4 text-slate-600 leading-relaxed">
              We're building tools that not only save time but also inspire
              creativity, helping you focus on what matters most - your message.
            </p>
          </div>
          <div className="animate-scale-in">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-slate-200 shadow-lg relative overflow-hidden h-80 flex items-center justify-center">
              <div className="absolute inset-0 bg-linear-to-br from-primary-400/10 via-transparent to-accent-400/10 pointer-events-none"></div>
              <div className="relative z-10 text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-linear-to-r from-[#1d9bf0] to-[#27b96f] rounded-full flex items-center justify-center animate-pulse-glow">
                  <svg
                    className="w-10 h-10 text-slate-900"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    ></path>
                  </svg>
                </div>
                <span className="text-slate-900 text-xl font-semibold">
                  Team Collaboration
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-24 animate-fade-in">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
            Our Story
          </h2>
          <div className="mt-12 space-y-12">
            <div className="flex flex-col md:flex-row gap-8 animate-fade-in-up">
              <div className="shrink-0">
                <div className="w-24 h-24 bg-linear-to-r from-[#1d9bf0] to-[#27b96f] rounded-xl flex items-center justify-center text-slate-900 font-bold text-2xl shadow-md">
                  2022
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-slate-900">
                  The Idea
                </h3>
                <p className="mt-2 text-slate-600 leading-relaxed">
                  Founded by a team of designers and AI researchers who were
                  frustrated with the time-consuming process of creating
                  presentations, we set out to build a better way.
                </p>
              </div>
            </div>

            <div
              className="flex flex-col md:flex-row gap-8 animate-fade-in-up"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="shrink-0">
                <div className="w-24 h-24 bg-linear-to-r from-[#1d9bf0] to-[#27b96f] rounded-xl flex items-center justify-center text-slate-900 font-bold text-2xl shadow-md">
                  2023
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-slate-900">
                  First Prototype
                </h3>
                <p className="mt-2 text-slate-600 leading-relaxed">
                  We launched our first prototype with basic AI-powered slide
                  generation, helping early users create presentations 5x faster
                  than traditional methods.
                </p>
              </div>
            </div>

            <div
              className="flex flex-col md:flex-row gap-8 animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="shrink-0">
                <div className="w-24 h-24 bg-linear-to-r from-[#1d9bf0] to-[#27b96f] rounded-xl flex items-center justify-center text-slate-900 font-bold text-2xl shadow-md">
                  2024
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-slate-900">
                  Global Expansion
                </h3>
                <p className="mt-2 text-slate-600 leading-relaxed">
                  With thousands of users worldwide, we expanded our platform
                  with advanced features like custom themes, collaborative
                  editing, and integration with popular tools.
                </p>
              </div>
            </div>

            <div
              className="flex flex-col md:flex-row gap-8 animate-fade-in-up"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="shrink-0">
                <div className="w-24 h-24 bg-linear-to-r from-[#1d9bf0] to-[#27b96f] rounded-xl flex items-center justify-center text-slate-900 font-bold text-2xl shadow-md">
                  2025
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-slate-900">
                  AI Evolution
                </h3>
                <p className="mt-2 text-slate-600 leading-relaxed">
                  We've integrated cutting-edge AI models that understand
                  context, generate relevant visuals, and create cohesive
                  designs that make every presentation stand out.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-24 text-center animate-fade-in">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Team</h2>
          <p className="mt-4 max-w-2xl mx-auto text-slate-600">
            We're a diverse group of designers, engineers, and AI specialists
            passionate about transforming how people communicate through
            presentations.
          </p>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-2 animate-fade-in-up">
              <div className="w-24 h-24 mx-auto bg-linear-to-r from-[#1d9bf0] to-[#27b96f] rounded-full flex items-center justify-center text-slate-900 font-bold text-xl shadow-md">
                AJ
              </div>
              <h3 className="mt-4 text-xl font-semibold text-slate-900">
                Alex Johnson
              </h3>
              <p className="text-slate-500">Co-Founder & CEO</p>
            </div>
            <div
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-2 animate-fade-in-up"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="w-24 h-24 mx-auto bg-linear-to-r from-[#1d9bf0] to-[#27b96f] rounded-full flex items-center justify-center text-slate-900 font-bold text-xl shadow-md">
                SC
              </div>
              <h3 className="mt-4 text-xl font-semibold text-slate-900">
                Sam Chen
              </h3>
              <p className="text-slate-500">Co-Founder & CTO</p>
            </div>
            <div
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-2 animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="w-24 h-24 mx-auto bg-linear-to-r from-[#1d9bf0] to-[#27b96f] rounded-full flex items-center justify-center text-slate-900 font-bold text-xl shadow-md">
                MG
              </div>
              <h3 className="mt-4 text-xl font-semibold text-slate-900">
                Maria Garcia
              </h3>
              <p className="text-slate-500">Head of Design</p>
            </div>
          </div>
        </div>

        <div className="mt-24 p-8 rounded-xl bg-white/90 backdrop-blur-sm border border-slate-200 animate-fade-in">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
            Our Values
          </h2>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-50 rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-2 animate-fade-in-up">
              <div className="w-16 h-16 bg-linear-to-r from-[#1d9bf0] to-[#27b96f] rounded-xl flex items-center justify-center text-3xl shadow-md animate-float">
                ✨
              </div>
              <h3 className="mt-4 text-xl font-semibold text-slate-900">
                Innovation
              </h3>
              <p className="mt-2 text-slate-600 leading-relaxed">
                We constantly push boundaries to deliver cutting-edge solutions
                that exceed expectations.
              </p>
            </div>
            <div
              className="bg-slate-50 rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-2 animate-fade-in-up"
              style={{ animationDelay: "0.1s" }}
            >
              <div
                className="w-16 h-16 bg-linear-to-r from-[#1d9bf0] to-[#27b96f] rounded-xl flex items-center justify-center text-3xl shadow-md animate-float"
                style={{ animationDelay: "0.5s" }}
              >
                🤝
              </div>
              <h3 className="mt-4 text-xl font-semibold text-slate-900">
                Collaboration
              </h3>
              <p className="mt-2 text-slate-600 leading-relaxed">
                We believe in the power of teamwork and building tools that
                bring people together.
              </p>
            </div>
            <div
              className="bg-slate-50 rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-2 animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              <div
                className="w-16 h-16 bg-linear-to-r from-[#1d9bf0] to-[#27b96f] rounded-xl flex items-center justify-center text-3xl shadow-md animate-float"
                style={{ animationDelay: "1s" }}
              >
                🚀
              </div>
              <h3 className="mt-4 text-xl font-semibold text-slate-900">
                Excellence
              </h3>
              <p className="mt-2 text-slate-600 leading-relaxed">
                We strive for perfection in everything we do, from code quality
                to user experience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
