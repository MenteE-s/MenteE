import React, { useState, useEffect, useRef } from "react";
import { pptaiAPI } from "../../utils/api";

function ReviewStep({ plan, onApprove, onReject }) {
  return (
    <div className="review-step">
      <h2>Review Slide Plan</h2>
      <ul>
        {plan.map((slide) => (
          <li key={slide.slide_number}>
            <strong>{slide.title}</strong>: {slide.content_outline}
          </li>
        ))}
      </ul>
      <button onClick={onApprove} className="btn-approve">
        Approve
      </button>
      <button onClick={onReject} className="btn-reject">
        Reject
      </button>
    </div>
  );
}

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
  const [slides, setSlides] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatHistory, setChatHistory] = useState([]);
  const [slidePlan, setSlidePlan] = useState([]);
  const [reviewing, setReviewing] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
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

    // Add to history
    setChatHistory((prev) => {
      return [...prev, newMessage];
    });

    // Generate presentation
    setSlides([]);
    try {
      await pptaiAPI.generatePresentation(
        { topic: inputValue, slide_count: 5, approval: true },
        (slideData) => {
          setSlides((prev) => [...prev, slideData]);
          // Update history
          setChatHistory((prev) =>
            prev.map((chat, idx) =>
              idx === prev.length - 1
                ? { ...chat, slides: [...chat.slides, slideData] }
                : chat
            )
          );
        }
      );
    } catch (error) {
      console.error("Error generating presentation:", error);
      const errorMessage = {
        id: messages.length + 2,
        type: "assistant",
        content:
          "Sorry, there was an error generating your presentation. Please try again.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handleReviewApprove = () => {
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        type: "assistant",
        content: "Great! Let's get started on your presentation.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
    setReviewing(false);
    // Proceed with generating the slides
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div
        className={`bg-white border-r border-gray-200 transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-0"
        } overflow-hidden flex-shrink-0`}
      >
        <div className="p-6 h-full flex flex-col">
          {/* <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-linear-to-r from-[#1d9bf0] to-[#27b96f] rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-glow">
                AI
              </div>
              <div className="text-slate-900 font-bold text-xl">AIppt</div>
            </div>
            <h3 className="text-slate-900 font-semibold text-lg mb-4">
              Settings
            </h3>
            {/* <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Theme</span>
                <select className="bg-gray-100 border border-gray-300 rounded-lg px-3 py-1 text-sm">
                  <option>Light</option>
                  <option>Dark</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Language</span>
                <select className="bg-gray-100 border border-gray-300 rounded-lg px-3 py-1 text-sm">
                  <option>English</option>
                </select>
              </div>
            </div> 
          </div>*/}

          <div className="flex-1 overflow-y-auto">
            <h3 className="text-slate-900 font-semibold text-lg mb-4">
              Chat History
            </h3>
            <ul className="space-y-2">
              {chatHistory &&
                chatHistory.map((chat, idx) => (
                  <li
                    key={idx}
                    className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                  >
                    <p className="text-slate-800 font-medium text-sm truncate">
                      {chat.topic}
                    </p>
                    <p className="text-slate-500 text-xs mt-1">
                      {chat.slides && chat.slides.length} slides
                    </p>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Chat Section */}
      <div className="flex-1 flex flex-col bg-gray-50">
        <div className="bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-slate-600 hover:text-slate-900 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-700 bg-clip-text text-transparent">
              AI Presentation Assistant
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="text-slate-600 hover:text-slate-900 p-2 rounded-lg hover:bg-gray-100 transition-colors">
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </button>
            <button className="text-slate-600 hover:text-slate-900 p-2 rounded-lg hover:bg-gray-100 transition-colors">
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
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                ></path>
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.type === "user" ? "justify-end" : "justify-start"
              } animate-fade-in`}
            >
              <div
                className={`max-w-2xl px-4 py-3 rounded-2xl ${
                  message.type === "user"
                    ? "bg-linear-to-r from-[#1d9bf0] to-[#27b96f] text-white shadow-md"
                    : "bg-white text-slate-800 border border-gray-200"
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                <span
                  className={`text-xs mt-2 block ${
                    message.type === "user" ? "text-white/70" : "text-slate-500"
                  }`}
                >
                  {message.timestamp}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="bg-white border-t border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Describe your presentation idea..."
              className="flex-1 bg-white border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            />
            <button
              type="submit"
              className="bg-linear-to-r from-[#1d9bf0] to-[#27b96f] text-white rounded-xl px-6 py-3 hover:shadow-lg transition-all hover:scale-105 flex items-center justify-center"
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
          </form>
        </div>
      </div>

      {/* Preview Section */}
      <div className="w-1/2 bg-white border-l border-gray-200 flex flex-col">
        <div className="bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Live Preview</h2>
          <div className="flex items-center gap-2">
            <button className="text-slate-600 hover:text-slate-900 p-2 rounded-lg hover:bg-gray-100 transition-colors">
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
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                ></path>
              </svg>
            </button>
            <button className="text-slate-600 hover:text-slate-900 p-2 rounded-lg hover:bg-gray-100 transition-colors">
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
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.032 4.026a9.001 9.001 0 01-7.432 0m9.032-4.026A9.001 9.001 0 0112 3c-4.474 0-8.268 3.12-9.032 7.326m0 0A9.001 9.001 0 0012 21c4.474 0 8.268-3.12 9.032-7.326"
                ></path>
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {slides.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-primary-100 to-accent-100 rounded-2xl flex items-center justify-center">
                  <svg
                    className="w-10 h-10 text-primary-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  No slides yet
                </h3>
                <p className="text-slate-600">
                  Start a conversation to generate your presentation
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {slides.map((slide, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="bg-linear-to-r from-[#1d9bf0] to-[#27b96f] text-white px-4 py-2 text-sm font-medium">
                    Slide {idx + 1}
                  </div>
                  <div
                    className="p-4"
                    dangerouslySetInnerHTML={{ __html: slide.slide }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Review Step */}
      {reviewing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-lg w-full">
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              Review Slide Plan
            </h2>
            <div className="space-y-4">
              {slidePlan.map((slide) => (
                <div
                  key={slide.slide_number}
                  className="p-4 rounded-lg bg-gray-50 border border-gray-200"
                >
                  <h3 className="text-lg font-semibold text-slate-900">
                    {slide.title}
                  </h3>
                  <p className="text-slate-600">{slide.content_outline}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setReviewing(false)}
                className="px-4 py-2 rounded-lg bg-gray-100 text-slate-900 hover:bg-gray-200 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={handleReviewApprove}
                className="px-4 py-2 rounded-lg bg-linear-to-r from-[#1d9bf0] to-[#27b96f] text-white hover:shadow-lg transition-all"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
