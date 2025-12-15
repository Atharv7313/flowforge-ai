// toolbar.js
import { DraggableNode } from "./draggableNode";

export const PipelineToolbar = () => {
  return (
      <div className="
  sticky top-0 z-10
  border-b border-purple-800/40
  bg-black/60 backdrop-blur-lg
  px-6 py-4
">
<h3 className="
  mb-4 flex items-center gap-2
  text-sm font-semibold uppercase tracking-wider
  text-purple-200
">
  <span className="h-1.5 w-1.5 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
  Pipeline Nodes
</h3>

      <div className=" flex flex-wrap gap-3
  cursor-grab rounded-lg
  border border-purple-700/40
  bg-black/40 px-4 py-2 text-sm
  text-gray-200 shadow-sm
  transition hover:bg-purple-900/30
  hover:shadow-purple-600/30
"
>

        <DraggableNode type="input" label="Input" />
        <DraggableNode type="template" label="Template" />
        <DraggableNode type="merge" label="Merge" />
        <DraggableNode type="llm" label="LLM" />
        <DraggableNode type="validator" label="Validator" />
        <DraggableNode type="explain" label="Explain" />
        <DraggableNode type="output" label="Output" />
      </div>

    </div>
  );
};
