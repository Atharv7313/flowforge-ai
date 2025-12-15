// InputNode.js
import NodeBase from "./NodeBase";

export default function InputNode({ id, data }) {
  const handleChange = (e) => {
    data.onChange(e.target.value);
  };

  return (
    <NodeBase title="Input" outputs={[{ id: `${id}-out` }]}>
      <input
        value={data.value}
        onChange={handleChange}
        placeholder="Enter input..."
        className="w-full rounded-md bg-black/40 border border-purple-700/40 px-3 py-2 text-sm text-gray-100 focus:ring-2 focus:ring-purple-500"
      />
    </NodeBase>
  );
}
