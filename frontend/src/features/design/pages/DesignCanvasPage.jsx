import ReactFlow, {
  Background,
  Controls,
  MiniMap,
} from "reactflow";

import { ReactFlowProvider } from "reactflow";
import "reactflow/dist/style.css";
function DesignCanvasPage() {
 
    return (
      <ReactFlowProvider>
        <div style={{ width: "100%", height: "100vh" }}>
          <ReactFlow>
            <Background />
            <Controls />
            <MiniMap />
          </ReactFlow>
        </div>
      </ReactFlowProvider>
    );
}

export default DesignCanvasPage;
