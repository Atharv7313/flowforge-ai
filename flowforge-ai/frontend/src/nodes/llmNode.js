import NodeBase from "./NodeBase";

export const LLMNode = ({ id, data }) => {
  const compute = ({ inputs }) => {
    const prompt = inputs.prompt || "";
    const context = inputs.context || "";

    return `AI Response:\n${context}\n${prompt}`;
  };

  return (
    <NodeBase
      title="LLM"
      inputs={[
        { id: "prompt", label: "Prompt" },
        { id: "context", label: "Context" }
      ]}
      outputs={[
        { id: "response", label: "Response" }
      ]}
      compute={compute}
    >
      <div style={{ fontSize: 12, fontWeight: 600 }}>LLM Output</div>
      <pre style={{ fontSize: 11, whiteSpace: "pre-wrap" }}>
        {data.displayValue || ""}
      </pre>
    </NodeBase>
  );
};
