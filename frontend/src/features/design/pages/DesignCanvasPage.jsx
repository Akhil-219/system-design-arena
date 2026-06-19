import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  applyEdgeChanges,
  applyNodeChanges,
} from "reactflow";
import { useState } from "react";
import { ReactFlowProvider } from "reactflow";
import "reactflow/dist/style.css";
const initialNodes = [
  {
    id: "1",
    position: { x: 100, y: 100 },
    data: { label: "Server" },
    type: "default",
  },
];

function DesignCanvasPage() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState([]);
  const components = ["Server", "Database", "Cache", "Queue"];
  const onNodesChange = (changes) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  };
  const onEdgesChange =(changes)=>{
    setEdges((edges)=>applyEdgeChanges(changes,edges))
  }
  const onConnect = (params) => {
    setEdges((prev) => {
      const newEdge = {
        id: crypto.randomUUID(),
        source: params.source,
        target: params.target,
      };
      console.log(newEdge);
      return [...prev, newEdge];
    });
  };
  const addNode = (nodeName) => {
    setNodes((prev) => {
      const newNode = {
        id: crypto.randomUUID(),
        position: {
          x: prev.length * 100,
          y: prev.length * 50 + 50,
        },
        data: {
          label: nodeName,
        },
      };
      
      
      return [...prev, newNode];
    });
  };

  return (
    <ReactFlowProvider>
      <div style={{ width: "100%", height: "100vh" }}>
        {components.map((component) => (
          <button key={component} onClick={() => addNode(component)}>
            Add {component}
          </button>
        ))}

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onConnect={onConnect}
          onEdgesChange={onEdgesChange}
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
}

export default DesignCanvasPage;
