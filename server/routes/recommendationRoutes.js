const express = require('express');
const { generateRecommendations, getRecommendationHistory, getAllRecommendations } = require('../controllers/recommendationController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.post('/', generateRecommendations);
router.get('/history', protect, getRecommendationHistory);
router.get('/all', protect, adminOnly, getAllRecommendations);

module.exports = router;
