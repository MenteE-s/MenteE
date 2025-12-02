import React from "react";

export default function Blog() {
  const blogPosts = [
    {
      title: "10 Tips for Creating Engaging Presentations",
      excerpt:
        "Learn how to capture your audience's attention and keep them engaged throughout your presentation.",
      date: "May 15, 2023",
      readTime: "5 min read",
      image: "presentation-tips",
    },
    {
      title: "The Future of AI in Presentation Design",
      excerpt:
        "Explore how artificial intelligence is revolutionizing the way we create and design presentations.",
      date: "June 2, 2023",
      readTime: "8 min read",
      image: "ai-future",
    },
    {
      title: "How to Use Data Visualization Effectively",
      excerpt:
        "Discover best practices for incorporating charts, graphs, and infographics into your slides.",
      date: "June 20, 2023",
      readTime: "6 min read",
      image: "data-viz",
    },
  ];

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

      <div className="max-w-6xl mx-auto px-6 md:px-10 py-16 relative z-10">
        <div className="text-center animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            <span className="bg-linear-to-r from-[#1d9bf0] to-[#27b96f] bg-clip-text text-transparent">
              Blog
            </span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Insights, tips, and news from the world of presentation design
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <div
              key={index}
              className="bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-2 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="h-48 bg-linear-to-r from-[#1d9bf0] to-[#27b96f] relative overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-br from-primary-400/10 via-transparent to-accent-400/10 pointer-events-none"></div>
                <div className="h-full flex items-center justify-center">
                  <div className="w-20 h-20 bg-linear-to-br from-primary-600 to-accent-700 rounded-xl flex items-center justify-center text-slate-900 font-bold text-xl shadow-md animate-pulse-glow">
                    {post.image.substring(0, 2).toUpperCase()}
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center text-slate-500 text-sm mb-4">
                  <span>{post.date}</span>
                  <span className="mx-2">•</span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3 hover:text-primary-500 transition-colors duration-200">
                  {post.title}
                </h3>
                <p className="text-slate-600 mb-4 leading-relaxed">
                  {post.excerpt}
                </p>
                <a
                  href="#"
                  className="inline-flex items-center text-primary-500 font-medium hover:text-primary-600 transition-colors duration-200"
                >
                  Read more
                  <svg
                    className="w-4 h-4 ml-1 transition-transform duration-200 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    ></path>
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center animate-fade-in">
          <button className="bg-linear-to-r from-[#1d9bf0] to-[#27b96f] text-white px-8 py-3 rounded-xl font-semibold text-base transition-all duration-300 hover:shadow-lg hover:scale-105 shadow-md">
            Load More Articles
          </button>
        </div>
      </div>
    </section>
  );
}
