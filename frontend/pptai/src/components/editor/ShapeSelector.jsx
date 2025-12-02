import React from "react";

const shapes = [
  { id: "rect", label: "Rectangle" },
  { id: "rounded", label: "Rounded" },
  { id: "pill", label: "Pill" },
  { id: "circle", label: "Circle" },
];

export default function ShapeSelector({ value, onChange }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-md">
      <h3 className="font-semibold text-slate-900 text-sm mb-3">Shapes</h3>
      <div className="flex gap-2">
        {shapes.map((s) => (
          <button
            key={s.id}
            className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all duration-200 ${
              value === s.id
                ? "border-primary-500 bg-primary-50 text-primary-700"
                : "border-gray-300 bg-white text-slate-700 hover:border-primary-300 hover:bg-primary-25"
            }`}
            onClick={() => onChange?.(s.id)}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
