const StrengthMeter = ({ score, label, entropy, crackTime }) => {
  const getColor = () => {
    if (score < 20) return 'bg-red-600';
    if (score < 40) return 'bg-orange-500';
    if (score < 60) return 'bg-yellow-500';
    if (score < 80) return 'bg-blue-500';
    if (score < 90) return 'bg-green-500';
    return 'bg-emerald-400';
  };
  
  const getLabelColor = () => {
    if (score < 20) return 'text-red-500';
    if (score < 40) return 'text-orange-500';
    if (score < 60) return 'text-yellow-500';
    if (score < 80) return 'text-blue-500';
    if (score < 90) return 'text-green-500';
    return 'text-emerald-400';
  };
  
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Strength Score</h3>
        <span className={`text-2xl font-bold ${getLabelColor()}`}>
          {score}/100
        </span>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-slate-700 rounded-full h-4 mb-4 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${getColor()}`}
          style={{ width: `${score}%` }}
        />
      </div>
      
      <div className="flex items-center justify-between mb-6">
        <span className={`text-lg font-bold ${getLabelColor()}`}>{label}</span>
        <span className="text-sm text-slate-400">Entropy: {entropy} bits</span>
      </div>
      
      {/* Crack Time */}
      <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-semibold text-slate-300">Estimated Crack Time</span>
        </div>
        <p className="text-2xl font-bold text-white">{crackTime}</p>
        <p className="text-xs text-slate-500 mt-1">
          Based on 10 billion guesses/second (GPU cluster)
        </p>
      </div>
    </div>
  );
};

export default StrengthMeter;