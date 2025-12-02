import React, { useState } from "react";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, you would send this data to your backend
    console.log("Form submitted:", formData);
    alert("Thank you for your message! We'll get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

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
            <span className="bg-linear-to-r from-[#1d9bf0] to-[#27b96f] bg-clip-text text-transparent">
              Contact Us
            </span>
          </h1>
          <p className="mt-4 text-xl max-w-3xl mx-auto text-slate-600">
            Have questions or feedback? We'd love to hear from you.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="animate-fade-in-up">
            <form
              onSubmit={handleSubmit}
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-slate-200"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-white text-slate-900 rounded-xl px-4 py-3 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-white text-slate-900 rounded-xl px-4 py-3 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full bg-white text-slate-900 rounded-xl px-4 py-3 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                  placeholder="What is this regarding?"
                />
              </div>

              <div className="mt-6">
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  className="w-full bg-white text-slate-900 rounded-xl px-4 py-3 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                  placeholder="Your message here..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="mt-8 w-full bg-linear-to-r from-[#1d9bf0] to-[#27b96f] text-white px-8 py-3 rounded-xl font-semibold text-base transition-all duration-300 hover:shadow-lg hover:scale-105 shadow-md"
              >
                Send Message
              </button>
            </form>
          </div>

          <div
            className="animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Get in Touch
              </h2>
              <p className="mt-4 text-slate-600 leading-relaxed">
                Our team is ready to assist you with any questions about our
                AI-powered presentation platform.
              </p>

              <div className="mt-8 space-y-6">
                <div className="flex">
                  <div className="w-12 h-12 bg-linear-to-r from-[#1d9bf0] to-[#27b96f] rounded-xl flex items-center justify-center shrink-0">
                    <svg
                      className="w-6 h-6 text-primary-500"
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
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-slate-900">
                      Email
                    </h3>
                    <p className="text-slate-500">contact@ai-ppt.com</p>
                    <p className="text-slate-500">support@ai-ppt.com</p>
                  </div>
                </div>

                <div className="flex">
                  <div className="w-12 h-12 bg-linear-to-r from-[#1d9bf0] to-[#27b96f] rounded-xl flex items-center justify-center shrink-0">
                    <svg
                      className="w-6 h-6 text-primary-500"
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
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-slate-900">
                      Phone
                    </h3>
                    <p className="text-slate-500">+1 (555) 123-4567</p>
                    <p className="text-slate-500">+1 (555) 987-6543</p>
                  </div>
                </div>

                <div className="flex">
                  <div className="w-12 h-12 bg-linear-to-r from-[#1d9bf0] to-[#27b96f] rounded-xl flex items-center justify-center shrink-0">
                    <svg
                      className="w-6 h-6 text-primary-500"
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
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-slate-900">
                      Office
                    </h3>
                    <p className="text-slate-500">123 Innovation Street</p>
                    <p className="text-slate-500">Tech City, TC 10001</p>
                  </div>
                </div>
              </div>

              <div className="mt-12 p-6 rounded-xl bg-slate-50 border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Our Location
                </h3>
                <div className="mt-4 w-full h-64 rounded-lg bg-linear-to-br from-primary-400/10 to-accent-400/10 border border-slate-300 relative overflow-hidden">
                  <div className="absolute inset-0 bg-linear-to-br from-primary-400/5 via-transparent to-accent-400/5 pointer-events-none"></div>
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-3 bg-linear-to-r from-[#1d9bf0] to-[#27b96f] rounded-full flex items-center justify-center animate-pulse-glow">
                        <svg
                          className="w-8 h-8 text-slate-900"
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
                      <span className="text-slate-900 text-lg font-medium">
                        Interactive Map
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
