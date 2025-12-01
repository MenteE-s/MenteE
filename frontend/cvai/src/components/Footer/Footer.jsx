import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-white/20 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="text-lg font-display font-bold text-accent-600">
                MenteE
              </div>
              <span className="text-secondary-400">/</span>
              <div className="text-xl font-display font-bold text-primary-600">
                cvAI
              </div>
            </div>
            <p className="text-slate-600 text-sm">
              Empowering careers through AI-driven recruitment.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/"
                  className="text-slate-600 hover:text-primary-600 transition"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-slate-600 hover:text-primary-600 transition"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-slate-600 hover:text-primary-600 transition"
                >
                  Updates
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/"
                  className="text-slate-600 hover:text-primary-600 transition"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-slate-600 hover:text-primary-600 transition"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-slate-600 hover:text-primary-600 transition"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/"
                  className="text-slate-600 hover:text-primary-600 transition"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-slate-600 hover:text-primary-600 transition"
                >
                  Terms
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-slate-600 hover:text-primary-600 transition"
                >
                  Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-slate-600 text-sm">
            © {currentYear} cvAI and all related products are trademarks of
            MenteE. All rights reserved.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a
              href="https://twitter.com"
              rel="noopener noreferrer"
              target="_blank"
              className="text-slate-600 hover:text-primary-600 transition"
            >
              Twitter
            </a>
            <a
              href="https://linkedin.com"
              rel="noopener noreferrer"
              target="_blank"
              className="text-slate-600 hover:text-primary-600 transition"
            >
              LinkedIn
            </a>
            <a
              href="https://github.com"
              rel="noopener noreferrer"
              target="_blank"
              className="text-slate-600 hover:text-primary-600 transition"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
