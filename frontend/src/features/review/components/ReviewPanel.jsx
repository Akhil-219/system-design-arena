import { useState } from "react";

const TABS = ["AI Review", "Version History"];

// Docked at the bottom of the canvas column, collapsible, mirroring
// LeetCode's Testcase / Test Result panel. Renders AI review results after
// a save, and version history alongside it.
function ReviewPanel({
  isOpen,
  onToggle,
  review,
  isReviewLoading,
  reviewError,
  versions = [],
  height = 288,
  onResizeStart,
}) {
  const [activeTab, setActiveTab] = useState("AI Review");

  return (
    <div
      className="border-t border-gray-800 bg-[#0a0a0a] flex flex-col shrink-0 relative"
      style={{ height: isOpen ? height : 44 }}
    >
      {/* Drag handle on the top edge — only active while open, since a
          collapsed panel has nothing to resize */}
      {isOpen && (
        <div
          onMouseDown={onResizeStart}
          className="absolute top-0 left-0 w-full h-1.5 -mt-0.5 cursor-row-resize z-10 group"
        >
          <div className="h-px w-full bg-transparent group-hover:bg-gray-600 transition-colors my-auto" />
        </div>
      )}

      <div className="flex items-center justify-between border-b border-gray-800 px-2 shrink-0">
        <div className="flex items-center">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                if (!isOpen) onToggle(true);
              }}
              className={`font-mono text-xs uppercase tracking-wider px-4 py-3 border-b-2 transition-colors ${
                isOpen && activeTab === tab
                  ? "text-white border-white"
                  : "text-gray-500 border-transparent hover:text-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <button
          onClick={() => onToggle(!isOpen)}
          className="px-3 py-2 text-gray-500 hover:text-white font-mono text-xs"
        >
          {isOpen ? "▾" : "▴"}
        </button>
      </div>

      {isOpen && (
        <div className="flex-1 overflow-y-auto p-5">
          {activeTab === "AI Review" && (
            <AiReviewTab review={review} isLoading={isReviewLoading} error={reviewError} />
          )}
          {activeTab === "Version History" && <VersionHistoryTab versions={versions} />}
        </div>
      )}
    </div>
  );
}

function AiReviewTab({ review, isLoading, error }) {
  if (isLoading) {
    return (
      <p className="font-mono text-xs text-gray-500 uppercase tracking-wider">
        Generating review…
      </p>
    );
  }

  if (error) {
    return <p className="text-sm text-gray-400">{error}</p>;
  }

  if (!review) {
    return (
      <p className="font-mono text-xs text-gray-500 uppercase tracking-wider">
        Save a version to get AI feedback on your design.
      </p>
    );
  }

  const verdictStyle =
    {
      pass: "text-green-400 border-green-900",
      borderline: "text-yellow-400 border-yellow-900",
      fail: "text-red-400 border-red-900",
    }[review.verdict] || "text-gray-400 border-gray-800";

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-2xl font-semibold text-white">{review.score}</span>
        <span className="text-gray-600 text-sm">/ 100</span>
        <span className={`font-mono text-xs uppercase tracking-wider border rounded px-2 py-1 ${verdictStyle}`}>
          {review.verdict}
        </span>
        <span className="font-mono text-xs uppercase tracking-wider text-gray-500 ml-auto">
          {review.interviewRating}
        </span>
      </div>

      <p className="text-sm text-gray-300 leading-relaxed">{review.summary}</p>

      {review.improvements?.length > 0 && (
        <section>
          <h4 className="font-mono text-xs uppercase tracking-wider text-gray-500 mb-2">
            Suggested Improvements
          </h4>
          <ul className="space-y-2">
            {review.improvements.map((imp, i) => (
              <li key={i} className="text-sm text-gray-300 flex gap-2">
                <span className="text-gray-600 uppercase text-[10px] font-mono shrink-0 mt-1">
                  {imp.priority}
                </span>
                <span>{imp.suggestion}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function VersionHistoryTab({ versions }) {
  if (versions.length === 0) {
    return (
      <p className="font-mono text-xs text-gray-500 uppercase tracking-wider">
        No versions saved yet.
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {versions.map((v) => (
        <li
          key={v._id}
          className="flex items-center justify-between text-sm text-gray-300 border border-gray-800 rounded-md px-3 py-2"
        >
          <span>Version {v.versionNumber}</span>
          <span className="text-gray-500 text-xs font-mono">
            {new Date(v.createdAt).toLocaleString()}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default ReviewPanel;