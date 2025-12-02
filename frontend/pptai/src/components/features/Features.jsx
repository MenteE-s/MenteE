import React from "react";

export default function Features() {
  const features = [
    {
      title: "AI-Powered Design",
      description:
        "Our advanced AI creates stunning slide designs tailored to your content.",
      icon: "🎨",
    },
    {
      title: "Smart Templates",
      description:
        "Choose from dozens of professionally designed templates that adapt to your needs.",
      icon: "🧩",
    },
    {
      title: "Real-time Collaboration",
      description:
        "Work together with your team in real-time, no matter where you are.",
      icon: "👥",
    },
    {
      title: "Instant Export",
      description:
        "Export your presentations in multiple formats with a single click.",
      icon: "⚡",
    },
    {
      title: "Content Intelligence",
      description:
        "Our AI suggests relevant images and charts based on your content.",
      icon: "🧠",
    },
    {
      title: "Custom Branding",
      description:
        "Maintain your brand identity with customizable colors, fonts, and logos.",
      icon: "🏢",
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

      <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
            Powerful{" "}
            <span className="bg-linear-to-r from-[#1d9bf0] to-[#27b96f] bg-clip-text text-transparent">
              Features
            </span>
          </h2>
          <p className="text-xl text-slate-500">
            Everything you need to create stunning presentations quickly and
            easily
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-2xl p-8 transition-all duration-300 hover:shadow-glow hover:-translate-y-2 group animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-16 h-16 bg-linear-to-br from-primary-600/20 to-accent-700/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-linear-to-br group-hover:from-primary-600 group-hover:to-accent-700 transition-all duration-300">
                <span className="text-3xl group-hover:animate-bounce-gentle">
                  {feature.icon}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3 group-hover:text-primary-400 transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-slate-500 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
