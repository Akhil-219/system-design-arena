import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProblems } from "../features/problems/services/problemService";

const steps = [
  { number: "01", title: "Pick a problem", desc: "Choose from real-world system design challenges." },
  { number: "02", title: "Create your design", desc: "Sketch your architecture on the canvas." },
  { number: "03", title: "Get AI review", desc: "Receive structured feedback from an AI architect." },
  { number: "04", title: "Improve iteratively", desc: "Refine your design based on feedback." },
];

function Home() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const { problems } = await getProblems({ limit: 3 });
        setProblems(problems);
      } catch (err) {
        setError("Couldn't load problems right now.");
      } finally {
        setLoading(false);
      }
    };
    fetchProblems();
  }, []);

  return (
    <div className="bg-[#0a0a0a] text-[#fafafa]">
      {/* Hero */}
      <section
        className="relative overflow-hidden border-b border-gray-800 px-4 py-24 sm:py-32"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-mono text-xs tracking-widest text-gray-400 uppercase mb-6">
            Design · Improve · Review
          </p>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight leading-tight">
            Master system design
          </h1>
          <p className="mt-6 text-lg text-gray-400 max-w-2xl mx-auto">
            Practice real-world system design problems. Get AI-powered feedback
            and improve with the community.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link to="/problems" className="px-6 py-3 bg-white text-black font-medium text-sm rounded-md hover:bg-gray-200 transition-colors">
              Start Designing
            </Link>
            <Link to="/problems" className="px-6 py-3 border border-gray-700 text-white font-medium text-sm rounded-md hover:border-gray-500 transition-colors">
              Explore Problems
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Problems */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="text-2xl font-bold tracking-tight">Popular Problems</h2>
          <Link to="/problems" className="text-sm text-gray-400 hover:text-white transition-colors">
            View all →
          </Link>
        </div>

        {loading && <p className="text-sm text-gray-500 font-mono">Loading problems…</p>}
        {error && <p className="text-sm text-gray-500 font-mono">{error}</p>}

        {!loading && !error && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {problems.map((p) => (
              <Link
                to={`/problems/${p.slug}`}
                key={p._id}
                className="border border-gray-800 rounded-lg p-5 hover:border-gray-600 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-base">{p.title}</h3>
                  <span className="font-mono text-[11px] uppercase tracking-wide text-gray-400 border border-gray-700 rounded px-2 py-0.5">
                    {p.difficulty}
                  </span>
                </div>
                <p className="font-mono text-xs text-gray-500">{p.tags.join(" • ")}</p>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* How it works */}
      <section className="border-t border-gray-800 px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold tracking-tight mb-12">How it works</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s) => (
              <div key={s.number}>
                <span className="block font-mono text-4xl font-bold text-gray-800 mb-3">{s.number}</span>
                <h3 className="font-semibold text-base mb-1">{s.title}</h3>
                <p className="text-sm text-gray-400">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;