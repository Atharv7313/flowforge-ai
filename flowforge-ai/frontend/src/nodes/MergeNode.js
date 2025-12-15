import NodeBase from "./NodeBase";

export default function MergeNode({ id, data = {} }) {
  data.compute = ({ inputs }) => {
    return { ...inputs };
  };

  return (
    <NodeBase
      title="Merge"
      inputs={[
        { id: `${id}-in1` },
        { id: `${id}-in2` }
      ]}
      outputs={[{ id: `${id}-out` }]}
    >
      <div>Merges two inputs.</div>
      <pre style={{ fontSize: 11 }}>{JSON.stringify(data.displayValue ?? "", null, 2)}</pre>
    </NodeBase>
  );
}
