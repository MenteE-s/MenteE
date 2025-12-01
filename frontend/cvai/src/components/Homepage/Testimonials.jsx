import React, { useState, useEffect, useRef } from "react";

const Testimonials = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const testimonials = [
    {
      name: "Nina Patel",
      role: "Product Designer",
      company: "DesignCo",
      image:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?&auto=format&fit=crop&w=687&q=80",
      content:
        "CVAI helped me refactor my resume to get noticed. I used the interview practice and nailed my job offer.",
      gradient: "from-primary-400 to-accent-400",
      achievement: "Landed Product Role",
    },
    {
      name: "Samir Khan",
      role: "Data Analyst",
      company: "Analytics LLC",
      image:
        "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?&auto=format&fit=crop&w=687&q=80",
      content:
        "The detailed feedback and resume scoring gave me clear next steps — I improved my technical interviews in 2 weeks.",
      gradient: "from-accent-500 to-primary-500",
      achievement: "Passed Tech Interviews",
    },
    {
      name: "Chloe Brown",
      role: "Software Engineer",
      company: "CloudWorks",
      image:
        "https://images.unsplash.com/photo-1545996124-7b6b6f45e5f2?&auto=format&fit=crop&w=687&q=80",
      content:
        "I switched careers smoothly — CVAI’s templates and mock interviews made the process much easier.",
      gradient: "from-primary-500 to-accent-600",
      achievement: "Career Pivot",
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, [testimonials.length]);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className="py-20 bg-gradient-to-br from-white via-yellow-50 to-purple-50 relative overflow-hidden"
    >
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-primary-400 to-accent-400 rounded-full animate-float blur-xl opacity-20"></div>
        <div className="absolute top-20 right-20 w-40 h-40 bg-gradient-to-r from-accent-400 to-primary-400 rounded-full animate-bounce-slow blur-xl opacity-15"></div>
        <div className="absolute bottom-10 left-20 w-24 h-24 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full animate-ping-slow blur-xl opacity-10"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`text-center mb-16 ${
            isVisible ? "animate-fade-in-up" : "opacity-0"
          }`}
        >
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-100 to-accent-100 border border-primary-200 rounded-full text-sm font-medium text-primary-700 mb-6 animate-shimmer relative overflow-hidden">
            <span className="relative">💬 What our users say</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Users love CVAI
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            From resume builders to interview practice, candidates are closing
            offers faster.
          </p>
        </div>

        <div
          className={`mb-16 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}
          style={{ animationDelay: "0.2s" }}
        >
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl border border-primary-200 relative overflow-hidden">
              <div
                className={`absolute inset-0 bg-gradient-to-br ${testimonials[activeTestimonial].gradient} opacity-5`}
              ></div>

              <div className="relative z-10">
                <blockquote className="text-xl md:text-2xl text-slate-700 leading-relaxed mb-8 font-medium">
                  "{testimonials[activeTestimonial].content}"
                </blockquote>
                <div className="flex items-center justify-center space-x-4">
                  <img
                    className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
                    src={testimonials[activeTestimonial].image}
                    alt={testimonials[activeTestimonial].name}
                  />
                  <div className="text-left">
                    <div className="font-bold text-slate-900 text-lg">
                      {testimonials[activeTestimonial].name}
                    </div>
                    <div className="text-slate-600">
                      {testimonials[activeTestimonial].role}
                    </div>
                    <div className="text-primary-600 font-medium">
                      {testimonials[activeTestimonial].company}
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <span
                    className={`inline-flex items-center px-4 py-2 bg-gradient-to-r ${testimonials[activeTestimonial].gradient} text-white rounded-full text-sm font-medium shadow-lg`}
                  >
                    🎉 {testimonials[activeTestimonial].achievement}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-8 space-x-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === activeTestimonial
                      ? "bg-gradient-to-r from-primary-500 to-accent-500 transform scale-125"
                      : "bg-slate-300 hover:bg-slate-400"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
