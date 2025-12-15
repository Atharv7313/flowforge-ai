// src/nodes/textNode.js
import React, { useState, useEffect } from "react";
import NodeBase from "./NodeBase";

/**
 * TextNode
 * - auto-resizes based on content
 * - detects variables like {{name}} and creates left-side handles for them
 * - uses NodeBase for consistent handles/layout
 */
export default function TextNode({ id, data = {} }) {
  const initial = data?.text ?? "{{input}}";
  const [currText, setCurrText] = useState(initial);
  const [size, setSize] = useState({ width: 200, height: 80 });
  const [variables, setVariables] = useState([]); // array of variable names

  // helper: extract unique valid JS variable names from {{ varName }}
  const extractVariables = (text) => {
    const re = /{{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*}}/g;
    const vars = new Set();
    let m;
    while ((m = re.exec(text)) !== null) {
      vars.add(m[1]);
    }
    return Array.from(vars);
  };

  // update size & variables whenever currText changes
  useEffect(() => {
    const value = currText || "";
    const lines = value.split("\n").length;
    // tune these numbers to taste
    const newWidth = Math.min(600, Math.max(150, 20 + value.length * 4));
    const newHeight = Math.min(600, Math.max(60, 28 + lines * 22));
    setSize({ width: newWidth, height: newHeight });

    const vars = extractVariables(value);
    setVariables(vars);

    // notify parent data back if callback present
    if (typeof data.onChange === "function") {
      data.onChange(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currText]);

  const handleInputChange = (e) => {
    setCurrText(e.target.value);
  };

  // prepare NodeBase handle props
  const inputs = variables.map((v) => ({ id: v, label: v }));
  const outputs = [{ id: `${id}-output`, label: "out" }];

  return (
    <NodeBase title="Text" inputs={inputs} outputs={outputs} style={{ width: size.width, height: size.height }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <label style={{ fontSize: 12, opacity: 0.9 }}>
          Text
        </label>
        <textarea
          value={currText}
          onChange={handleInputChange}
          style={{
            width: "100%",
            height: Math.max(40, size.height - 60),
            resize: "none",
            padding: 8,
            borderRadius: 6,
            border: "1px solid #ccc",
            fontSize: 13,
            boxSizing: "border-box",
            background: "transparent",
            color: "inherit"
          }}
        />
        <div style={{ fontSize: 11, opacity: 0.8 }}>
          Variables detected: {variables.length ? variables.join(", ") : "none"}
        </div>
      </div>
    </NodeBase>
  );
}
