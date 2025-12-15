// src/submit.js
// Simple button which receives an onSubmit prop from the parent UI

export const SubmitButton = ({ onSubmit }) => {
  return (
   <div className=" flex justify-center">
  <button
    onClick={onSubmit}
    className="
      group relative overflow-hidden
      rounded-xl px-8 py-3
      bg-gradient-to-r from-purple-600 to-indigo-600
      text-sm font-semibold text-white
      shadow-lg shadow-purple-900/40
      transition-all duration-300
      hover:scale-[1.03]
      hover:shadow-purple-700/60
      focus:outline-none focus:ring-2 focus:ring-purple-400
    "
  >
    <span className="relative z-10">Run Pipeline</span>

    <span
      className="
        absolute inset-0
        bg-gradient-to-r from-purple-700 to-indigo-700
        opacity-0 transition-opacity duration-300
        group-hover:opacity-100
      "
    />
  </button>
</div>


  );
};
