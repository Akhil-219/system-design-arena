import React, { useEffect, useState } from "react";
import { getProblemBySlug } from "../services/problemService";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const DIFFICULTY_STYLES = {
  easy: "text-green-400 border-green-800/60",
  medium: "text-yellow-400 border-yellow-800/60",
  hard: "text-red-400 border-red-800/60",
};

const TABS = [
  { key: "description", label: "Description" },
  { key: "requirements", label: "Requirements" },
  { key: "constraints", label: "Constraints" },
];

function ProblemDetailsPage() {
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const fetchProblemDetails = async () => {
      setError("");
      setLoading(true);
      try {
        const data = await getProblemBySlug(slug);
        setProblem(data.problem);
      } catch (err) {
        setError(
          err?.response?.data?.message || err.message || "Something went wrong",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProblemDetails();
  }, [slug]);

  const handleStartDesigning = () => {
    if (!user) {
      sessionStorage.setItem("redirectAfterLogin", location.pathname);
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    navigate(`/design/${problem._id}`);
  };

  if (loading) {
    return (
      <div className="bg-[#0a0a0a] text-[#fafafa] min-h-screen">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <p className="font-mono text-sm text-gray-500">
            Loading, please wait…
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#0a0a0a] text-[#fafafa] min-h-screen">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <p className="font-mono text-sm text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  if (problem === null) {
    return (
      <div className="bg-[#0a0a0a] text-[#fafafa] min-h-screen">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <p className="font-mono text-sm text-gray-500">No problem found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0a] text-[#fafafa] min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <button
          onClick={() => navigate("/problems")}
          className="mb-8 font-mono text-xs text-gray-400 hover:text-white transition-colors"
        >
          ← Back to problems
        </button>

        <div className="flex items-start justify-between gap-4 mb-2">
          <h1 className="text-3xl font-bold tracking-tight">{problem.title}</h1>
          <span
            className={`shrink-0 font-mono text-[11px] uppercase tracking-wide border rounded px-2 py-0.5 mt-1 ${
              DIFFICULTY_STYLES[problem.difficulty] ||
              "text-gray-400 border-gray-700"
            }`}
          >
            {problem.difficulty}
          </span>
        </div>

        {typeof problem.designCount === "number" && (
          <p className="font-mono text-xs text-gray-500 mb-8">
            {problem.designCount} design{problem.designCount !== 1 ? "s" : ""}{" "}
            submitted
          </p>
        )}

        {/* Tags */}
        {problem.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-8">
            {problem.tags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-[11px] text-gray-500 border border-gray-800 rounded px-2 py-0.5"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-6 mb-6 border-b border-gray-800">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
                activeTab === tab.key
                  ? "text-white border-white"
                  : "text-gray-500 border-transparent hover:text-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="mb-12 min-h-30">
          {activeTab === "description" && (
            <p className="text-gray-300 leading-relaxed whitespace-pre-line">
              {problem.description}
            </p>
          )}

          {activeTab === "requirements" && (
            <ul className="space-y-2">
              {problem.requirements?.length > 0 ? (
                problem.requirements.map((requirement, index) => (
                  <li key={index} className="flex gap-3 text-gray-300 text-sm">
                    <span className="font-mono text-gray-600 shrink-0">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {requirement}
                  </li>
                ))
              ) : (
                <p className="text-sm text-gray-500 font-mono">
                  No requirements listed.
                </p>
              )}
            </ul>
          )}

          {activeTab === "constraints" && (
            <ul className="space-y-2">
              {problem.constraints?.length > 0 ? (
                problem.constraints.map((constraint, index) => (
                  <li key={index} className="flex gap-3 text-gray-300 text-sm">
                    <span className="font-mono text-gray-600 shrink-0">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {constraint}
                  </li>
                ))
              ) : (
                <p className="text-sm text-gray-500 font-mono">
                  No constraints listed.
                </p>
              )}
            </ul>
          )}
        </div>

        <button
          onClick={handleStartDesigning}
          className="px-6 py-3 bg-white text-black font-medium text-sm rounded-md hover:bg-gray-200 transition-colors"
        >
          Start Designing
        </button>
      </div>
    </div>
  );
}

export default ProblemDetailsPage;
