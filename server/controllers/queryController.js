const { validationResult } = require('express-validator');
const Query = require('../models/Query');

// @desc    Create a new query/contact
// @route   POST /api/queries
const createQuery = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { name, email, subject, message, category } = req.body;
    const queryData = { name, email, subject, message, category };
    if (req.user) queryData.student = req.user.id;
    const query = await Query.create(queryData);
    res.status(201).json({ success: true, message: 'Your query has been submitted! We\'ll get back to you soon.', query });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit query.' });
  }
};

// @desc    Get my queries (student)
// @route   GET /api/queries/mine
const getMyQueries = async (req, res) => {
  try {
    const queries = await Query.find({ student: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, queries });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch your queries.' });
  }
};

// @desc    Get all queries (admin)
// @route   GET /api/queries
const getAllQueries = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status && status !== 'all') filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [queries, total] = await Promise.all([
      Query.find(filter).populate('student', 'name email').sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      Query.countDocuments(filter)
    ]);
    res.json({ success: true, queries, total, pages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch queries.' });
  }
};

// @desc    Reply to query (admin)
// @route   POST /api/queries/:id/reply
const replyToQuery = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Reply message is required.' });
    const query = await Query.findByIdAndUpdate(
      req.params.id,
      {
        $push: { replies: { admin: req.user.id, adminName: req.user.name, message } },
        status: 'in-progress'
      },
      { new: true }
    );
    if (!query) return res.status(404).json({ error: 'Query not found.' });
    res.json({ success: true, message: 'Reply sent successfully!', query });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send reply.' });
  }
};

// @desc    Update query status (admin)
// @route   PUT /api/queries/:id/status
const updateQueryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const update = { status };
    if (status === 'resolved') update.resolvedAt = new Date();
    const query = await Query.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!query) return res.status(404).json({ error: 'Query not found.' });
    res.json({ success: true, message: 'Status updated!', query });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update status.' });
  }
};

// @desc    Get query stats (admin)
// @route   GET /api/queries/stats
const getQueryStats = async (req, res) => {
  try {
    const stats = await Query.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const total = await Query.countDocuments();
    res.json({ success: true, stats, total });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats.' });
  }
};


// @desc    Delete a query (admin)
// @route   DELETE /api/queries/:id
const deleteQuery = async (req, res) => {
  try {
    const query = await Query.findByIdAndDelete(req.params.id);
    if (!query) return res.status(404).json({ error: 'Query not found.' });
    res.json({ success: true, message: 'Query deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete query.' });
  }
};

module.exports = { createQuery, getMyQueries, getAllQueries, replyToQuery, updateQueryStatus, getQueryStats, deleteQuery };