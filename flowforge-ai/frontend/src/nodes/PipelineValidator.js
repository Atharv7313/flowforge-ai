import NodeBase from "./NodeBase";

export default function PipelineValidator({ id, data = {} }) {
  data.compute = ({ inputs }) => {
    const report = inputs[Object.keys(inputs)[0]];
    if (!report) return "No pipeline data.";

    return {
      valid: report.is_dag,
      nodes: report.num_nodes,
      edges: report.num_edges,
      message: report.is_dag ? "Pipeline is valid" : "Cycle detected",
    };
  };

  return (
    <NodeBase
      title="Validator"
      inputs={[{ id: `${id}-pipeline` }]}
      outputs={[{ id: `${id}-report` }]}
    >
      <pre style={{ fontSize: 11 }}>
        {JSON.stringify(data.displayValue ?? "", null, 2)}
      </pre>
    </NodeBase>
  );
}
