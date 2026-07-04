const DEFAULT_COMPONENTS = ["Server", "Database", "Cache", "Queue", "Load Balancer", "Client"];

function NodePalette({ onAddNode, components = DEFAULT_COMPONENTS }) {
  return (
    <div className="absolute top-4 left-4 z-10 flex flex-col gap-1 bg-[#111111] border border-gray-800 rounded-md p-2">
      <span className="font-mono text-[10px] uppercase tracking-wider text-gray-500 px-2 pb-1">
        Components
      </span>
      {components.map((component) => (
        <button
          key={component}
          onClick={() => onAddNode(component)}
          className="text-left text-sm text-gray-300 px-2 py-1.5 rounded hover:bg-[#1a1a1a] hover:text-white transition-colors"
        >
          + {component}
        </button>
      ))}
    </div>
  );
}

export default NodePalette;
