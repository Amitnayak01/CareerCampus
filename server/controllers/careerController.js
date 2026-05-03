const { validationResult } = require('express-validator');
const Career = require('../models/Career');

// @desc    Get all careers with filtering
// @route   GET /api/careers
const getCareers = async (req, res) => {
  try {
    const { category, stream, search, sort, page = 1, limit = 12, demandLevel } = req.query;
    const query = { isActive: true };
    if (category && category !== 'all') query.category = category;
    if (stream) query.streams = { $in: [stream] };
    if (demandLevel) query.demandLevel = demandLevel;
    if (search) query.$text = { $search: search };

    const sortOptions = {
      'newest': { createdAt: -1 },
      'oldest': { createdAt: 1 },
      'popular': { views: -1 },
      'salary-high': { 'salaryInsights.senior': -1 },
      'az': { title: 1 }
    };
    const sortBy = sortOptions[sort] || { createdAt: -1 };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [careers, total] = await Promise.all([
      Career.find(query).sort(sortBy).skip(skip).limit(parseInt(limit)),
      Career.countDocuments(query)
    ]);

    res.json({
      success: true,
      careers,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch careers.' });
  }
};

// @desc    Get single career
// @route   GET /api/careers/:id
const getCareer = async (req, res) => {
  try {
    const career = await Career.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!career) return res.status(404).json({ error: 'Career not found.' });
    res.json({ success: true, career });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch career.' });
  }
};

// @desc    Create career (admin)
// @route   POST /api/careers
const createCareer = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const career = await Career.create({ ...req.body, createdBy: req.user.id });
    res.status(201).json({ success: true, message: 'Career created successfully!', career });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create career.' });
  }
};

// @desc    Update career (admin)
// @route   PUT /api/careers/:id
const updateCareer = async (req, res) => {
  try {
    const career = await Career.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!career) return res.status(404).json({ error: 'Career not found.' });
    res.json({ success: true, message: 'Career updated successfully!', career });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update career.' });
  }
};

// @desc    Delete career (admin)
// @route   DELETE /api/careers/:id
const deleteCareer = async (req, res) => {
  try {
    const career = await Career.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!career) return res.status(404).json({ error: 'Career not found.' });
    res.json({ success: true, message: 'Career deleted successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete career.' });
  }
};

// @desc    Get career statistics (admin)
// @route   GET /api/careers/stats
const getCareerStats = async (req, res) => {
  try {
    const [total, byCategory, topViewed] = await Promise.all([
      Career.countDocuments({ isActive: true }),
      Career.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      Career.find({ isActive: true }).sort({ views: -1 }).limit(5).select('title views category')
    ]);
    res.json({ success: true, stats: { total, byCategory, topViewed } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats.' });
  }
};

module.exports = { getCareers, getCareer, createCareer, updateCareer, deleteCareer, getCareerStats };
