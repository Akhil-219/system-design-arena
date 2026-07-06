import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProblemCommunityDesigns } from "../services/communityService";
import CommunityDesignRow from "../components/CommunityDesignRow";

function ProblemCommunityPage() {
  const { problemId } = useParams();
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDesigns = async () => {
      setLoading(true);
      setError("");
      try {
        const fetched = await getProblemCommunityDesigns(problemId);
        setDesigns(fetched);
      } catch (err) {
        setError(err?.response?.data?.message || err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchDesigns();
  }, [problemId]);

  return (
    <div className="bg-[#0a0a0a] text-[#fafafa] min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link
            to={`/problems/${problemId}`}
            className="font-mono text-xs uppercase tracking-wider text-gray-500 hover:text-white transition-colors"
          >
            ← Back to problem
          </Link>
          <h1 className="text-3xl font-bold tracking-tight mt-3">Community Designs</h1>
        </div>

        {loading && <p className="font-mono text-sm text-gray-500">Loading designs…</p>}

        {!loading && error && <p className="font-mono text-sm text-red-400">{error}</p>}

        {!loading && !error && designs.length === 0 && (
          <p className="font-mono text-sm text-gray-500">
            No one has published a design for this problem yet.
          </p>
        )}

        {!loading && !error && designs.length > 0 && (
          <div>
            {designs.map((design) => (
              <CommunityDesignRow key={design._id} design={design} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProblemCommunityPage;