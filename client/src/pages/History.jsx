import { useState, useEffect } from 'react';
import { getHistory, getStats, revealPassword } from '../services/api';

const History = () => {
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [limit, setLimit] = useState(20);
  const [offset, setOffset] = useState(0);
  
  // Password reveal state
  const [revealedPasswords, setRevealedPasswords] = useState({});
  const [revealingId, setRevealingId] = useState(null);

  useEffect(() => {
    fetchData();
  }, [limit, offset]);
  
  const fetchData = async () => {
    try {
      setLoading(true);
      const [historyRes, statsRes] = await Promise.all([
        getHistory(limit, offset),
        getStats()
      ]);
      setHistory(historyRes.data);
      setStats(statsRes.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleRevealPassword = async (id) => {
    // Toggle off if already revealed
    if (revealedPasswords[id]) {
      setRevealedPasswords(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      return;
    }
    
    setRevealingId(id);
    try {
      const response = await revealPassword(id);
      if (response.success) {
        setRevealedPasswords(prev => ({
          ...prev,
          [id]: response.data.password
        }));
      }
    } catch (err) {
      alert('Failed to reveal password: ' + err.message);
    } finally {
      setRevealingId(null);
    }
  };
  
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

  const getScoreBarColor = (score) => {
    if (score < 20) return 'bg-red-500';
    if (score < 40) return 'bg-orange-500';
    if (score < 60) return 'bg-yellow-500';
    if (score < 80) return 'bg-blue-500';
    if (score < 90) return 'bg-green-500';
    return 'bg-emerald-400';
  };

  if (loading) {
    return (
      <div className="space-y-8 max-w-6xl mx-auto">
        <section>
          <div className="h-8 bg-slate-700 rounded w-1/4 animate-pulse"></div>
        </section>
        <section>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="card h-24 animate-pulse bg-slate-800"></div>
            ))}
          </div>
        </section>
        <section>
          <div className="card h-96 animate-pulse bg-slate-800"></div>
        </section>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="space-y-8 max-w-6xl mx-auto">
        <section>
          <div className="card bg-red-500/10 border-red-500/30 border-l-4 border-l-red-500 text-red-400 p-6">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">Error: {error}</span>
            </div>
          </div>
        </section>
      </div>
    );
  }
  
  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <section>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white mb-1">Analysis History</h2>
            <p className="text-slate-400 text-sm">View all your password analyses and statistics</p>
          </div>
          <button 
            onClick={fetchData}
            className="btn btn-secondary text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </section>
      
      {/* Stats Cards */}
      {stats && (
        <section>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="card text-center hover:scale-[1.02] transition-transform">
              <div className="text-3xl font-bold text-indigo-400 mb-1">{stats.totalAnalyses}</div>
              <div className="text-sm text-slate-400">Total Analyses</div>
            </div>
            <div className="card text-center hover:scale-[1.02] transition-transform">
              <div className="text-3xl font-bold text-blue-400 mb-1">{stats.averageScore}</div>
              <div className="text-sm text-slate-400">Average Score</div>
            </div>
            <div className="card text-center hover:scale-[1.02] transition-transform">
              <div className="text-3xl font-bold text-green-400 mb-1">{stats.strongPasswords}</div>
              <div className="text-sm text-slate-400">Strong Passwords</div>
            </div>
            <div className="card text-center hover:scale-[1.02] transition-transform">
              <div className="text-3xl font-bold text-red-400 mb-1">{stats.weakPasswords}</div>
              <div className="text-sm text-slate-400">Weak Passwords</div>
            </div>
          </div>
        </section>
      )}
      
      {/* History Table */}
      <section>
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="text-lg font-semibold text-white">Recent Analyses</h3>
            <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded-full">
              Click 👁️ to reveal password
            </span>
          </div>
          
          <div className="overflow-x-auto -mx-4 px-4">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-3 text-slate-400 font-medium text-xs uppercase tracking-wider">ID</th>
                  <th className="text-left py-3 px-3 text-slate-400 font-medium text-xs uppercase tracking-wider">Score</th>
                  <th className="text-left py-3 px-3 text-slate-400 font-medium text-xs uppercase tracking-wider">Strength</th>
                  <th className="text-left py-3 px-3 text-slate-400 font-medium text-xs uppercase tracking-wider">Password</th>
                  <th className="text-left py-3 px-3 text-slate-400 font-medium text-xs uppercase tracking-wider">Length</th>
                  <th className="text-left py-3 px-3 text-slate-400 font-medium text-xs uppercase tracking-wider">Entropy</th>
                  <th className="text-left py-3 px-3 text-slate-400 font-medium text-xs uppercase tracking-wider">Crack Time</th>
                  <th className="text-left py-3 px-3 text-slate-400 font-medium text-xs uppercase tracking-wider">Rules</th>
                  <th className="text-left py-3 px-3 text-slate-400 font-medium text-xs uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {history.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="py-12 text-center text-slate-500">
                      <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} 
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <p>No analysis history yet</p>
                      <p className="text-xs mt-1">Analyze a password to see it here</p>
                    </td>
                  </tr>
                ) : (
                  history.map((item) => {
                    const isRevealed = !!revealedPasswords[item.id];
                    const isRevealing = revealingId === item.id;
                    
                    return (
                      <tr key={item.id} className="hover:bg-slate-800/40 transition-colors group">
                        {/* ID */}
                        <td className="py-3 px-3">
                          <span className="text-xs font-mono text-slate-500">#{item.id}</span>
                        </td>
                        
                        {/* Score with mini bar */}
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <div className="w-12 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${getScoreBarColor(item.strengthScore)}`}
                                style={{ width: `${item.strengthScore}%` }}
                              />
                            </div>
                            <span className={`text-sm font-bold ${getScoreColor(item.strengthScore)}`}>
                              {item.strengthScore}
                            </span>
                          </div>
                        </td>
                        
                        {/* Strength Label */}
                        <td className="py-3 px-3">
                          <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-semibold ${getScoreBg(item.strengthScore)} ${getScoreColor(item.strengthScore)}`}>
                            {item.strengthLabel}
                          </span>
                        </td>
                        
                        {/* Password with Reveal */}
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            {isRevealed ? (
                              <code className="bg-slate-900 px-2 py-1 rounded text-sm font-mono text-emerald-400 border border-emerald-500/30">
                                {revealedPasswords[item.id]}
                              </code>
                            ) : (
                              <span className="text-slate-600 text-sm font-mono">••••••••</span>
                            )}
                            
                            {item.canReveal && (
                              <button
                                onClick={() => handleRevealPassword(item.id)}
                                disabled={isRevealing}
                                className={`p-1.5 rounded-md transition-all ${
                                  isRevealed 
                                    ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30' 
                                    : 'bg-slate-700 text-slate-400 hover:text-white hover:bg-slate-600'
                                }`}
                                title={isRevealed ? 'Hide password' : 'Reveal password'}
                              >
                                {isRevealing ? (
                                  <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                  </svg>
                                ) : isRevealed ? (
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                  </svg>
                                ) : (
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                )}
                              </button>
                            )}
                          </div>
                        </td>
                        
                        {/* Length */}
                        <td className="py-3 px-3 text-slate-300 text-sm">
                          {item.length}
                        </td>
                        
                        {/* Entropy */}
                        <td className="py-3 px-3 text-slate-300 text-sm">
                          <span className="font-mono">{item.entropy}</span>
                          <span className="text-slate-500 text-xs ml-1">bits</span>
                        </td>
                        
                        {/* Crack Time */}
                        <td className="py-3 px-3">
                          <span className="text-sm text-slate-300">{item.crackTimeDisplay}</span>
                        </td>
                        
                        {/* Rules */}
                        <td className="py-3 px-3">
                          <div className="flex flex-wrap gap-1">
                            {item.rules?.hasUppercase && (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-500/20 text-blue-400">ABC</span>
                            )}
                            {item.rules?.hasLowercase && (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-indigo-500/20 text-indigo-400">abc</span>
                            )}
                            {item.rules?.hasNumbers && (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-500/20 text-emerald-400">123</span>
                            )}
                            {item.rules?.hasSpecialChars && (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-500/20 text-amber-400">!@#</span>
                            )}
                          </div>
                        </td>
                        
                        {/* Date */}
                        <td className="py-3 px-3">
                          <div className="text-xs text-slate-400">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </div>
                          <div className="text-[10px] text-slate-600">
                            {new Date(item.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {history.length > 0 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-700">
              <button
                onClick={() => setOffset(Math.max(0, offset - limit))}
                disabled={offset === 0}
                className="btn btn-secondary text-sm disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>
              
              <div className="flex items-center gap-4">
                <span className="text-sm text-slate-400">
                  Page {Math.floor(offset / limit) + 1} of {Math.ceil((stats?.totalAnalyses || 0) / limit)}
                </span>
                <select 
                  value={limit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value));
                    setOffset(0);
                  }}
                  className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-1.5 text-sm text-slate-300 focus:outline-none focus:border-indigo-500"
                >
                  <option value={10}>10 / page</option>
                  <option value={20}>20 / page</option>
                  <option value={50}>50 / page</option>
                </select>
              </div>
              
              <button
                onClick={() => setOffset(offset + limit)}
                disabled={offset + limit >= (stats?.totalAnalyses || 0)}
                className="btn btn-secondary text-sm disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Next
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default History;