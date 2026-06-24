import { useState, useEffect } from 'react';

const FloatingSuggestions = ({ password, onApplySuggestion }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  useEffect(() => {
    if (!password || password.length === 0) {
      setVisible(false);
      return;
    }

    const newSuggestions = generateSuggestions(password);
    setSuggestions(newSuggestions);
    setVisible(newSuggestions.length > 0);
    setSelectedIndex(-1);
  }, [password]);

  const generateSuggestions = (pwd) => {
    const list = [];
    
    if (pwd.length < 8) {
      list.push({
        type: 'length',
        label: `Add ${8 - pwd.length} chars`,
        action: () => pwd + generateRandomChars(8 - pwd.length),
        icon: '📏'
      });
    } else if (pwd.length < 12) {
      list.push({
        type: 'length',
        label: 'Add 4 more chars',
        action: () => pwd + generateRandomChars(4),
        icon: '📏'
      });
    }

    if (!/[A-Z]/.test(pwd)) {
      list.push({
        type: 'uppercase',
        label: 'Add uppercase',
        action: () => insertAtRandom(pwd, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'),
        icon: '🔠'
      });
    }

    if (!/[a-z]/.test(pwd)) {
      list.push({
        type: 'lowercase',
        label: 'Add lowercase',
        action: () => insertAtRandom(pwd, 'abcdefghijklmnopqrstuvwxyz'),
        icon: '🔡'
      });
    }

    if (!/[0-9]/.test(pwd)) {
      list.push({
        type: 'numbers',
        label: 'Add numbers',
        action: () => insertAtRandom(pwd, '0123456789'),
        icon: '🔢'
      });
    }

    if (!/[^a-zA-Z0-9]/.test(pwd)) {
      list.push({
        type: 'special',
        label: 'Add symbols',
        action: () => insertAtRandom(pwd, '!@#$%^&*'),
        icon: '✨'
      });
    }

    if (/(.)\1{2,}/.test(pwd)) {
      list.push({
        type: 'pattern',
        label: 'Fix repeats',
        action: () => removeRepeatedChars(pwd),
        icon: '🔄'
      });
    }

    list.push({
      type: 'generate',
      label: 'Generate strong',
      action: () => generateStrongPassword(),
      icon: '🎲',
      highlight: true
    });

    return list.slice(0, 4);
  };

  const generateRandomChars = (count) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let result = '';
    for (let i = 0; i < count; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
  };

  const insertAtRandom = (str, chars) => {
    const char = chars[Math.floor(Math.random() * chars.length)];
    const pos = Math.floor(Math.random() * (str.length + 1));
    return str.slice(0, pos) + char + str.slice(pos);
  };

  const removeRepeatedChars = (str) => {
    return str.replace(/(.)\1{2,}/g, '$1$1');
  };

  const generateStrongPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let pwd = '';
    for (let i = 0; i < 16; i++) {
      pwd += chars[Math.floor(Math.random() * chars.length)];
    }
    return pwd;
  };

  const handleApply = (suggestion) => {
    const newPassword = suggestion.action();
    onApplySuggestion(newPassword);
    setVisible(false);
  };

  const handleKeyDown = (e) => {
    if (!visible) return;
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      handleApply(suggestions[selectedIndex]);
    } else if (e.key === 'Escape') {
      setVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [visible, suggestions, selectedIndex]);

  if (!visible || suggestions.length === 0) return null;

  return (
    <div 
      className="absolute left-0 right-0 top-full mt-1 z-[100]"
      style={{ isolation: 'isolate' }}
    >
      <div 
        className="rounded-xl overflow-hidden"
        style={{
          background: 'rgba(30, 41, 59, 0.85)',
          backdropFilter: 'blur(16px) saturate(180%)',
          WebkitBackdropFilter: 'blur(16px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
        }}
      >
        {/* Header */}
        <div 
          className="px-3 py-1.5 flex items-center gap-1.5"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          <span className="text-[10px]">💡</span>
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Quick Fixes
          </span>
        </div>
        
        {/* Suggestions List */}
        <div className="py-0.5">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleApply(suggestion)}
              onMouseEnter={() => setSelectedIndex(index)}
              className={`
                w-full text-left px-3 py-2 flex items-center gap-2.5 transition-all duration-100
                ${index === selectedIndex 
                  ? 'bg-indigo-500/20' 
                  : 'hover:bg-white/5'
                }
                ${index !== suggestions.length - 1 ? 'border-b border-white/5' : ''}
              `}
            >
              <span className="text-base shrink-0">{suggestion.icon}</span>
              <span className={`text-xs font-medium truncate ${
                suggestion.highlight ? 'text-amber-400' : 'text-slate-300'
              }`}>
                {suggestion.label}
              </span>
              {index === selectedIndex && (
                <span className="ml-auto text-[10px] text-indigo-400 font-medium shrink-0 bg-indigo-500/10 px-1.5 py-0.5 rounded">
                  Apply
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FloatingSuggestions;