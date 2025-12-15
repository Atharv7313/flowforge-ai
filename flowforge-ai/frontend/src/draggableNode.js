// draggableNode.js
export const DraggableNode = ({ type, label }) => {
  const onDragStart = (event) => {
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify({ nodeType: type })
    );
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div
      onDragStart={onDragStart}
      draggable
      className="
    cursor-grab select-none
    rounded-lg border border-purple-800/40
    bg-black/40 px-4 py-2
    text-sm font-medium text-purple-100
    backdrop-blur-md
    shadow-[0_0_0_1px_rgba(168,85,247,0.15)]
    transition-all duration-200
    hover:border-purple-500/60
    hover:shadow-[0_0_12px_rgba(168,85,247,0.35)]
    hover:bg-purple-900/20
    active:cursor-grabbing
    active:scale-[0.98]
  "
>
      {label}
    </div>
  );
};
