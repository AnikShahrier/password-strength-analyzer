import { useState, useEffect } from 'react';
import { getLastPassword } from '../services/api';

const LastPasswordTracker = () => {
  const [lastPassword, setLastPassword] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLastPassword();
  }, []);

  const fetchLastPassword = async () => {
    try {
      const response = await getLastPassword();
      if (response.success && response.data) {
        setLastPassword(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch last password:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-slate-700 rounded w-1/3"></div>
          <div className="h-8 bg-slate-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (!lastPassword) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Last Password Analysis
        </h3>
        <p className="text-slate-500 text-sm">Analyze a password to see tracking information here.</p>
      </div>
    );
  }

  const { lastPassword: last, comparison } = lastPassword;
  
  const getScoreColor = (score) => {
    if (score >= 90) return 'text-emerald-400';
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-blue-400';
    if (score >= 40) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const getScoreBg = (score) => {
    if (score >= 90) return 'bg-emerald-500';
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-blue-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Last Password Analysis
        </h3>
        <button 
          onClick={fetchLastPassword}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Score Display */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-20 h-20">
          <svg className="w-20 h-20 transform -rotate-90">
            <circle cx="40" cy="40" r="36" stroke="#334155" strokeWidth="8" fill="none" />
            <circle 
              cx="40" 
              cy="40" 
              r="36" 
              stroke="currentColor" 
              strokeWidth="8" 
              fill="none"
              strokeDasharray={`${(last.score / 100) * 226} 226`}
              className={getScoreColor(last.score)}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-xl font-bold ${getScoreColor(last.score)}`}>{last.score}</span>
          </div>
        </div>
        <div>
          <div className={`text-lg font-bold ${getScoreColor(last.score)}`}>{last.label}</div>
          <div className="text-sm text-slate-400">{last.length} characters</div>
          <div className="text-xs text-slate-500 mt-1">Analyzed at {new Date(last.timestamp).toLocaleTimeString()}</div>
        </div>
      </div>

      {/* Comparison Stats */}
      <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
        <h4 className="text-sm font-semibold text-slate-300 mb-3">How It Compares</h4>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Your Score</span>
            <div className="flex items-center gap-2">
              <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${getScoreBg(last.score)}`}
                  style={{ width: `${last.score}%` }}
                />
              </div>
              <span className={`text-sm font-bold ${getScoreColor(last.score)}`}>{last.score}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Average Score</span>
            <div className="flex items-center gap-2">
              <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full bg-slate-500"
                  style={{ width: `${comparison.averageScore}%` }}
                />
              </div>
              <span className="text-sm font-bold text-slate-300">{comparison.averageScore}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Best Score</span>
            <span className="text-sm font-bold text-emerald-400">{comparison.maxScore}</span>
          </div>
        </div>

        <div className={`mt-3 pt-3 border-t border-slate-700 text-sm ${comparison.isAboveAverage ? 'text-green-400' : 'text-yellow-400'}`}>
          {comparison.isAboveAverage 
            ? '✅ Your password is stronger than average!' 
            : '⚠️ Your password is below average. Consider using the generator.'}
        </div>
      </div>

      <div className="mt-3 text-xs text-slate-500 text-center">
        Total analyses in database: {comparison.totalAnalyses}
      </div>
    </div>
  );
};

export default LastPasswordTracker;