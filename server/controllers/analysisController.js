const { pool } = require('../config/db');
const { analyzePassword } = require('../utils/passwordAnalyzer');
const { generatePasswordOptions } = require('../utils/passwordGenerator');
const crypto = require('crypto');

// Simple encryption key (in production, use env variable)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'your-32-char-secret-key-here!!';
const IV_LENGTH = 16;

// Encrypt password for storage
const encryptPassword = (text) => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY.padEnd(32).slice(0, 32)), iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
};

// Decrypt password for reveal
const decryptPassword = (encryptedText) => {
  try {
    const parts = encryptedText.split(':');
    const iv = Buffer.from(parts.shift(), 'hex');
    const encrypted = parts.join(':');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY.padEnd(32).slice(0, 32)), iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (err) {
    return null;
  }
};

// In-memory store for last password (per IP)
const lastPasswordStore = new Map();

/**
 * Analyze password strength
 * POST /api/analysis/analyze
 */
const analyzePasswordStrength = async (req, res, next) => {
  try {
    const { password } = req.body;
    const clientIp = req.ip || req.connection.remoteAddress;
    
    if (!password || typeof password !== 'string') {
      return res.status(400).json({ 
        success: false,
        message: 'Password is required and must be a string' 
      });
    }
    
    if (password.length > 128) {
      return res.status(400).json({
        success: false,
        message: 'Password must not exceed 128 characters'
      });
    }
    
    const analysis = analyzePassword(password);
    const encryptedPassword = encryptPassword(password);
    
    const [result] = await pool.execute(
      `INSERT INTO analysis_history 
       (password_hash, password_encrypted, strength_score, strength_label, length, 
        has_uppercase, has_lowercase, has_numbers, has_special_chars, 
        has_min_length, no_common_patterns, entropy, 
        crack_time_seconds, crack_time_display, recommendations)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        analysis.passwordHash,
        encryptedPassword,
        analysis.strengthScore,
        analysis.strengthLabel,
        analysis.length,
        analysis.rules.hasUppercase ? 1 : 0,
        analysis.rules.hasLowercase ? 1 : 0,
        analysis.rules.hasNumbers ? 1 : 0,
        analysis.rules.hasSpecialChars ? 1 : 0,
        analysis.rules.hasMinLength ? 1 : 0,
        analysis.rules.noCommonPatterns ? 1 : 0,
        analysis.entropy,
        analysis.crackTimeSeconds,
        analysis.crackTimeDisplay,
        JSON.stringify(analysis.recommendations)
      ]
    );
    
    lastPasswordStore.set(clientIp, {
      id: result.insertId,
      hash: analysis.passwordHash,
      score: analysis.strengthScore,
      label: analysis.strengthLabel,
      length: analysis.length,
      timestamp: new Date().toISOString()
    });
    
    res.status(201).json({
      success: true,
      data: {
        id: result.insertId,
        strengthScore: analysis.strengthScore,
        strengthLabel: analysis.strengthLabel,
        length: analysis.length,
        rules: analysis.rules,
        entropy: analysis.entropy,
        crackTime: {
          seconds: analysis.crackTimeSeconds,
          display: analysis.crackTimeDisplay
        },
        recommendations: analysis.recommendations,
        createdAt: new Date().toISOString()
      }
    });
    
  } catch (error) {
    next(error);
  }
};

/**
 * Reveal password by ID
 * POST /api/analysis/:id/reveal
 */
const revealPassword = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const [rows] = await pool.execute(
      `SELECT password_encrypted, password_hash 
       FROM analysis_history 
       WHERE id = ?`,
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Analysis not found'
      });
    }
    
    const encryptedPassword = rows[0].password_encrypted;
    
    if (!encryptedPassword) {
      return res.status(404).json({
        success: false,
        message: 'Password not available for this analysis'
      });
    }
    
    const decryptedPassword = decryptPassword(encryptedPassword);
    
    if (!decryptedPassword) {
      return res.status(500).json({
        success: false,
        message: 'Failed to decrypt password'
      });
    }
    
    res.json({
      success: true,
      data: {
        password: decryptedPassword,
        length: decryptedPassword.length
      }
    });
    
  } catch (error) {
    next(error);
  }
};

/**
 * Generate strong password suggestions
 * GET /api/analysis/generate
 */
const generatePassword = async (req, res, next) => {
  try {
    const options = generatePasswordOptions();
    
    const analyzedOptions = {};
    
    for (const [key, password] of Object.entries(options)) {
      const analysis = analyzePassword(password);
      analyzedOptions[key] = {
        password,
        score: analysis.strengthScore,
        label: analysis.strengthLabel,
        length: analysis.length,
        crackTime: analysis.crackTimeDisplay,
        entropy: analysis.entropy
      };
    }
    
    res.json({
      success: true,
      data: analyzedOptions
    });
    
  } catch (error) {
    next(error);
  }
};

/**
 * Get last analyzed password info
 * GET /api/analysis/last
 */
const getLastPassword = async (req, res, next) => {
  try {
    const clientIp = req.ip || req.connection.remoteAddress;
    const lastPassword = lastPasswordStore.get(clientIp);
    
    if (!lastPassword) {
      return res.json({
        success: true,
        data: null,
        message: 'No password analyzed yet in this session'
      });
    }
    
    const [rows] = await pool.execute(
      `SELECT AVG(strength_score) as avg_score, 
              MAX(strength_score) as max_score,
              COUNT(*) as total
       FROM analysis_history`
    );
    
    const stats = rows[0];
    
    res.json({
      success: true,
      data: {
        lastPassword: {
          ...lastPassword,
          hash: lastPassword.hash.substring(0, 16) + '...'
        },
        comparison: {
          yourScore: lastPassword.score,
          averageScore: parseFloat(stats.avg_score || 0).toFixed(1),
          maxScore: stats.max_score || 0,
          totalAnalyses: stats.total || 0,
          isAboveAverage: lastPassword.score > (stats.avg_score || 0)
        }
      }
    });
    
  } catch (error) {
    next(error);
  }
};

/**
 * Get analysis history
 * GET /api/analysis/history
 */
const getHistory = async (req, res, next) => {
  try {
    const limit = Number(req.query.limit) || 50;
    const offset = Number(req.query.offset) || 0;
    
    const [countResult] = await pool.execute(
      'SELECT COUNT(*) as total FROM analysis_history'
    );
    const total = countResult[0].total;
    
    const [rows] = await pool.query(
      `SELECT id, strength_score, strength_label, length, 
              has_uppercase, has_lowercase, has_numbers, has_special_chars,
              has_min_length, no_common_patterns, entropy,
              crack_time_display, recommendations, created_at,
              CASE WHEN password_encrypted IS NOT NULL THEN 1 ELSE 0 END as can_reveal
       FROM analysis_history
       ORDER BY created_at DESC
       LIMIT ${limit} OFFSET ${offset}`
    );
    
    res.json({
      success: true,
      data: rows.map(row => ({
        id: row.id,
        strengthScore: row.strength_score,
        strengthLabel: row.strength_label,
        length: row.length,
        canReveal: row.can_reveal === 1,
        rules: {
          hasUppercase: row.has_uppercase === 1,
          hasLowercase: row.has_lowercase === 1,
          hasNumbers: row.has_numbers === 1,
          hasSpecialChars: row.has_special_chars === 1,
          hasMinLength: row.has_min_length === 1,
          noCommonPatterns: row.no_common_patterns === 1
        },
        entropy: parseFloat(row.entropy),
        crackTimeDisplay: row.crack_time_display,
        recommendations: typeof row.recommendations === 'string' 
          ? JSON.parse(row.recommendations) 
          : row.recommendations,
        createdAt: row.created_at
      })),
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });
    
  } catch (error) {
    next(error);
  }
};

/**
 * Get statistics
 * GET /api/analysis/stats
 */
const getStats = async (req, res, next) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        COUNT(*) as total_analyses,
        AVG(strength_score) as avg_score,
        MAX(strength_score) as max_score,
        MIN(strength_score) as min_score,
        SUM(CASE WHEN strength_score >= 80 THEN 1 ELSE 0 END) as strong_count,
        SUM(CASE WHEN strength_score < 40 THEN 1 ELSE 0 END) as weak_count
      FROM analysis_history
    `);
    
    const stats = rows[0];
    
    res.json({
      success: true,
      data: {
        totalAnalyses: parseInt(stats.total_analyses),
        averageScore: parseFloat(parseFloat(stats.avg_score || 0).toFixed(2)),
        maxScore: parseInt(stats.max_score || 0),
        minScore: parseInt(stats.min_score || 0),
        strongPasswords: parseInt(stats.strong_count || 0),
        weakPasswords: parseInt(stats.weak_count || 0)
      }
    });
    
  } catch (error) {
    next(error);
  }
};

/**
 * Get analysis by ID
 * GET /api/analysis/:id
 */
const getAnalysisById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const [rows] = await pool.execute(
      `SELECT id, strength_score, strength_label, length,
              has_uppercase, has_lowercase, has_numbers, has_special_chars,
              has_min_length, no_common_patterns, entropy,
              crack_time_display, recommendations, created_at,
              CASE WHEN password_encrypted IS NOT NULL THEN 1 ELSE 0 END as can_reveal
       FROM analysis_history
       WHERE id = ?`,
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Analysis not found'
      });
    }
    
    const row = rows[0];
    
    res.json({
      success: true,
      data: {
        id: row.id,
        strengthScore: row.strength_score,
        strengthLabel: row.strength_label,
        length: row.length,
        canReveal: row.can_reveal === 1,
        rules: {
          hasUppercase: row.has_uppercase === 1,
          hasLowercase: row.has_lowercase === 1,
          hasNumbers: row.has_numbers === 1,
          hasSpecialChars: row.has_special_chars === 1,
          hasMinLength: row.has_min_length === 1,
          noCommonPatterns: row.no_common_patterns === 1
        },
        entropy: parseFloat(row.entropy),
        crackTimeDisplay: row.crack_time_display,
        recommendations: typeof row.recommendations === 'string' 
          ? JSON.parse(row.recommendations) 
          : row.recommendations,
        createdAt: row.created_at
      }
    });
    
  } catch (error) {
    next(error);
  }
};

module.exports = {
  analyzePasswordStrength,
  revealPassword,
  generatePassword,
  getLastPassword,
  getHistory,
  getStats,
  getAnalysisById
};