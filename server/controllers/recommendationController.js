const Career = require('../models/Career');
const Recommendation = require('../models/Recommendation');
const {
  calculateMatchScore,
  generateJobOpportunities,
  generateCertifications,
  generateHigherStudies,
  generateRoadmap
} = require('../utils/recommendationEngine');

// @desc    Generate career recommendations
// @route   POST /api/recommendations
const generateRecommendations = async (req, res) => {
  try {
    const { qualification, stream, interests, skills, goals } = req.body;
    if (!qualification || !stream) {
      return res.status(400).json({ error: 'Qualification and stream are required.' });
    }

    // Fetch all active careers
    const allCareers = await Career.find({ isActive: true });

    // Score each career
    const scoredCareers = allCareers.map(career => {
      const { score, reasons } = calculateMatchScore(career, { qualification, stream, interests: interests || [] });
      return { career, matchScore: score, reasons };
    });

    // Sort by score and take top 10
    const topCareers = scoredCareers
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 10);

    // Generate supporting data
    const jobOpportunities = generateJobOpportunities(topCareers, qualification, stream);
    const certificationSuggestions = generateCertifications(topCareers);
    const higherStudiesOptions = generateHigherStudies(topCareers, qualification);
    const roadmap = generateRoadmap(topCareers[0], qualification);

    // Save recommendation if user is logged in
    let savedRecommendation = null;
    if (req.user) {
      savedRecommendation = await Recommendation.create({
        student: req.user.id,
        inputData: { qualification, stream, interests: interests || [], skills: skills || [], goals: goals || '' },
        recommendedCareers: topCareers.map(item => ({
          career: item.career._id,
          matchScore: item.matchScore,
          reasons: item.reasons
        })),
        jobOpportunities,
        certificationSuggestions,
        higherStudiesOptions,
        roadmap
      });
    }

    res.json({
      success: true,
      recommendation: {
        id: savedRecommendation?._id,
        careers: topCareers,
        jobOpportunities,
        certificationSuggestions,
        higherStudiesOptions,
        roadmap
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate recommendations.' });
  }
};

// @desc    Get student's recommendation history
// @route   GET /api/recommendations/history
const getRecommendationHistory = async (req, res) => {
  try {
    const recommendations = await Recommendation.find({ student: req.user.id })
      .populate('recommendedCareers.career', 'title category icon color')
      .sort({ createdAt: -1 })
      .limit(10);
    res.json({ success: true, recommendations });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recommendation history.' });
  }
};

// @desc    Get all recommendations (admin)
// @route   GET /api/recommendations/all
const getAllRecommendations = async (req, res) => {
  try {
    const recommendations = await Recommendation.find()
      .populate('student', 'name email')
      .sort({ createdAt: -1 })
      .limit(50);
    const total = await Recommendation.countDocuments();
    res.json({ success: true, recommendations, total });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recommendations.' });
  }
};

module.exports = { generateRecommendations, getRecommendationHistory, getAllRecommendations };
