const crypto = require('crypto');

// Common weak patterns
const COMMON_PATTERNS = [
  '123456', 'password', 'qwerty', 'abc123', 'letmein', 'welcome',
  'admin', 'login', 'master', 'dragon', 'monkey', 'shadow',
  'sunshine', 'princess', 'football', 'baseball', 'iloveyou',
  'trustno1', '696969', 'batman', 'passw0rd', 'p@ssw0rd',
  '12345678', '123456789', '1234567890', 'password123',
  'qwerty123', 'admin123', 'welcome123', 'login123'
];

const SEQUENCES = [
  'abcdefghijklmnopqrstuvwxyz',
  'zyxwvutsrqponmlkjihgfedcba',
  '0123456789',
  '9876543210',
  'qwertyuiop',
  'asdfghjkl',
  'zxcvbnm'
];

/**
 * Calculate password entropy
 */
const calculateEntropy = (password) => {
  let poolSize = 0;
  if (/[a-z]/.test(password)) poolSize += 26;
  if (/[A-Z]/.test(password)) poolSize += 26;
  if (/[0-9]/.test(password)) poolSize += 10;
  if (/[^a-zA-Z0-9]/.test(password)) poolSize += 33;
  
  if (poolSize === 0) return 0;
  
  return password.length * Math.log2(poolSize);
};

/**
 * Estimate crack time based on entropy
 */
const estimateCrackTime = (entropy) => {
  // Assuming 10 billion guesses per second (high-end GPU cluster)
  const guessesPerSecond = 10_000_000_000;
  const combinations = Math.pow(2, entropy);
  const seconds = combinations / guessesPerSecond;
  
  // CAP the value to prevent MySQL overflow (max ~999 trillion years)
  const MAX_SECONDS = 99999999999999999999.99; // ~3.17e11 years
  
  const cappedSeconds = Math.min(seconds, MAX_SECONDS);
  
  let display;
  if (cappedSeconds < 1) display = 'Instant';
  else if (cappedSeconds < 60) display = `${Math.round(cappedSeconds)} seconds`;
  else if (cappedSeconds < 3600) display = `${Math.round(cappedSeconds / 60)} minutes`;
  else if (cappedSeconds < 86400) display = `${Math.round(cappedSeconds / 3600)} hours`;
  else if (cappedSeconds < 31536000) display = `${Math.round(cappedSeconds / 86400)} days`;
  else if (cappedSeconds < 3153600000) display = `${Math.round(cappedSeconds / 31536000)} years`;
  else if (cappedSeconds < 315360000000) display = `${Math.round(cappedSeconds / 3153600000)} centuries`;
  else display = 'Forever';
  
  return { 
    seconds: parseFloat(cappedSeconds.toFixed(2)), 
    display 
  };
};

/**
 * Check for sequential characters
 */
const hasSequentialChars = (password) => {
  const lower = password.toLowerCase();
  for (const seq of SEQUENCES) {
    for (let i = 0; i <= seq.length - 3; i++) {
      const substring = seq.substring(i, i + 3);
      if (lower.includes(substring)) return true;
    }
  }
  return false;
};

/**
 * Check for repeated characters
 */
const hasRepeatedChars = (password) => {
  return /(.)\1{2,}/.test(password);
};

/**
 * Check for keyboard patterns
 */
const hasKeyboardPatterns = (password) => {
  const patterns = ['qwe', 'wer', 'ert', 'rty', 'tyu', 'yui', 'uio', 'iop',
                    'asd', 'sdf', 'dfg', 'fgh', 'ghj', 'hjk', 'jkl',
                    'zxc', 'xcv', 'cvb', 'vbn', 'bnm'];
  const lower = password.toLowerCase();
  return patterns.some(p => lower.includes(p));
};

/**
 * Main analysis function
 */
const analyzePassword = (password) => {
  const length = password.length;
  
  // Rule checks
  const rules = {
    hasMinLength: length >= 8,
    hasMaxLength: length <= 128,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumbers: /[0-9]/.test(password),
    hasSpecialChars: /[^a-zA-Z0-9]/.test(password),
    noCommonPatterns: !COMMON_PATTERNS.some(p => password.toLowerCase().includes(p)),
    noSequentialChars: !hasSequentialChars(password),
    noRepeatedChars: !hasRepeatedChars(password),
    noKeyboardPatterns: !hasKeyboardPatterns(password),
    hasMinLength12: length >= 12,
    hasMinLength16: length >= 16
  };

  // Calculate score (0-100)
  let score = 0;
  
  // Length scoring (up to 40 points)
  if (length >= 8) score += 10;
  if (length >= 12) score += 10;
  if (length >= 16) score += 10;
  if (length >= 20) score += 10;
  
  // Character variety (up to 40 points)
  if (rules.hasUppercase) score += 10;
  if (rules.hasLowercase) score += 10;
  if (rules.hasNumbers) score += 10;
  if (rules.hasSpecialChars) score += 10;
  
  // Security bonuses (up to 20 points)
  if (rules.noCommonPatterns) score += 5;
  if (rules.noSequentialChars) score += 5;
  if (rules.noRepeatedChars) score += 5;
  if (rules.noKeyboardPatterns) score += 5;
  
  // Penalties
  if (length < 8) score = Math.min(score, 20);
  if (!rules.noCommonPatterns) score = Math.min(score, 30);
  
  score = Math.max(0, Math.min(100, score));
  
  // Determine label
  let strengthLabel;
  if (score < 20) strengthLabel = 'Very Weak';
  else if (score < 40) strengthLabel = 'Weak';
  else if (score < 60) strengthLabel = 'Fair';
  else if (score < 80) strengthLabel = 'Good';
  else if (score < 90) strengthLabel = 'Strong';
  else strengthLabel = 'Very Strong';
  
  // Entropy and crack time
  const entropy = calculateEntropy(password);
  const crackTime = estimateCrackTime(entropy);
  
  // Generate recommendations
  const recommendations = [];
  if (!rules.hasMinLength) recommendations.push('Use at least 8 characters');
  if (!rules.hasMinLength12) recommendations.push('Consider using 12+ characters for better security');
  if (!rules.hasUppercase) recommendations.push('Add uppercase letters (A-Z)');
  if (!rules.hasLowercase) recommendations.push('Add lowercase letters (a-z)');
  if (!rules.hasNumbers) recommendations.push('Add numbers (0-9)');
  if (!rules.hasSpecialChars) recommendations.push('Add special characters (!@#$%^&*)');
  if (!rules.noCommonPatterns) recommendations.push('Avoid common words and patterns');
  if (!rules.noSequentialChars) recommendations.push('Avoid sequential characters (abc, 123)');
  if (!rules.noRepeatedChars) recommendations.push('Avoid repeated characters (aaa, 111)');
  if (!rules.noKeyboardPatterns) recommendations.push('Avoid keyboard patterns (qwerty, asdf)');
  if (length > 128) recommendations.push('Password is too long (max 128 characters)');
  
  if (recommendations.length === 0) {
    recommendations.push('Excellent password! Consider using a password manager to store it securely.');
  }
  
  // Hash password for storage (never store plain text)
  const passwordHash = crypto.createHash('sha256').update(password).digest('hex');
  
  return {
    passwordHash,
    strengthScore: score,
    strengthLabel,
    length,
    rules,
    entropy: parseFloat(entropy.toFixed(2)),
    crackTimeSeconds: parseFloat(crackTime.seconds.toFixed(2)),
    crackTimeDisplay: crackTime.display,
    recommendations
  };
};

module.exports = {
  analyzePassword,
  calculateEntropy,
  estimateCrackTime
};