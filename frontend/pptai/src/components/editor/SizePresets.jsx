import React from "react";

const presets = [
  { id: "16-9", label: "16:9 (Widescreen)" },
  { id: "4-3", label: "4:3 (Classic)" },
  { id: "square", label: "1:1 (Square)" },
  { id: "story", label: "9:16 (Story)" },
];

export default function SizePresets({ value, onChange }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-md">
      <h3 className="font-semibold text-slate-900 text-sm mb-3">
        Size presets
      </h3>
      <div className="space-y-2">
        {presets.map((p) => (
          <button
            key={p.id}
            onClick={() => onChange?.(p.id)}
            className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
              value === p.id
                ? "border-primary-500 bg-primary-50 text-primary-700"
                : "border-gray-300 bg-white text-slate-700 hover:border-primary-300 hover:bg-primary-25"
            }`}
          >
            <div className="font-medium text-sm">{p.label}</div>
            <div className="text-xs text-slate-500 mt-1">
              Preset: {p.id.replace("-", ":")}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
