import React from "react";

const defaultTunes = [
  { id: "minimal", label: "Minimal" },
  { id: "vibrant", label: "Vibrant" },
  { id: "professional", label: "Professional" },
  { id: "playful", label: "Playful" },
];

export default function TunesPanel({ value, onChange }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-md">
      <h3 className="font-semibold text-slate-900 text-sm mb-3">
        Tunes (visual style)
      </h3>
      <div className="flex flex-wrap gap-2">
        {defaultTunes.map((t) => (
          <button
            key={t.id}
            onClick={() => onChange?.(t.id)}
            className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              value === t.id
                ? "bg-primary-600 text-white shadow-md"
                : "bg-gray-100 text-slate-700 hover:bg-primary-100 hover:text-primary-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}
