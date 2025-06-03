
const Index = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Workflow</h1>
            <p className="text-slate-600 text-lg">Design and manage your AI agent workflows</p>
          </div>
        </div>
      </div>

      <div className="text-center py-20">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-8 border-2 border-slate-200">
          <svg className="h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div className="text-slate-500 text-xl font-semibold mb-3">Workflow Designer</div>
        <p className="text-slate-400 mb-8 text-base">Create and configure your AI agent workflows</p>
      </div>
    </div>
  );
};

export default Index;
