import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { SubmitButton } from './submit';

function App() {
  return (
 <div className="min-h-screen bg-gradient-to-br from-black via-[#120018] to-[#1a0033] text-gray-100">
  <PipelineToolbar />
  <PipelineUI />
</div>
  );
}

export default App;
