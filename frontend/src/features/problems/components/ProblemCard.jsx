import React from "react";
import { Link } from "react-router-dom";

const DIFFICULTY_STYLES = {
  easy: "text-green-400 border-green-800/60",
  medium: "text-yellow-400 border-yellow-800/60",
  hard: "text-red-400 border-red-800/60",
};

function ProblemCard({ problem }) {
  const visibleTags = problem.tags?.slice(0, 3) || [];
  const extraTagCount = (problem.tags?.length || 0) - visibleTags.length;

  return (
    <Link
      to={`/problems/${problem.slug}`}
      className="block border border-gray-800 rounded-lg p-5 hover:border-gray-600 transition-colors bg-[#0a0a0a]"
    >
      <div className="flex items-start justify-between mb-3 gap-3">
        <h3 className="font-semibold text-base text-[#fafafa]">
          {problem.title}
        </h3>
        <span
          className={`shrink-0 font-mono text-[11px] uppercase tracking-wide border rounded px-2 py-0.5 ${
            DIFFICULTY_STYLES[problem.difficulty] || "text-gray-400 border-gray-700"
          }`}
        >
          {problem.difficulty}
        </span>
      </div>

      <p className="text-sm text-gray-400 mb-4 line-clamp-2">
        {problem.description}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {visibleTags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-[11px] text-gray-500 border border-gray-800 rounded px-2 py-0.5"
            >
              {tag}
            </span>
          ))}
          {extraTagCount > 0 && (
            <span className="font-mono text-[11px] text-gray-600 px-1">
              +{extraTagCount}
            </span>
          )}
        </div>

        {typeof problem.designCount === "number" && (
          <span className="font-mono text-[11px] text-gray-600 shrink-0">
            {problem.designCount} designs
          </span>
        )}
      </div>
    </Link>
  );
}

export default ProblemCard;