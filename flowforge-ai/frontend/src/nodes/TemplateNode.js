import React, { useState, useEffect } from "react";
import NodeBase from "./NodeBase";
import { useStore } from "../store";

export default function TemplateNode({ id, data = {} }) {
  const [text, setText] = useState(data.value || "{{input}}");

  /* ----------------------------
     UPDATE NODE VALUE IN STORE
     AND RE-RUN PIPELINE SAFELY
  -----------------------------*/
  useEffect(() => {
    // update Zustand state
    useStore.setState(state => ({
      nodes: state.nodes.map(n =>
        n.id === id ? { ...n, data: { ...n.data, value: text } } : n
      ),
    }));

    // trigger recomputation (safe check)
    if (data.engine) {
      requestAnimationFrame(() => {
        data.engine.runAll();
      });
    }
  }, [text]);

  /* ----------------------------
     PURE COMPUTE FUNCTION
  -----------------------------*/
  data.compute = ({ inputs, data }) => {
    const inputValue = inputs?.[`${id}-in`] ?? "";
    const template = data.value ?? "";

    // Replace ANY {{var}} if in future you add dynamic vars
    return template.replace(/{{\s*input\s*}}/g, inputValue);
  };

  return (
    <NodeBase
      title="Template"
      inputs={[{ id: `${id}-in` }]}
      outputs={[{ id: `${id}-out` }]}
      data={data}
      style={{ minWidth: 260 }}
    >
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        className="
          w-full rounded-md bg-black/30
          px-3 py-2 text-sm text-gray-100
          focus:ring-2 focus:ring-purple-500
          resize-none
        "
      />

      <div className="mt-2 text-xs text-purple-300">
        <strong>Output:</strong> {String(data.displayValue ?? "")}
      </div>
    </NodeBase>
  );
}
  