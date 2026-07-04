import { useState } from "react";

// Floating, persistent across all tabs — mentorship should be reachable
// while actively designing, not buried in a tab. Chat wiring is stubbed
// until the AI mentor service exists.
function AiMentorButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="absolute bottom-4 right-4 z-20 font-mono text-xs uppercase tracking-wider text-black bg-white rounded-full px-4 py-3 shadow-lg hover:bg-gray-200 transition-colors"
      >
        Ask AI Mentor
      </button>

      {isOpen && (
        <div className="absolute bottom-20 right-4 z-30 w-80 h-96 bg-[#111111] border border-gray-800 rounded-lg flex flex-col shadow-xl">
          <div className="flex items-center justify-between border-b border-gray-800 px-4 py-3 shrink-0">
            <span className="font-mono text-xs uppercase tracking-wider text-gray-300">
              AI Mentor
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-white font-mono text-sm"
            >
              ✕
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center p-4">
            {/* TODO: wire up to the real AI mentor chat endpoint */}
            <p className="text-xs text-gray-500 text-center font-mono uppercase tracking-wider">
              Chat coming soon
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default AiMentorButton;