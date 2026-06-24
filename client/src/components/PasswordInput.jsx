import { useState, useRef, useEffect } from 'react';
import FloatingSuggestions from './FloatingSuggestions';

const PasswordInput = ({ password, setPassword, onAnalyze, loading }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password.trim()) {
      onAnalyze(password);
    }
  };

  const handleApplySuggestion = (newPassword) => {
    setPassword(newPassword);
    inputRef.current?.focus();
    setTimeout(() => {
      if (newPassword.trim()) {
        onAnalyze(newPassword);
      }
    }, 100);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="card relative">
      <h2 className="text-2xl font-bold mb-4">Password Strength Analyzer</h2>
      <p className="text-slate-400 mb-6">
        Enter a password to analyze its strength, or generate a strong one below.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Input Wrapper - relative for dropdown positioning */}
        <div 
          ref={wrapperRef} 
          className="relative"
          style={{ zIndex: 50 }}
        >
          <input
            ref={inputRef}
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Enter password to analyze..."
            className="input pr-12 relative"
            style={{ zIndex: 51, position: 'relative' }}
            maxLength={128}
            autoComplete="off"
          />
          
          {/* Eye Toggle Button */}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
            style={{ zIndex: 52 }}
          >
            {showPassword ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>

          {/* Floating Suggestions - Glass Effect */}
          {showSuggestions && password.length > 0 && (
            <FloatingSuggestions 
              password={password} 
              onApplySuggestion={handleApplySuggestion} 
            />
          )}
        </div>
        
        {/* Bottom Row */}
        <div className="flex items-center justify-between relative" style={{ zIndex: 1 }}>
          <span className="text-sm text-slate-400">
            {password.length}/128 characters
          </span>
          <button
            type="submit"
            disabled={!password.trim() || loading}
            className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Analyzing...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Analyze Password
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PasswordInput;