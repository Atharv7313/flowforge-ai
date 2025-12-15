import React from "react";
import { Handle, Position } from "reactflow";

export default function BaseNode({
  title,
  children,
  inputs = [],
  outputs = [],
  style = {},
}) {
  return (
    <div
      style={{
        padding: 10,
        borderRadius: 8,
        background: "white",
        border: "1px solid #ddd",
        color: "#111",
        minWidth: 160,
        position: "relative",
        ...style,
      }}
    >
      <div style={{ fontWeight: "600", marginBottom: 8 }}>{title}</div>

      {/* LEFT HANDLES */}
      {inputs.map((input, i) => (
        <Handle
          key={input.id}
          id={input.id}
          type="target"
          position={Position.Left}
          style={{ top: 40 + i * 22, background: "#555" }}
        />
      ))}

      <div>{children}</div>

      {/* RIGHT HANDLES */}
      {outputs.map((out, i) => (
        <Handle
          key={out.id}
          id={out.id}
          type="source"
          position={Position.Right}
          style={{ top: 40 + i * 22, background: "#555" }}
        />
      ))}
    </div>
  );
}
