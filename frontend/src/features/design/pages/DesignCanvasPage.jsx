import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ReactFlowProvider } from "reactflow";

import Canvas from "../components/Canvas";
import NodePalette from "../components/NodePalette";
import LeftPanel from "../components/LeftPanel";
import ReviewPanel from "../../review/components/ReviewPanel";
import AiMentorButton from "../../mentor/components/AiMentorButton";
import { useCanvas } from "../hooks/useCanvas";
import { useResizable } from "../hooks/useResizable";
import {
  startDesign,
  updateDesign,
  createVersionSnapshot,
} from "../services/designService";
import { generateReview } from "../../review/services/aiReviewService";
import { getAllVersions } from "../services/versionService";
import { publishDesign } from "../../community/services/communityService";

function DesignCanvasPage() {
  const { problemId } = useParams();
  const [design, setDesign] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        setIsLoading(true);
        const fetchedDesign = await startDesign(problemId);
        if (isMounted) setDesign(fetchedDesign);
      } catch (err) {
        if (isMounted) setError(err?.response?.data?.message || "Failed to load design");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, [problemId]);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-[#0a0a0a]">
        <span className="font-mono text-sm text-gray-500">Loading canvas…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-[#0a0a0a]">
        <span className="font-mono text-sm text-gray-500">{error}</span>
      </div>
    );
  }

  return <DesignCanvasContent design={design} problemId={problemId} />;
}

// Split out so useCanvas (which needs draftDiagramData up front) only
// mounts once the design has actually loaded.
function DesignCanvasContent({ design, problemId }) {
  const navigate = useNavigate();
  const canvas = useCanvas(design?.draftDiagramData);
  const [notes, setNotes] = useState(design?.draftNotes ?? "");
  const [saveState, setSaveState] = useState("idle"); // idle | saving | saved | no-changes | error
  const [publishState, setPublishState] = useState("idle"); // idle | publishing | published | error

  const [isReviewPanelOpen, setIsReviewPanelOpen] = useState(false);
  const [review, setReview] = useState(null);
  const [isReviewLoading, setIsReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState(null);
  const [versions, setVersions] = useState([]);

  const leftPanel = useResizable({ axis: "x", initialSize: 380, min: 280, max: 640 });
  const reviewPanel = useResizable({ axis: "y", initialSize: 288, min: 44, max: 560 });

  const refreshVersions = useCallback(async () => {
    if (!design?._id) return;
    try {
      const fetchedVersions = await getAllVersions(design._id);
      setVersions(fetchedVersions);
    } catch {
      // Version history is a nice-to-have here — a failed fetch shouldn't
      // block the save flow, so we swallow it silently.
    }
  }, [design?._id]);

  useEffect(() => {
    refreshVersions();
  }, [refreshVersions]);

  const handleSave = async () => {
    if (!design?._id) return;
    setSaveState("saving");
    try {
      // Step 1: persist current canvas state as the draft
      await updateDesign(design._id, {
        diagramData: { nodes: canvas.nodes, edges: canvas.edges },
        notes,
      });

      // Step 2: try to snapshot it as a new Version (backend dedupes)
      const version = await createVersionSnapshot(design._id);
      setSaveState("saved");
      refreshVersions();

      // Step 3: kick off an AI review of the new version
      setIsReviewPanelOpen(true);
      setIsReviewLoading(true);
      setReviewError(null);
      try {
        const newReview = await generateReview(design._id, version._id);
        setReview(newReview);
      } catch (reviewErr) {
        setReviewError(
          reviewErr?.response?.data?.message || "Couldn't generate a review for this version."
        );
      } finally {
        setIsReviewLoading(false);
      }
    } catch (err) {
      // "No changes detected since last snapshot" is a 400 but not a real error
      if (err?.response?.status === 400) {
        setSaveState("no-changes");
      } else {
        setSaveState("error");
      }
    } finally {
      setTimeout(() => setSaveState("idle"), 2000);
    }
  };

  const handlePublish = async () => {
    if (!design?._id) return;

    // Publishing needs a saved version to point at — use the most recent
    // one from what we already have loaded.
    const latestVersion = versions.reduce(
      (latest, v) => (!latest || v.versionNumber > latest.versionNumber ? v : latest),
      null
    );

    if (!latestVersion) {
      setPublishState("error");
      setTimeout(() => setPublishState("idle"), 2500);
      return;
    }

    setPublishState("publishing");
    try {
      await publishDesign(design._id, latestVersion._id);
      setPublishState("published");
    } catch {
      setPublishState("error");
    } finally {
      setTimeout(() => setPublishState("idle"), 2000);
    }
  };

  const problem = design?.problemId; // populated Problem doc

  return (
    <ReactFlowProvider>
      <div className="w-full h-screen flex flex-col bg-[#0a0a0a]">
        {/* Header toolbar */}
        <header className="flex items-center justify-between border-b border-gray-800 px-4 py-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => navigate(`/problems`)}
              className="font-mono text-xs uppercase tracking-wider text-gray-400 hover:text-white transition-colors shrink-0"
            >
              ← Back
            </button>
            <h1 className="text-sm text-white font-medium truncate">
              {problem?.title ?? "Untitled Problem"}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePublish}
              disabled={publishState === "publishing"}
              className="font-mono text-xs uppercase tracking-wider text-gray-300 border border-gray-800 rounded-md px-4 py-2 hover:bg-[#1a1a1a] hover:text-white transition-colors disabled:opacity-50"
            >
              {publishState === "publishing" && "Publishing…"}
              {publishState === "published" && "Published ✓"}
              {publishState === "error" && "Publish failed"}
              {publishState === "idle" && "Publish"}
            </button>
            <button
              onClick={handleSave}
              disabled={saveState === "saving"}
              className="font-mono text-xs uppercase tracking-wider text-black bg-white rounded-md px-4 py-2 hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              {saveState === "saving" && "Saving…"}
              {saveState === "saved" && "Saved ✓"}
              {saveState === "no-changes" && "No changes"}
              {saveState === "error" && "Save failed"}
              {saveState === "idle" && "Save"}
            </button>
          </div>
        </header>

        {/* Body: left panel + right column */}
        <div className="flex-1 flex overflow-hidden">
          <div className="shrink-0 h-full relative" style={{ width: leftPanel.size }}>
            <LeftPanel
              problemId={problemId}
              title={problem?.title ?? "Untitled Problem"}
              description={problem?.description}
              requirements={problem?.requirements ?? []}
              constraints={problem?.constraints ?? []}
              notes={notes}
              onNotesChange={setNotes}
            />
            {/* Drag handle: hover/active feedback via a thin highlight, wide
                invisible hit-area so it's easy to grab */}
            <div
              onMouseDown={leftPanel.onMouseDown}
              className="absolute top-0 right-0 h-full w-1.5 -mr-0.5 cursor-col-resize z-10 group"
            >
              <div className="w-px h-full bg-transparent group-hover:bg-gray-600 transition-colors mx-auto" />
            </div>
          </div>

          <div className="flex-1 flex flex-col min-w-0">
            <div className="relative flex-1 min-h-0">
              <Canvas
                nodes={canvas.nodes}
                edges={canvas.edges}
                onNodesChange={canvas.onNodesChange}
                onEdgesChange={canvas.onEdgesChange}
                onConnect={canvas.onConnect}
                onNodeLabelChange={canvas.updateNodeLabel}
              />
              <NodePalette onAddNode={canvas.addNode} />
              <AiMentorButton problemId={problemId} />
            </div>

            <ReviewPanel
              isOpen={isReviewPanelOpen}
              onToggle={setIsReviewPanelOpen}
              review={review}
              isReviewLoading={isReviewLoading}
              reviewError={reviewError}
              versions={versions}
              height={reviewPanel.size}
              onResizeStart={reviewPanel.onMouseDown}
            />
          </div>
        </div>
      </div>
    </ReactFlowProvider>
  );
}

export default DesignCanvasPage;