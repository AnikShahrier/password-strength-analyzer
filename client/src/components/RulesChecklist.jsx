const RulesChecklist = ({ rules }) => {
  const ruleItems = [
    { key: 'hasMinLength', label: 'At least 8 characters', icon: '📏' },
    { key: 'hasMaxLength', label: 'Maximum 128 characters', icon: '📐' },
    { key: 'hasUppercase', label: 'Uppercase letters (A-Z)', icon: '🔠' },
    { key: 'hasLowercase', label: 'Lowercase letters (a-z)', icon: '🔡' },
    { key: 'hasNumbers', label: 'Numbers (0-9)', icon: '🔢' },
    { key: 'hasSpecialChars', label: 'Special characters (!@#$%^&*)', icon: '✨' },
    { key: 'noCommonPatterns', label: 'No common patterns', icon: '🛡️' },
    { key: 'noSequentialChars', label: 'No sequential characters', icon: '🔀' },
    { key: 'noRepeatedChars', label: 'No repeated characters (3+)', icon: '🔄' },
    { key: 'noKeyboardPatterns', label: 'No keyboard patterns', icon: '⌨️' },
  ];
  
  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">Password Rules Checklist</h3>
      <div className="space-y-3">
        {ruleItems.map((rule) => {
          const passed = rules?.[rule.key];
          return (
            <div 
              key={rule.key}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                passed ? 'bg-green-500/10 border border-green-500/30' : 'bg-slate-800 border border-slate-700'
              }`}
            >
              <span className="text-xl">{rule.icon}</span>
              <span className={`flex-1 ${passed ? 'text-green-400' : 'text-slate-400'}`}>
                {rule.label}
              </span>
              {passed ? (
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RulesChecklist;