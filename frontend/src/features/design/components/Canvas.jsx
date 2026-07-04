import { useMemo } from "react";
import ReactFlow, { Background, Controls, MiniMap } from "reactflow";
import "reactflow/dist/style.css";
import CanvasNode from "./CanvasNode";

function Canvas({ nodes, edges, onNodesChange, onEdgesChange, onConnect, onNodeLabelChange }) {
  // nodeTypes must be memoized (or defined outside the component) — ReactFlow
  // warns and can behave oddly if a new object is passed every render.
  const nodeTypes = useMemo(
    () => ({
      custom: (props) => <CanvasNode {...props} onLabelChange={onNodeLabelChange} />,
    }),
    [onNodeLabelChange]
  );

  return (
    <div className="w-full h-full bg-[#0a0a0a]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Background color="#262626" gap={24} />
        <Controls className="!bg-[#111111] !border !border-gray-800 [&>button]:!bg-[#111111] [&>button]:!border-gray-800 [&>button]:!text-gray-400" />
        <MiniMap
          className="!bg-[#111111] !border !border-gray-800"
          maskColor="rgba(10,10,10,0.6)"
          nodeColor="#262626"
        />
      </ReactFlow>
    </div>
  );
}

export default Canvas;