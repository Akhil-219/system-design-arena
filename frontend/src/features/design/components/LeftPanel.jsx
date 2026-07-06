import { useState, useEffect } from "react";
import { getProblemCommunityDesigns } from "../../community/services/communityService";
import CommunityDesignRow from "../../community/components/CommunityDesignRow";

const TABS = ["Description", "Requirements", "Constraints", "Notes", "Community"];

// Replaces the old slide-over RequirementsPanel. Docked permanently on the
// left, tabbed like LeetCode's Description/Solutions split, instead of
// overlaying the canvas.
function LeftPanel({
  problemId,
  title,
  description,
  requirements = [],
  constraints = [],
  notes,
  onNotesChange,
}) {
  const [activeTab, setActiveTab] = useState("Description");

  const [communityDesigns, setCommunityDesigns] = useState([]);
  const [isCommunityLoading, setIsCommunityLoading] = useState(false);
  const [communityError, setCommunityError] = useState(null);
  const [hasFetchedCommunity, setHasFetchedCommunity] = useState(false);

  useEffect(() => {
    if (activeTab !== "Community" || hasFetchedCommunity) return;

    const fetchCommunityDesigns = async () => {
      setIsCommunityLoading(true);
      setCommunityError(null);
      try {
        const designs = await getProblemCommunityDesigns(problemId);
        setCommunityDesigns(designs);
      } catch (err) {
        setCommunityError(
          err?.response?.data?.message || "Couldn't load community designs."
        );
      } finally {
        setIsCommunityLoading(false);
        setHasFetchedCommunity(true);
      }
    };

    fetchCommunityDesigns();
  }, [activeTab, hasFetchedCommunity, problemId]);

  return (
    <div className="h-full w-full flex flex-col bg-[#0a0a0a] border-r border-gray-800">
      <div className="flex items-center border-b border-gray-800 px-2 overflow-x-auto shrink-0">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`font-mono text-xs uppercase tracking-wider px-4 py-3 whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab
                ? "text-white border-white"
                : "text-gray-500 border-transparent hover:text-gray-300"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === "Description" && (
          <div>
            <h2 className="text-white text-lg font-semibold mb-4">{title}</h2>
            <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
              {description || "No description provided."}
            </p>
          </div>
        )}

        {activeTab === "Requirements" && (
          <section>
            <h3 className="font-mono text-xs uppercase tracking-wider text-gray-500 mb-3">
              Requirements
            </h3>
            {requirements.length === 0 ? (
              <p className="text-sm text-gray-500">No requirements listed.</p>
            ) : (
              <ul className="space-y-2">
                {requirements.map((req, i) => (
                  <li key={i} className="text-sm text-gray-300 flex gap-2">
                    <span className="text-gray-600">–</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {activeTab === "Constraints" && (
          <section>
            <h3 className="font-mono text-xs uppercase tracking-wider text-gray-500 mb-3">
              Constraints
            </h3>
            {constraints.length === 0 ? (
              <p className="text-sm text-gray-500">No constraints listed.</p>
            ) : (
              <ul className="space-y-2">
                {constraints.map((c, i) => (
                  <li key={i} className="text-sm text-gray-300 flex gap-2">
                    <span className="text-gray-600">–</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {activeTab === "Notes" && (
          <div className="h-full flex flex-col">
            <h3 className="font-mono text-xs uppercase tracking-wider text-gray-500 mb-2">
              Design Notes
            </h3>
            <p className="text-xs text-gray-500 mb-3 leading-relaxed">
              Explain your assumptions, data flow, and why you chose each
              component. The AI review weighs this heavily — a diagram alone
              isn't enough to demonstrate your reasoning.
            </p>
            <textarea
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
              placeholder="e.g. Client requests hit an NGINX load balancer, which routes to a pool of stateless API servers. Writes go through a Kafka queue to decouple ingestion from processing..."
              className="flex-1 min-h-[240px] w-full bg-[#111111] border border-gray-800 rounded-md p-3 text-sm text-gray-200 placeholder:text-gray-600 resize-none outline-none focus:border-gray-600"
            />
          </div>
        )}

        {activeTab === "Community" && (
          <div>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              See how other users approached this problem, and leave feedback
              on their designs.
            </p>

            {isCommunityLoading && (
              <p className="font-mono text-xs text-gray-500 uppercase tracking-wider">
                Loading designs…
              </p>
            )}

            {!isCommunityLoading && communityError && (
              <p className="text-sm text-red-400">{communityError}</p>
            )}

            {!isCommunityLoading && !communityError && communityDesigns.length === 0 && (
              <p className="font-mono text-xs text-gray-500 uppercase tracking-wider">
                No one has published a design for this problem yet.
              </p>
            )}

            {!isCommunityLoading && !communityError && communityDesigns.length > 0 && (
              <div>
                {communityDesigns.map((design) => (
                  <CommunityDesignRow key={design._id} design={design} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default LeftPanel;