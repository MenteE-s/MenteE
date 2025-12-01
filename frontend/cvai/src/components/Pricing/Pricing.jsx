import React, { useState, useEffect } from "react";
import { Check, Star, Zap, Shield, Crown, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { API_BASE } from "../../config";

const Pricing = () => {
  const [user, setUser] = useState(null);
  const [billingCycle, setBillingCycle] = useState("monthly"); // monthly or annual
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);

  useEffect(() => {
    // Get user from local storage
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error("Error parsing user data from localStorage:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleUpgradePlan = async () => {
    if (!user) {
      // Redirect to login if not logged in
      window.location.href = "/login";
      return;
    }

    setUpgrading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/update-plan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ plan: "pro" }),
      });

      if (!response.ok) {
        throw new Error("Failed to upgrade plan");
      }

      const data = await response.json();

      // Update user in localStorage
      const updatedUser = { ...user, plan: "pro" };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      // Show success message
      alert("Successfully upgraded to Pro plan!");
    } catch (error) {
      console.error("Error upgrading plan:", error);
      alert("Failed to upgrade plan. Please try again.");
    } finally {
      setUpgrading(false);
    }
  };

  const plans = [
    {
      name: "Free",
      price: {
        monthly: 0,
        annual: 0,
      },
      description: "Perfect for getting started",
      features: [
        "Create up to 3 profiles",
        "Basic templates",
        "Basic customization",
        "Community support",
        "Limited profile views",
      ],
      cta: user?.plan === "free" ? "Current Plan" : "Get Started",
      isPopular: false,
      planId: "free",
    },
    {
      name: "Pro",
      price: {
        monthly: 29,
        annual: 19,
      },
      description: "For professionals and job seekers",
      features: [
        "Unlimited profiles",
        "Premium templates",
        "Advanced customization",
        "Priority support",
        "Unlimited profile views",
        "Analytics dashboard",
        "Job matching",
        "Organization insights",
        "Profile reviews",
      ],
      cta: user?.plan === "pro" ? "Current Plan" : "Upgrade to Pro",
      isPopular: true,
      planId: "pro",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-slate-600">Loading pricing...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Select the plan that best fits your needs. Upgrade anytime to unlock
            more features.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-lg shadow-sm border border-primary-200 p-1 inline-flex">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                billingCycle === "monthly"
                  ? "bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-glow"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                billingCycle === "annual"
                  ? "bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-glow"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              Annual Billing
              <span className="ml-1 text-xs bg-primary-100 text-primary-600 px-2 py-0.5 rounded-full">
                Save 33%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-white rounded-2xl shadow-sm border ${
                plan.isPopular
                  ? "border-primary-200 ring-2 ring-primary-500 ring-opacity-20 relative overflow-hidden"
                  : "border-primary-100"
              }`}
            >
              {plan.isPopular && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-primary-500 to-accent-500 text-white text-xs font-semibold px-3 py-1 rounded-bl-lg">
                  Most Popular
                </div>
              )}

              <div className="p-8">
                <div className="flex items-center mb-4">
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center mr-4 ${
                      plan.name === "Free"
                        ? "bg-gray-100"
                        : "bg-gradient-to-r from-primary-100 to-accent-100"
                    }`}
                  >
                    {plan.name === "Free" ? (
                      <Shield className="h-6 w-6 text-gray-600" />
                    ) : (
                      <Crown className="h-6 w-6 text-primary-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">
                      {plan.name}
                    </h3>
                    <p className="text-sm text-slate-500">{plan.description}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-slate-900">
                      ${plan.price[billingCycle]}
                    </span>
                    {plan.price[billingCycle] > 0 && (
                      <>
                        <span className="text-slate-500 ml-1">/month</span>
                        {billingCycle === "annual" && (
                          <span className="text-sm text-slate-500 ml-2">
                            (billed annually)
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <Check className="h-5 w-5 text-primary-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                    user?.plan === plan.planId
                      ? "bg-gray-100 text-gray-700 cursor-not-allowed"
                      : plan.isPopular
                      ? "bg-gradient-to-r from-primary-500 to-accent-500 text-white hover:shadow-glow"
                      : "bg-white border border-primary-200 text-slate-700 hover:bg-primary-50"
                  }`}
                  disabled={user?.plan === plan.planId}
                >
                  {user?.plan === plan.planId ? (
                    plan.cta
                  ) : plan.name === "Free" ? (
                    <Link to="/register" className="block w-full">
                      {plan.cta}
                    </Link>
                  ) : (
                    <button
                      onClick={handleUpgradePlan}
                      className="flex items-center justify-center w-full"
                    >
                      {plan.cta}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </button>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-slate-900 mb-8">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-primary-100 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Can I change my plan later?
              </h3>
              <p className="text-slate-600">
                Yes, you can upgrade or downgrade your plan at any time. Changes
                will be reflected in your next billing cycle.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-primary-100 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-slate-600">
                We accept all major credit cards, debit cards, and PayPal. All
                payments are processed securely through our payment partners.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-primary-100 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Is there a free trial for the Pro plan?
              </h3>
              <p className="text-slate-600">
                Yes, we offer a 14-day free trial for the Pro plan. No credit
                card required to start your trial.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-primary-100 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Can I cancel my subscription anytime?
              </h3>
              <p className="text-slate-600">
                Absolutely. You can cancel your subscription at any time with no
                cancellation fees. Your access will continue until the end of
                your current billing period.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl p-8 md:p-12 text-center text-white max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">
            Ready to take your profile to the next level?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who are already using cvAI to stand
            out from the crowd.
          </p>
          <button
            onClick={handleUpgradePlan}
            disabled={upgrading || user?.plan === "pro"}
            className="bg-white text-primary-600 font-bold py-3 px-8 rounded-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {upgrading
              ? "Processing..."
              : user?.plan === "pro"
              ? "You're on Pro Plan"
              : "Get Started with Pro"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
