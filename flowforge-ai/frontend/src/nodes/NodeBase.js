// NodeBase.js
import { Handle, Position } from "reactflow";

export default function NodeBase({
  title,
  inputs = [],
  outputs = [],
  children,
  style = {},
  data = {},
}) {
  return (
    <div
      className={`
        relative rounded-xl border border-purple-800/40
        bg-gradient-to-br from-[#140018]/80 to-[#0a0012]/80
        backdrop-blur-md p-4 text-gray-100
        shadow-lg transition-all duration-300
        ${
          data.executing
            ? "ring-2 ring-purple-500 shadow-purple-500/40 scale-[1.02]"
            : "hover:shadow-purple-700/30"
        }
      `}
      style={style}
    >
      {/* INPUT HANDLES (LEFT) */}
      {inputs.map((input, idx) => (
        <Handle
          key={input.id}
          type="target"
          position={Position.Left}
          id={input.id}
          style={{ top: `${30 + idx * 20}%` }}
          className="!bg-purple-500 !border-purple-300"
        />
      ))}

      {/* NODE TITLE */}
      <div className="mb-2 text-sm font-semibold">{title}</div>

      {/* NODE CONTENT */}
      {children}

      {/* OUTPUT HANDLES (RIGHT) */}
      {outputs.map((output, idx) => (
        <Handle
          key={output.id}
          type="source"
          position={Position.Right}
          id={output.id}
          style={{ top: `${50 + idx * 20}%` }}
          className="!bg-purple-500 !border-purple-300"
        />
      ))}
    </div>
  );
}
