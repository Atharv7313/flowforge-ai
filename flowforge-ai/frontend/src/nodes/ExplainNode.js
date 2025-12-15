import NodeBase from "./NodeBase";

export default function ExplainNode({ id, data = {} }) {
  data.compute = ({ inputs }) => {
    const p = inputs[Object.keys(inputs)[0]];
    if (!p) return "No pipeline information.";

    return `This pipeline processes ${p.num_nodes} nodes and ${p.num_edges} edges and ${
      p.is_dag ? "forms a DAG" : "contains cycles"
    }.

It takes input, transforms it, calls an LLM, and outputs a result.`;
  };

  return (
    <NodeBase
      title="Explain"
      inputs={[{ id: `${id}-pipeline` }]}
      outputs={[{ id: `${id}-explanation` }]}
    >
      <div>{String(data.displayValue ?? "")}</div>
    </NodeBase>
  );
}
