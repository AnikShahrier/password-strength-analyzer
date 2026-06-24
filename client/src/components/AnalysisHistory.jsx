const AnalysisHistory = ({ history }) => {
  if (!history || history.length === 0) {
    return (
      <div className="card text-center py-12">
        <svg className="w-16 h-16 text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-slate-400">No analysis history yet</p>
        <p className="text-sm text-slate-500 mt-1">Analyze a password to see it here</p>
      </div>
    );
  }
  
  const getScoreColor = (score) => {
    if (score < 20) return 'text-red-500';
    if (score < 40) return 'text-orange-500';
    if (score < 60) return 'text-yellow-500';
    if (score < 80) return 'text-blue-500';
    if (score < 90) return 'text-green-500';
    return 'text-emerald-400';
  };
  
  const getScoreBg = (score) => {
    if (score < 20) return 'bg-red-500/20';
    if (score < 40) return 'bg-orange-500/20';
    if (score < 60) return 'bg-yellow-500/20';
    if (score < 80) return 'bg-blue-500/20';
    if (score < 90) return 'bg-green-500/20';
    return 'bg-emerald-500/20';
  };
  
  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">Recent Analyses</h3>
      <div className="space-y-3">
        {history.map((item) => (
          <div key={item.id} className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className={`text-sm font-bold px-2 py-1 rounded ${getScoreBg(item.strengthScore)} ${getScoreColor(item.strengthScore)}`}>
                  {item.strengthScore}
                </span>
                <span className={`font-semibold ${getScoreColor(item.strengthScore)}`}>
                  {item.strengthLabel}
                </span>
              </div>
              <span className="text-xs text-slate-500">
                {new Date(item.createdAt).toLocaleString()}
              </span>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-slate-400 mb-2">
              <span>{item.length} chars</span>
              <span>•</span>
              <span>{item.entropy} bits entropy</span>
              <span>•</span>
              <span>Crack: {item.crackTimeDisplay}</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {item.rules?.hasUppercase && <span className="badge badge-info text-xs">ABC</span>}
              {item.rules?.hasLowercase && <span className="badge badge-info text-xs">abc</span>}
              {item.rules?.hasNumbers && <span className="badge badge-info text-xs">123</span>}
              {item.rules?.hasSpecialChars && <span className="badge badge-info text-xs">!@#</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalysisHistory;