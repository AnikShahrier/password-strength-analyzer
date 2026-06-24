const crypto = require('crypto');

const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const NUMBERS = '0123456789';
const SPECIAL = '!@#$%^&*()_+-=[]{}|;:,.<>?';

/**
 * Generate a strong password with guaranteed character types
 */
const generateStrongPassword = (options = {}) => {
  const {
    length = 16,
    includeUppercase = true,
    includeLowercase = true,
    includeNumbers = true,
    includeSpecial = true,
    excludeAmbiguous = false
  } = options;

  let charset = '';
  let password = '';
  const guaranteed = [];

  // Ambiguous characters to exclude (optional)
  const ambiguous = '0O1lI';
  
  let effectiveLower = excludeAmbiguous ? LOWERCASE.replace(/[l]/g, '') : LOWERCASE;
  let effectiveUpper = excludeAmbiguous ? UPPERCASE.replace(/[O]/g, '') : UPPERCASE;
  let effectiveNumbers = excludeAmbiguous ? NUMBERS.replace(/[01]/g, '') : NUMBERS;

  if (includeLowercase) {
    charset += effectiveLower;
    guaranteed.push(effectiveLower[crypto.randomInt(effectiveLower.length)]);
  }
  if (includeUppercase) {
    charset += effectiveUpper;
    guaranteed.push(effectiveUpper[crypto.randomInt(effectiveUpper.length)]);
  }
  if (includeNumbers) {
    charset += effectiveNumbers;
    guaranteed.push(effectiveNumbers[crypto.randomInt(effectiveNumbers.length)]);
  }
  if (includeSpecial) {
    charset += SPECIAL;
    guaranteed.push(SPECIAL[crypto.randomInt(SPECIAL.length)]);
  }

  if (charset === '') {
    throw new Error('At least one character type must be selected');
  }

  // Fill remaining length
  const remainingLength = length - guaranteed.length;
  for (let i = 0; i < remainingLength; i++) {
    password += charset[crypto.randomInt(charset.length)];
  }

  // Add guaranteed characters
  password += guaranteed.join('');

  // Shuffle the password
  password = password.split('').sort(() => crypto.randomInt(3) - 1).join('');

  return password;
};

/**
 * Generate multiple password options
 */
const generatePasswordOptions = () => {
  return {
    easyToSay: generateStrongPassword({ 
      length: 16, 
      includeSpecial: false, 
      includeNumbers: false 
    }),
    easyToRead: generateStrongPassword({ 
      length: 16, 
      excludeAmbiguous: true 
    }),
    allCharacters: generateStrongPassword({ 
      length: 20, 
      includeSpecial: true 
    }),
    memorable: generateMemorablePassword()
  };
};

/**
 * Generate a memorable passphrase
 */
const generateMemorablePassword = () => {
  const words = [
    'Tiger', 'River', 'Mountain', 'Crystal', 'Thunder', 'Dragon',
    'Phoenix', 'Ocean', 'Forest', 'Diamond', 'Eagle', 'Rocket',
    'Quantum', 'Nebula', 'Solar', 'Lunar', 'Cosmic', 'Stellar',
    'Frozen', 'Silent', 'Brave', 'Swift', 'Bright', 'Golden'
  ];
  
  const word1 = words[crypto.randomInt(words.length)];
  const word2 = words[crypto.randomInt(words.length)];
  const num = crypto.randomInt(10, 99);
  const special = SPECIAL[crypto.randomInt(SPECIAL.length)];
  
  return `${word1}${special}${num}${word2}`;
};

module.exports = {
  generateStrongPassword,
  generatePasswordOptions,
  generateMemorablePassword
};