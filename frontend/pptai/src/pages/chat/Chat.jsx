import React, { useState, useEffect, useRef } from "react";

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "assistant",
      content:
        "Hello! I'm your AI presentation assistant. I can help you create amazing PowerPoint presentations. What would you like to create today?",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      type: "user",
      content: inputValue,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        type: "assistant",
        content: generateAIResponse(inputValue),
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  const generateAIResponse = () => {
    const responses = [
      "That sounds like a great presentation idea! I can help you structure it with compelling slides, add relevant visuals, and ensure a smooth flow. Would you like me to start creating the outline?",
      "Perfect! I suggest we create a presentation with 8-10 slides. We'll start with a strong introduction, followed by key points with supporting visuals, and end with a memorable conclusion. Shall we begin?",
      "Excellent! For this topic, I recommend using a modern design with clean typography and relevant icons. The color scheme could incorporate blues and whites for a professional look. What are your thoughts?",
      "I'd love to help you with that! Let me suggest we break this into digestible sections with engaging slide layouts, data visualizations where appropriate, and a consistent design theme throughout.",
      "Great choice! I can see several ways to approach this. We'll want to capture your audience's attention from the first slide and keep them engaged throughout. Let me start crafting some slide concepts for you.",
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  };

  return (
    <section className="bg-white min-h-screen relative overflow-hidden">
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
        className="absolute bottom-20 right-10 w-40 h-40 bg-accent-500 rounded-full filter blur-3xl opacity-20 animate-float"
        style={{ animationDelay: "2s" }}
      ></div>

      <div className="max-w-6xl mx-auto px-6 md:px-10 py-8 relative z-10 h-screen flex flex-col">
        <div className="text-center mb-6 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
              AI Presentation Assistant
            </span>
          </h1>
          <p className="text-slate-600">
            Chat with our AI to create, edit, and enhance your presentations
          </p>
        </div>

        <div className="flex-1 flex flex-col bg-slate-50/50 backdrop-blur-sm rounded-2xl border border-slate-200 overflow-hidden animate-fade-in-up">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex ${
                  message.type === "user" ? "justify-end" : "justify-start"
                } animate-fade-in`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className={`max-w-3xl px-4 py-3 rounded-2xl ${
                    message.type === "user"
                      ? "bg-gradient-to-r from-primary-600 to-accent-700 text-white"
                      : "bg-white text-slate-800 border border-slate-200"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <span
                    className={`text-xs mt-2 block ${
                      message.type === "user"
                        ? "text-white/70"
                        : "text-slate-500"
                    }`}
                  >
                    {message.timestamp}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={handleSubmit}
            className="p-4 border-t border-slate-200"
          >
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Describe your presentation idea or ask for help..."
                className="flex-1 bg-white text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 border border-slate-200"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-primary-600 to-accent-700 text-white rounded-xl p-3 hover:shadow-glow transition-all duration-200 hover:scale-105"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  ></path>
                </svg>
              </button>
            </div>
          </form>
        </div>

        <div
          className="mt-6 animate-fade-in"
          style={{ animationDelay: "0.5s" }}
        >
          <h3 className="text-slate-900 font-semibold mb-3">Try asking:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              className="bg-white/50 backdrop-blur-sm border border-slate-200 rounded-xl p-3 text-left text-slate-700 hover:border-primary-600 hover:text-primary-600 transition-all duration-200"
              onClick={() =>
                setInputValue(
                  "Create a presentation about renewable energy trends"
                )
              }
            >
              Create a presentation about renewable energy trends
            </button>
            <button
              className="bg-white/50 backdrop-blur-sm border border-slate-200 rounded-xl p-3 text-left text-slate-700 hover:border-primary-600 hover:text-primary-600 transition-all duration-200"
              onClick={() =>
                setInputValue("Help me design slides for a business proposal")
              }
            >
              Help me design slides for a business proposal
            </button>
            <button
              className="bg-white/50 backdrop-blur-sm border border-slate-200 rounded-xl p-3 text-left text-slate-700 hover:border-primary-600 hover:text-primary-600 transition-all duration-200"
              onClick={() =>
                setInputValue("Add more visual elements to my slides")
              }
            >
              Add more visual elements to my slides
            </button>
            <button
              className="bg-white/50 backdrop-blur-sm border border-slate-200 rounded-xl p-3 text-left text-slate-700 hover:border-primary-600 hover:text-primary-600 transition-all duration-200"
              onClick={() =>
                setInputValue("How can I improve my presentation structure?")
              }
            >
              How can I improve my presentation structure?
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
