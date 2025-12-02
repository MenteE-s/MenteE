import React, { useState } from "react";
import ShapeSelector from "./ShapeSelector";
import SizePresets from "./SizePresets";
import TunesPanel from "./TunesPanel";

export default function SlidesEditor() {
  const [shape, setShape] = useState("rounded");
  const [size, setSize] = useState("16-9");
  const [tune, setTune] = useState("minimal");

  return (
    <section id="editor" className="max-w-6xl mx-auto px-6 md:px-10 py-12">
      <h2 className="text-2xl font-semibold text-slate-900 mb-4">
        Slides editor — live preview
      </h2>

      <div className="grid md:grid-cols-3 gap-6 items-start">
        <div className="md:col-span-2">
          <div className="bg-white border border-gray-200 rounded-2xl h-72 flex items-center justify-center shadow-lg">
            <div className="w-10/12 h-5/6 flex items-center justify-center rounded-xl bg-gradient-to-br from-primary-50 to-accent-50 border border-primary-100">
              <div className="w-5/6 h-5/6 flex items-center justify-center rounded-lg bg-white border border-gray-200 shadow-inner">
                <div className="text-slate-500 text-center">
                  <div className="text-lg font-semibold text-slate-900 mb-2">
                    Preview
                  </div>
                  <div className="text-sm">
                    size {size} • {shape} • {tune}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-md">
              <div className="text-slate-900 font-medium mb-2">
                Slide outline / layers
              </div>
              <div className="text-slate-500 text-sm">
                Manage your slide structure
              </div>
            </div>
            <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-md">
              <div className="text-slate-900 font-medium mb-2">
                AI suggestions / RAG input
              </div>
              <div className="text-slate-500 text-sm">
                Get intelligent recommendations
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <ShapeSelector value={shape} onChange={setShape} />
          <SizePresets value={size} onChange={setSize} />
          <TunesPanel value={tune} onChange={setTune} />
        </aside>
      </div>
    </section>
  );
}
