import React, { useEffect, useState } from "react";
import { getProblems } from "../services/problemService";
import ProblemCard from "../components/ProblemCard";

const DIFFICULTY_OPTIONS = [
  { value: "", label: "All difficulties" },
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];

function ProblemsPage() {
  const [problems, setProblems] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [page, setPage] = useState(1);

  // Debounce search input -> search (300ms), reset to page 1 on change
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Reset to page 1 whenever difficulty changes
  useEffect(() => {
    setPage(1);
  }, [difficulty]);

  useEffect(() => {
    const fetchProblems = async () => {
      setLoading(true);
      setError("");
      try {
        const params = { page, limit: 12 };
        if (search) params.search = search;
        if (difficulty) params.difficulty = difficulty;

        const data = await getProblems(params);
        setProblems(data.problems);
        setPagination(data.pagination);
      } catch (err) {
        setError(
          err?.response?.data?.message || err.message || "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchProblems();
  }, [search, difficulty, page]);

  return (
    <div className="bg-[#0a0a0a] text-[#fafafa] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight">Problems</h1>
        </div>

        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <input
            type="text"
            placeholder="Search problems by title..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="flex-1 bg-[#0a0a0a] border border-gray-800 rounded-md px-4 py-2 text-sm placeholder-gray-500 focus:outline-none focus:border-gray-500 transition-colors"
          />
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="bg-[#0a0a0a] border border-gray-800 rounded-md px-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-gray-500 transition-colors sm:w-48"
          >
            {DIFFICULTY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[#0a0a0a]">
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Content states */}
        {loading && (
          <p className="font-mono text-sm text-gray-500">Loading problems…</p>
        )}

        {!loading && error && (
          <p className="font-mono text-sm text-red-400">{error}</p>
        )}

        {!loading && !error && problems.length === 0 && (
          <p className="font-mono text-sm text-gray-500">
            No problems match your filters.
          </p>
        )}

        {!loading && !error && problems.length > 0 && (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
              {problems.map((problem) => (
                <ProblemCard key={problem._id} problem={problem} />
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-4">
                <button
                  disabled={!pagination.hasPrevPage}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-4 py-1.5 border border-gray-700 rounded-md text-sm hover:border-gray-500 transition-colors disabled:opacity-30 disabled:hover:border-gray-700 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="font-mono text-xs text-gray-400">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  disabled={!pagination.hasNextPage}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-4 py-1.5 border border-gray-700 rounded-md text-sm hover:border-gray-500 transition-colors disabled:opacity-30 disabled:hover:border-gray-700 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ProblemsPage;