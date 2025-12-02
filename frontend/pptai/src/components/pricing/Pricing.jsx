import React from "react";

export default function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "Free",
      description: "Perfect for individuals getting started",
      features: [
        "5 presentations per month",
        "Basic templates",
        "Standard export options",
        "Community support",
      ],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Pro",
      price: "$19",
      description: "For professionals and teams",
      features: [
        "Unlimited presentations",
        "Premium templates",
        "Advanced AI features",
        "Real-time collaboration",
        "Priority support",
        "Custom branding",
      ],
      cta: "Try Free for 14 Days",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large organizations",
      features: [
        "Everything in Pro plan",
        "Unlimited users",
        "Single sign-on (SSO)",
        "Advanced security",
        "Dedicated account manager",
        "Custom integrations",
      ],
      cta: "Contact Sales",
      popular: false,
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
        className="absolute bottom-6 right-6 w-40 h-40 bg-[#4aa3ff]/50 rounded-full filter blur-3xl opacity-20 animate-float"
        style={{ animationDelay: "2s" }}
      ></div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
            Simple,{" "}
            <span className="bg-linear-to-r from-[#1d9bf0] to-[#27b96f] bg-clip-text text-transparent">
              Transparent
            </span>{" "}
            Pricing
          </h2>
          <p className="text-xl text-slate-500">
            Choose the plan that works best for you and your team
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white/90 backdrop-blur-sm rounded-2xl p-8 border-2 transition-all duration-300 hover:shadow-glow hover:-translate-y-2 animate-fade-in-up ${
                plan.popular
                  ? "border-primary-600 shadow-glow scale-105 animate-pulse-glow"
                  : "border-slate-200"
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-linear-to-r from-[#1d9bf0] to-[#27b96f] text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg animate-bounce-gentle">
                  Most Popular
                </div>
              )}

              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                {plan.name}
              </h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-slate-900">
                  {plan.price}
                </span>
                {plan.price !== "Custom" && (
                  <span className="text-slate-500 text-lg">/month</span>
                )}
              </div>
              <p className="text-slate-500 mb-8">{plan.description}</p>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li
                    key={featureIndex}
                    className="flex items-center text-slate-600"
                  >
                    <div className="w-5 h-5 bg-linear-to-br from-primary-600 to-accent-700 rounded-full mr-3 shrink-0 flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="3"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 px-6 rounded-xl font-semibold text-lg transition-all duration-300 ${
                  plan.popular
                    ? "bg-linear-to-r from-[#1d9bf0] to-[#27b96f] text-white hover:shadow-glow hover:scale-105 shadow-md"
                    : "bg-white border-2 border-[#1d9bf0] text-[#1d9bf0] hover:bg-[#1d9bf0] hover:text-white hover:shadow-glow"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
