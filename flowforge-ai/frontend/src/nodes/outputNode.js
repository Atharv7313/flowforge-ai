// OutputNode.js
import NodeBase from "./NodeBase";

export default function OutputNode({ id, data = {} }) {
  data.compute = ({ inputs }) => {
    return inputs[Object.keys(inputs)[0]] ?? "";
  };

  return (
    <NodeBase
      title="Output"
      inputs={[{ id: `${id}-in` }]}
      outputs={[]}
    >
      <div className="text-xs text-purple-300 mb-1">
        Final output
      </div>

      <pre
        className="
          max-h-40
          overflow-y-auto overflow-x-hidden
          whitespace-pre-wrap break-words
          rounded-md bg-black/50
          border border-purple-800/40
          px-3 py-2
          text-sm text-purple-100
          shadow-inner
        "
      >
        {String(data.displayValue ?? "")}
      </pre>
    </NodeBase>
  );
}
