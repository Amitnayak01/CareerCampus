const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  inputData: {
    qualification: { type: String, required: true },
    stream: { type: String, required: true },
    interests: [{ type: String }],
    skills: [{ type: String }],
    goals: { type: String }
  },
  recommendedCareers: [{
    career: { type: mongoose.Schema.Types.ObjectId, ref: 'Career' },
    matchScore: { type: Number, min: 0, max: 100 },
    reasons: [{ type: String }]
  }],
  jobOpportunities: [{ type: String }],
  certificationSuggestions: [{ type: String }],
  higherStudiesOptions: [{ type: String }],
  roadmap: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Recommendation', recommendationSchema);
