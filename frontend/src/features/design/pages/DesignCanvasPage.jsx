import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ReactFlowProvider } from "reactflow";

import Canvas from "../components/Canvas";
import NodePalette from "../components/NodePalette";
import RequirementsPanel from "../components/RequirementsPanel";
import { useCanvas } from "../hooks/useCanvas";
import {
  startDesign,
  updateDesign,
  createVersionSnapshot,
} from "../services/designService";

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

  return (
    <DesignCanvasContent design={design} isLoading={isLoading} error={error} />
  );
}

// Split out so useCanvas (which needs draftDiagramData up front) only
// mounts once the design has actually loaded.
function DesignCanvasContent({ design, isLoading, error }) {
  const canvas = useCanvas(design?.draftDiagramData);
  const [saveState, setSaveState] = useState("idle"); // idle | saving | saved | no-changes | error

  const handleSave = async () => {
    if (!design?._id) return;
    setSaveState("saving");
    try {
      // Step 1: persist current canvas state as the draft
      await updateDesign(design._id, {
        diagramData: { nodes: canvas.nodes, edges: canvas.edges },
        notes: design.draftNotes ?? "",
      });
      // Step 2: try to snapshot it as a new Version (backend dedupes)
      await createVersionSnapshot(design._id);
      setSaveState("saved");
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

  const problem = design?.problemId; // populated Problem doc

  return (
    <ReactFlowProvider>
      <div className="relative w-full h-screen">
        <Canvas
          nodes={canvas.nodes}
          edges={canvas.edges}
          onNodesChange={canvas.onNodesChange}
          onEdgesChange={canvas.onEdgesChange}
          onConnect={canvas.onConnect}
        />
        <NodePalette onAddNode={canvas.addNode} />

        <button
          onClick={handleSave}
          disabled={saveState === "saving"}
          className="absolute bottom-4 left-4 z-10 font-mono text-xs uppercase tracking-wider text-gray-300 bg-[#111111] border border-gray-800 rounded-md px-4 py-2 hover:bg-[#1a1a1a] hover:text-white transition-colors disabled:opacity-50"
        >
          {saveState === "saving" && "Saving…"}
          {saveState === "saved" && "Saved ✓"}
          {saveState === "no-changes" && "No changes"}
          {saveState === "error" && "Save failed"}
          {saveState === "idle" && "Save"}
        </button>

        <RequirementsPanel
          title={problem?.title ?? "Untitled Problem"}
          requirements={problem?.requirements ?? []}
          constraints={problem?.constraints ?? []}
        />
      </div>
    </ReactFlowProvider>
  );
}

export default DesignCanvasPage;
