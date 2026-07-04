import { useState } from "react";

function RequirementsPanel({ title, requirements = [], constraints = [] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Toggle button - fixed, always visible over the canvas */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="absolute top-4 right-4 z-20 font-mono text-xs uppercase tracking-wider text-gray-300 bg-[#111111] border border-gray-800 rounded-md px-3 py-2 hover:bg-[#1a1a1a] hover:text-white transition-colors"
      >
        {isOpen ? "Close" : "Requirements"}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/40 z-20"
        />
      )}

      {/* Slide-over panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-[#0a0a0a] border-l border-gray-800 z-30 transform transition-transform duration-300 ease-in-out overflow-y-auto ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white text-lg font-semibold">{title}</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-white transition-colors font-mono text-sm"
            >
              ✕
            </button>
          </div>

          <section className="mb-8">
            <h3 className="font-mono text-xs uppercase tracking-wider text-gray-500 mb-3">
              Requirements
            </h3>
            <ul className="space-y-2">
              {requirements.map((req, i) => (
                <li key={i} className="text-sm text-gray-300 flex gap-2">
                  <span className="text-gray-600">–</span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="font-mono text-xs uppercase tracking-wider text-gray-500 mb-3">
              Constraints
            </h3>
            <ul className="space-y-2">
              {constraints.map((c, i) => (
                <li key={i} className="text-sm text-gray-300 flex gap-2">
                  <span className="text-gray-600">–</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}

export default RequirementsPanel;
