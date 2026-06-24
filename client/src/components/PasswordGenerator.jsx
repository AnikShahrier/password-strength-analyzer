import { useState } from 'react';

const PasswordGenerator = ({ onUsePassword }) => {
  const [passwords, setPasswords] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(null);

  const generatePasswords = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/analysis/generate');
      const data = await response.json();
      if (data.success) {
        setPasswords(data.data);
      }
    } catch (err) {
      console.error('Failed to generate passwords:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (password, key) => {
    navigator.clipboard.writeText(password);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-emerald-400';
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-blue-400';
    if (score >= 40) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const getScoreBg = (score) => {
    if (score >= 90) return 'bg-emerald-500/20 border-emerald-500/30';
    if (score >= 80) return 'bg-green-500/20 border-green-500/30';
    if (score >= 60) return 'bg-blue-500/20 border-blue-500/30';
    if (score >= 40) return 'bg-yellow-500/20 border-yellow-500/30';
    return 'bg-orange-500/20 border-orange-500/30';
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
          Strong Password Generator
        </h3>
        <button
          onClick={generatePasswords}
          disabled={loading}
          className="btn btn-primary text-sm"
        >
          {loading ? (
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Generate New
            </>
          )}
        </button>
      </div>

      {!passwords && !loading && (
        <div className="text-center py-8 text-slate-500">
          <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
              d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
          <p>Click "Generate New" to create strong passwords</p>
        </div>
      )}

      {passwords && (
        <div className="space-y-3">
          {Object.entries(passwords).map(([key, data]) => {
            const labels = {
              easyToSay: 'Easy to Say',
              easyToRead: 'Easy to Read',
              allCharacters: 'All Characters',
              memorable: 'Memorable'
            };
            
            return (
              <div key={key} className={`p-4 rounded-lg border ${getScoreBg(data.score)}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-300">{labels[key]}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${getScoreColor(data.score)}`}>
                      {data.score}/100
                    </span>
                    <span className="text-xs text-slate-500">{data.label}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <code className="flex-1 bg-slate-900/50 px-3 py-2 rounded text-sm font-mono text-white break-all">
                    {data.password}
                  </code>
                  <button
                    onClick={() => copyToClipboard(data.password, key)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
                    title="Copy to clipboard"
                  >
                    {copied === key ? (
                      <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                  </button>
                </div>
                
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{data.length} chars • {data.entropy} bits entropy</span>
                  <span>Crack time: {data.crackTime}</span>
                </div>
                
                {onUsePassword && (
                  <button
                    onClick={() => onUsePassword(data.password)}
                    className="mt-2 w-full py-2 text-sm text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 rounded transition-colors"
                  >
                    Use This Password →
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PasswordGenerator;