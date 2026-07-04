import { useState, useRef, useEffect } from "react";
import { Handle, Position } from "reactflow";

// Double-click a node to rename it (e.g. generic "Load Balancer" ->
// "NGINX" or "AWS ALB"). Addresses AI review feedback that generic,
// identically-labeled nodes make a diagram impossible to interpret.
function CanvasNode({ id, data, onLabelChange }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftLabel, setDraftLabel] = useState(data.label);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const commit = () => {
    const trimmed = draftLabel.trim();
    onLabelChange(id, trimmed || data.label);
    setIsEditing(false);
  };

  return (
    <div
      onDoubleClick={() => setIsEditing(true)}
      className="bg-[#111111] border border-gray-700 rounded-md px-4 py-2 min-w-[120px] text-center hover:border-gray-500 transition-colors"
    >
      <Handle type="target" position={Position.Top} className="!bg-gray-600 !border-gray-800" />

      {isEditing ? (
        <input
          ref={inputRef}
          value={draftLabel}
          onChange={(e) => setDraftLabel(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit();
            if (e.key === "Escape") {
              setDraftLabel(data.label);
              setIsEditing(false);
            }
          }}
          className="w-full bg-transparent text-sm text-white text-center outline-none border-b border-gray-600"
        />
      ) : (
        <span className="text-sm text-gray-200">{data.label}</span>
      )}

      <Handle type="source" position={Position.Bottom} className="!bg-gray-600 !border-gray-800" />
    </div>
  );
}

export default CanvasNode;
