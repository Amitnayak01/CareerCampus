const express = require('express');
const { body } = require('express-validator');
const { createQuery, getMyQueries, getAllQueries, replyToQuery, updateQueryStatus, getQueryStats, deleteQuery } = require('../controllers/queryController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

const queryValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('subject').trim().notEmpty().withMessage('Subject is required'),
  body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters')
];

router.post('/', queryValidation, createQuery);
router.get('/mine', protect, getMyQueries);
router.get('/stats', protect, adminOnly, getQueryStats);
router.get('/', protect, adminOnly, getAllQueries);
router.post('/:id/reply', protect, adminOnly, replyToQuery);
router.put('/:id/status', protect, adminOnly, updateQueryStatus);
router.delete('/:id', protect, adminOnly, deleteQuery);


module.exports = router;
