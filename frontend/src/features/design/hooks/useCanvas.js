import { useState, useCallback } from "react";
import { applyEdgeChanges, applyNodeChanges } from "reactflow";

const DEFAULT_NODE = {
  id: "1",
  position: { x: 100, y: 100 },
  data: { label: "Client" },
  type: "default",
};

// draftDiagramData shape (from Design.draftDiagramData, a plain Object in the schema):
// { nodes: [...], edges: [...] }
// Falls back to a single starter node if there's no saved draft yet.
export function useCanvas(draftDiagramData) {
  const [nodes, setNodes] = useState(
    draftDiagramData?.nodes?.length ? draftDiagramData.nodes : [DEFAULT_NODE]
  );
  const [edges, setEdges] = useState(draftDiagramData?.edges ?? []);

  const onNodesChange = useCallback((changes) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  const onEdgesChange = useCallback((changes) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

  const onConnect = useCallback((params) => {
    setEdges((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        source: params.source,
        target: params.target,
      },
    ]);
  }, []);

  const addNode = useCallback((nodeName) => {
    setNodes((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        position: {
          x: 120 + (prev.length % 5) * 160,
          y: 100 + Math.floor(prev.length / 5) * 120,
        },
        data: { label: nodeName },
        type: "default",
      },
    ]);
  }, []);

  return {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
  };
}
