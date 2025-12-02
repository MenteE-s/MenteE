import React from "react";

export default function Footer() {
  return (
    <footer className="bg-white text-slate-800 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0 bg-grid-pattern"
          style={{ backgroundSize: "40px 40px" }}
        ></div>
      </div>

      <div className="max-w-8xl mx-auto px-6 md:px-10 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-linear-to-r from-[#1d9bf0] to-[#27b96f] rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md animate-pulse-glow">
                AI
              </div>
              <div className="font-bold text-xl text-slate-900">AIppt</div>
            </div>
            <p className="text-slate-700 leading-relaxed">
              AI-powered slide generation platform that helps you create
              beautiful presentations in minutes.
            </p>
            <div className="flex space-x-4 mt-6">
              <a
                href="#"
                aria-label="Twitter"
                className="text-slate-500 hover:text-primary-500 transition-all duration-200 hover:scale-110"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="text-slate-500 hover:text-primary-500 transition-all duration-200 hover:scale-110"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                </svg>
              </a>
              <a
                href="#"
                aria-label="GitHub"
                className="text-slate-500 hover:text-primary-500 transition-all duration-200 hover:scale-110"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"
                  ></path>
                </svg>
              </a>
            </div>
          </div>

          <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <h3 className="text-slate-900 font-bold text-lg mb-4 relative">
              Product
              <span className="absolute -bottom-1 left-0 w-8 h-0.5 bg-linear-to-r from-primary-600 to-accent-700 rounded"></span>
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#features"
                  className="text-slate-600 hover:text-primary-500 transition-all duration-200 hover:translate-x-1 inline-block"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#editor"
                  className="text-slate-600 hover:text-primary-500 transition-all duration-200 hover:translate-x-1 inline-block"
                >
                  Editor
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="text-slate-600 hover:text-primary-500 transition-all duration-200 hover:translate-x-1 inline-block"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#pro"
                  className="text-slate-600 hover:text-primary-500 transition-all duration-200 hover:translate-x-1 inline-block"
                >
                  Pro
                </a>
              </li>
            </ul>
          </div>

          <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <h3 className="text-slate-900 font-bold text-lg mb-4 relative">
              Company
              <span className="absolute -bottom-1 left-0 w-8 h-0.5 bg-linear-to-r from-primary-600 to-accent-700 rounded"></span>
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/about-us"
                  className="text-slate-600 hover:text-primary-500 transition-all duration-200 hover:translate-x-1 inline-block"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/contact-us"
                  className="text-slate-600 hover:text-primary-500 transition-all duration-200 hover:translate-x-1 inline-block"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="#privacy"
                  className="text-slate-600 hover:text-primary-500 transition-all duration-200 hover:translate-x-1 inline-block"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#terms"
                  className="text-slate-600 hover:text-primary-500 transition-all duration-200 hover:translate-x-1 inline-block"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <h3 className="text-slate-900 font-bold text-lg mb-4 relative">
              Contact
              <span className="absolute -bottom-1 left-0 w-8 h-0.5 bg-linear-to-r from-primary-600 to-accent-700 rounded"></span>
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="w-8 h-8 bg-linear-to-br from-primary-600/20 to-accent-700/20 rounded-lg flex items-center justify-center shrink-0">
                  <svg
                    className="w-4 h-4 text-primary-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    ></path>
                  </svg>
                </div>
                <span className="ml-3 text-slate-700">contact@ai-ppt.com</span>
              </li>
              <li className="flex items-start">
                <div className="w-8 h-8 bg-linear-to-br from-primary-600/20 to-accent-700/20 rounded-lg flex items-center justify-center shrink-0">
                  <svg
                    className="w-4 h-4 text-primary-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    ></path>
                  </svg>
                </div>
                <span className="ml-3 text-slate-700">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start">
                <div className="w-8 h-8 bg-linear-to-br from-primary-600/20 to-accent-700/20 rounded-lg flex items-center justify-center shrink-0">
                  <svg
                    className="w-4 h-4 text-primary-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    ></path>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    ></path>
                  </svg>
                </div>
                <span className="ml-3 text-slate-700">
                  123 Innovation Street, Tech City, TC 10001
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div
          className="mt-12 pt-8 border-t border-slate-100 animate-fade-in"
          style={{ animationDelay: "0.4s" }}
        >
          <p className="text-center text-slate-500">
            &copy; {new Date().getFullYear()} AIppt. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
