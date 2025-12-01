import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Animated404 = () => {
  // Simply display 404 without animation

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4 text-center relative overflow-hidden">
      {/* Background animated 404 numbers */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute text-gray-900 opacity-40 font-bold select-none"
            style={{
              fontSize: `${Math.random() * 100 + 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              transform: `rotate(${Math.random() * 360}deg)`,
              animation: `float ${Math.random() * 20 + 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          >
            {Math.random() > 0.5 ? "4" : "0"}
          </div>
        ))}
      </div>

      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden p-8 md:p-12 relative z-10">
        {/* Animated 404 */}
        <div className="relative h-40 mb-8 flex items-center justify-center overflow-hidden">
          {/* Digits */}
          <div className="absolute inset-0 flex items-center justify-center space-x-4 md:space-x-8">
            <div className="relative w-16 h-20 md:w-24 md:h-28 flex items-center justify-center bg-gray-100 rounded-lg border-2 border-gray-200 shadow-inner overflow-hidden">
              <div className="text-4xl md:text-6xl font-bold text-gray-700">
                4
              </div>
            </div>
            <div className="relative w-16 h-20 md:w-24 md:h-28 flex items-center justify-center bg-gray-100 rounded-lg border-2 border-gray-200 shadow-inner overflow-hidden">
              <div className="text-4xl md:text-6xl font-bold text-gray-700">
                0
              </div>
            </div>
            <div className="relative w-16 h-20 md:w-24 md:h-28 flex items-center justify-center bg-gray-100 rounded-lg border-2 border-gray-200 shadow-inner overflow-hidden">
              <div className="text-4xl md:text-6xl font-bold text-gray-700">
                4
              </div>
            </div>
          </div>

          {/* Decorative dots */}
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="absolute w-3 h-3 bg-primary-400 rounded-full animate-ping"
              style={{
                left: `${30 + i * 35}%`,
                top: `${40 + Math.sin(Date.now() / 1000 + i) * 10}%`,
                animationDelay: `${i * 0.3}s`,
              }}
            />
          ))}
        </div>

        {/* Message */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Oops! Page Not Found
        </h1>
        <p className="text-gray-600 mb-8 text-lg">
          The page you're looking for seems to have wandered off into the
          digital void.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-medium py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Go to Homepage</span>
          </Link>

          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 font-medium py-3 px-6 rounded-lg hover:bg-gray-50 hover:border-gray-400 shadow-sm hover:shadow transition-all duration-300"
          >
            <ArrowLeft className="h-5 w-5 rotate-180" />
            <span>Go Back</span>
          </button>
        </div>

        {/* Decorative elements */}
        <div className="mt-10 flex justify-center gap-2 md:gap-4">
          <div
            className="w-3 h-3 rounded-full bg-primary-200 animate-bounce"
            style={{ animationDelay: "0.1s" }}
          />
          <div
            className="w-3 h-3 rounded-full bg-primary-300 animate-bounce"
            style={{ animationDelay: "0.2s" }}
          />
          <div
            className="w-3 h-3 rounded-full bg-primary-400 animate-bounce"
            style={{ animationDelay: "0.3s" }}
          />
        </div>
      </div>
    </div>
  );
};

export default Animated404;
