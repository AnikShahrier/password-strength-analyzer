const express = require('express');
const router = express.Router();
const {
  analyzePasswordStrength,
  revealPassword,
  generatePassword,
  getLastPassword,
  getHistory,
  getStats,
  getAnalysisById
} = require('../controllers/analysisController');

// POST /api/analysis/analyze
router.post('/analyze', analyzePasswordStrength);

// POST /api/analysis/:id/reveal - Reveal password
router.post('/:id/reveal', revealPassword);

// GET /api/analysis/generate
router.get('/generate', generatePassword);

// GET /api/analysis/last
router.get('/last', getLastPassword);

// GET /api/analysis/history
router.get('/history', getHistory);

// GET /api/analysis/stats
router.get('/stats', getStats);

// GET /api/analysis/:id
router.get('/:id', getAnalysisById);

module.exports = router;