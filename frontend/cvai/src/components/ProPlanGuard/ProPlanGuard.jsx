
import React from "react";
import { Link } from "react-router-dom";
import { Crown, Star, Zap, Shield, Check } from "lucide-react";

const ProPlanGuard = ({ children, feature = "this feature" }) => {
  // Check if user has pro plan
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const hasProPlan = user.plan === "pro";

  if (hasProPlan) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-primary-500 to-accent-500 p-6 text-white">
          <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mx-auto mb-4">
            <Crown className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold text-center">Upgrade to Pro</h2>
          <p className="text-center mt-2 text-white/90">
            {feature} is available with a Pro plan
          </p>
        </div>

        <div className="p-6">
          <div className="space-y-3 mb-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <Check className="h-4 w-4 text-primary-600" />
              </div>
              <p className="text-sm text-slate-600">Unlimited profile views and analytics</p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <Check className="h-4 w-4 text-primary-600" />
              </div>
              <p className="text-sm text-slate-600">Advanced job matching and recommendations</p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <Check className="h-4 w-4 text-primary-600" />
              </div>
              <p className="text-sm text-slate-600">Priority support and profile reviews</p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <Check className="h-4 w-4 text-primary-600" />
              </div>
              <p className="text-sm text-slate-600">Custom themes and advanced customization</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">Pro Plan</span>
              <div className="flex items-center">
                <span className="text-2xl font-bold text-slate-900">$19</span>
                <span className="text-sm text-slate-600 ml-1">/month</span>
              </div>
            </div>
            <p className="text-xs text-slate-600">Billed annually or $29 month-to-month</p>
          </div>

          <div className="space-y-3">
            <Link
              to="/pricing"
              className="w-full bg-gradient-to-r from-primary-500 to-accent-500 text-white font-medium py-3 px-4 rounded-lg hover:shadow-glow transition-all text-center block"
            >
              Upgrade Now
            </Link>
            <button
              onClick={() => window.history.back()}
              className="w-full bg-white border border-primary-200 text-slate-700 font-medium py-3 px-4 rounded-lg hover:bg-primary-50 transition-all"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProPlanGuard;
