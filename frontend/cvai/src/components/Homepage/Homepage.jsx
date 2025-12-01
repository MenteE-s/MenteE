import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Testimonials from "./Testimonials";

export default function HomePage() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={sectionRef}
      className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-purple-50 pt-20 relative overflow-hidden"
    >
      {/* Animated Background from RecruAI design patterns (adopted) */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-primary-400/20 via-accent-400/20 to-primary-400/20 bg-300% animate-gradient pointer-events-none"></div>
      {/* Cursor-follow glow removed per request (was following mouse pointer) */}
      {/* Hero Section */}
      <section className="pt-12 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div
              className={`${isVisible ? "animate-fade-in-up" : "opacity-0"}`}
            >
              <div className="inline-block mb-6">
                <span className="px-4 py-2 rounded-full bg-yellow-100 text-yellow-700 text-sm font-semibold">
                  ✨ AI-Powered Resume & Interview Coach
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-yellow-600 to-purple-700 bg-clip-text text-transparent">
                  Land Your
                </span>
                <br />
                <span className="text-slate-900">Dream Job</span>
              </h1>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                CVAI helps you create stunning CVs, get AI-powered feedback, and
                ace interviews with realistic practice scenarios. Made by
                MenteE.
              </p>
              <div className="flex gap-4 flex-wrap">
                <Link
                  to="/register"
                  className="px-8 py-3 bg-gradient-to-r from-yellow-600 to-amber-600 text-white font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  Start Free Trial
                </Link>
                <a
                  href="#features"
                  className="px-8 py-3 bg-slate-200 text-slate-900 font-semibold rounded-lg hover:bg-slate-300 transition-colors"
                >
                  Watch Demo
                </a>
              </div>
              <p className="text-sm text-slate-500 mt-6">
                ✓ Free forever plan ✓ No credit card required ✓ 14-day premium
                trial
              </p>
            </div>

            {/* Right Visual */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400/30 to-yellow-400/30 blur-3xl rounded-full"></div>
              <div className="relative bg-white/80 backdrop-blur-md rounded-xl shadow-xl p-8 hover:shadow-2xl transition-shadow border border-primary-100">
                <div className="bg-gradient-to-r from-yellow-600 to-purple-700 rounded-lg p-1 mb-4">
                  <div className="bg-white rounded px-4 py-3 text-sm font-semibold bg-gradient-to-r from-yellow-600 to-purple-700 bg-clip-text text-white">
                    CVAI Resume Analyzer
                  </div>
                </div>
                <p className="text-slate-600 text-sm mb-6">
                  "Analyzing your resume..."
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                    <div className="h-2 bg-slate-200 rounded flex-1"></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse"></div>
                    <div className="h-2 bg-slate-200 rounded flex-1 w-4/5"></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                    <div className="h-2 bg-slate-200 rounded flex-1 w-3/4"></div>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Resume Score</span>
                    <span className="bg-gradient-to-r from-yellow-600 to-purple-700 bg-clip-text text-transparent font-bold">
                      92/100
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="py-20 px-6 bg-white/40 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto">
          <div
            className={`text-center mb-16 ${
              isVisible ? "animate-fade-in-up" : "opacity-0"
            }`}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-slate-600">
              Everything you need to land your dream job
            </p>
          </div>

          <div
            className={`grid md:grid-cols-3 gap-8 ${
              isVisible ? "animate-fade-in-up" : "opacity-0"
            }`}
          >
            {[
              {
                icon: "📄",
                title: "AI Resume Builder",
                desc: "Create ATS-optimized resumes with AI suggestions and real-time feedback.",
              },
              {
                icon: "📊",
                title: "Resume Score & Analytics",
                desc: "Get detailed analysis of your resume with actionable improvements.",
              },
              {
                icon: "🎤",
                title: "Interview Practice",
                desc: "Practice with AI-generated interview questions and get instant feedback.",
              },
              {
                icon: "🔄",
                title: "Personalized Coaching",
                desc: "AI adapts to your skill level and focuses on weak areas.",
              },
              {
                icon: "💼",
                title: "Job-Specific Templates",
                desc: "Get templates tailored for your target role and industry.",
              },
              {
                icon: "🏆",
                title: "Performance Tracking",
                desc: "Monitor your progress with comprehensive analytics and insights.",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="bg-white rounded-lg p-8 hover:shadow-lg transition-all duration-300 transform hover:scale-105 group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {f.title}
                </h3>
                <p className="text-slate-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials - RecruAI styled, using CVAI content */}
      <Testimonials />

      {/* How It Works */}
      <section
        id="how-it-works"
        className={`py-20 px-6 ${
          isVisible ? "animate-fade-in-up" : "opacity-0"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              How CVAI Works
            </h2>
            <p className="text-xl text-slate-600">
              Three simple steps to job success
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: "1",
                title: "Create Your CV",
                desc: "Build or upload your resume with our AI-powered tools",
              },
              {
                step: "2",
                title: "Get AI Feedback",
                desc: "Receive detailed analysis and personalized recommendations",
              },
              {
                step: "3",
                title: "Practice & Apply",
                desc: "Interview practice and track your progress to landing the job",
              },
            ].map((s, i) => (
              <div key={i} className="relative">
                <div className="bg-white rounded-lg p-8 text-center hover:shadow-lg transition-shadow transform hover:scale-105">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary-600 to-accent-600 text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {s.step}
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-slate-900">
                    {s.title}
                  </h3>
                  <p className="text-slate-600 text-sm">{s.desc}</p>
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-8 -right-3 text-2xl text-primary-300">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section
        id="pricing"
        className={`py-20 px-6 bg-white/40 backdrop-blur-sm ${
          isVisible ? "animate-fade-in-up" : "opacity-0"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-slate-600">
              Choose the plan that's right for you
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Free",
                price: "$0",
                features: [
                  "AI Resume Review",
                  "1 Interview Practice",
                  "Basic Templates",
                  "Community Support",
                ],
                cta: "Get Started",
              },
              {
                name: "Pro",
                price: "$9.99",
                period: "/month",
                features: [
                  "Unlimited Resume Reviews",
                  "Unlimited Interview Practice",
                  "50+ Templates",
                  "Priority Support",
                  "Advanced Analytics",
                ],
                cta: "Start Free Trial",
                highlighted: true,
              },
              {
                name: "Premium",
                price: "$24.99",
                period: "/month",
                features: [
                  "Everything in Pro",
                  "1-on-1 Coaching",
                  "Custom Templates",
                  "Interview Mock Sessions",
                  "Job Matching AI",
                ],
                cta: "Start Free Trial",
              },
            ].map((plan, i) => (
              <div
                key={i}
                className={`bg-white rounded-lg p-8 hover:shadow-lg transition-all duration-300 ${
                  plan.highlighted
                    ? "ring-2 ring-yellow-500 ring-offset-2 shadow-lg transform scale-105"
                    : "transform hover:scale-105"
                }`}
              >
                <h3 className="text-2xl font-bold mb-2 text-slate-900">
                  {plan.name}
                </h3>
                <p className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-purple-700 bg-clip-text text-transparent mb-1">
                  {plan.price}
                </p>
                {plan.period && (
                  <p className="text-slate-600 text-sm mb-6">{plan.period}</p>
                )}
                <ul className="space-y-3 mb-8 text-slate-700 text-sm">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2">
                      <span className="text-yellow-600">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/register"
                  className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-amber-600 text-white font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300 w-full block text-center"
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-yellow-600 to-purple-700">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Land Your Dream Job?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of job seekers who've landed better roles with CVAI
          </p>
          <Link
            to="/register"
            className="inline-block px-8 py-4 bg-white text-yellow-600 font-bold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            Start Your Free Trial Today
          </Link>
        </div>
      </section>
    </div>
  );
}
