import { Link } from "react-router-dom";

const DIFFICULTY_STYLES = {
  easy: "text-green-400 border-green-800/60",
  medium: "text-yellow-400 border-yellow-800/60",
  hard: "text-red-400 border-red-800/60",
};

function UpvoteIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path
        d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// `showProblemTitle` controls whether the linked problem's title appears —
// on the general /community page you're browsing across problems, so it's
// useful context; on a problem-scoped page you already know which problem
// you're looking at, so it'd just be noise.
function CommunityDesignRow({ design, showProblemTitle = false }) {
  const owner = design.ownerId;
  const problem = design.problemId;
  const visibleTags = problem?.tags?.slice(0, 4) || [];
  const extraTagCount = (problem?.tags?.length || 0) - visibleTags.length;

  return (
    <Link
      to={`/community/${design._id}`}
      className="block py-4 border-b border-gray-800 hover:bg-[#111111] transition-colors -mx-4 px-4"
    >
      <div className="flex items-center gap-2 mb-2">
        {owner?.profilePicture ? (
          <img
            src={owner.profilePicture}
            alt={owner.username}
            className="w-5 h-5 rounded-full object-cover"
          />
        ) : (
          <div className="w-5 h-5 rounded-full bg-gray-800 flex items-center justify-center text-[10px] text-gray-400 font-mono">
            {owner?.username?.[0]?.toUpperCase() ?? "?"}
          </div>
        )}
        <span className="text-sm text-gray-400">{owner?.username ?? "Unknown"}</span>
        {problem?.difficulty && (
          <span
            className={`font-mono text-[10px] uppercase tracking-wide border rounded px-1.5 py-0.5 ${
              DIFFICULTY_STYLES[problem.difficulty] || "text-gray-400 border-gray-700"
            }`}
          >
            {problem.difficulty}
          </span>
        )}
      </div>

      <h3 className="font-semibold text-[#fafafa] mb-1">{design.title}</h3>

      {showProblemTitle && problem?.title && (
        <p className="text-xs text-gray-500 mb-2">for {problem.title}</p>
      )}

      {visibleTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {visibleTags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-[11px] text-gray-500 border border-gray-800 rounded px-2 py-0.5"
            >
              {tag}
            </span>
          ))}
          {extraTagCount > 0 && (
            <span className="font-mono text-[11px] text-gray-600 px-1">+{extraTagCount}</span>
          )}
        </div>
      )}

      <div className="flex items-center gap-4 text-gray-500">
        <span className="flex items-center gap-1 text-xs">
          <UpvoteIcon /> {design.upvoteCount ?? 0}
        </span>
        <span className="flex items-center gap-1 text-xs">
          <CommentIcon /> {design.commentCount ?? 0}
        </span>
      </div>
    </Link>
  );
}

export default CommunityDesignRow;