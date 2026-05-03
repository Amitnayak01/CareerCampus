const express = require('express');
const { body } = require('express-validator');
const {
  createQuery,
  getMyQueries,
  deleteMyQuery,
  getAllQueries,
  replyToQuery,
  updateQueryStatus,
  getQueryStats,
  deleteQuery
} = require('../controllers/queryController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// ── Optional auth middleware ──────────────────────────────────────────────────
// Attaches req.user if a valid token is present, but does NOT block the request
// if there is no token. This lets logged-in users have their queries linked.
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return next();
  const jwt = require('jsonwebtoken');
  try {
    const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
    req.user = decoded; // { id, name, email, role }
  } catch {
    // invalid/expired token — just continue as guest
  }
  next();
};

const queryValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('subject').trim().notEmpty().withMessage('Subject is required'),
  body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters'),
];

// Public / Student routes
router.post('/',          optionalAuth, queryValidation, createQuery);  // ← optionalAuth added
router.get('/mine',       protect, getMyQueries);
router.delete('/mine/:id', protect, deleteMyQuery);

// Admin routes
router.get('/stats',      protect, adminOnly, getQueryStats);
router.get('/',           protect, adminOnly, getAllQueries);
router.post('/:id/reply', protect, adminOnly, replyToQuery);
router.put('/:id/status', protect, adminOnly, updateQueryStatus);
router.delete('/:id',     protect, adminOnly, deleteQuery);

module.exports = router;