const express = require('express');
const { body } = require('express-validator');
const { getCareers, getCareer, createCareer, updateCareer, deleteCareer, getCareerStats } = require('../controllers/careerController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

const careerValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('description').notEmpty().withMessage('Description is required')
];

router.get('/', getCareers);
router.get('/stats', protect, adminOnly, getCareerStats);
router.get('/:id', getCareer);
router.post('/', protect, adminOnly, careerValidation, createCareer);
router.put('/:id', protect, adminOnly, updateCareer);
router.delete('/:id', protect, adminOnly, deleteCareer);

module.exports = router;
