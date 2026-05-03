const mongoose = require('mongoose');

const careerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Career title is required'],
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['technology', 'medical', 'business', 'arts', 'engineering', 'law', 'education', 'science', 'design', 'finance', 'government', 'agriculture', 'other']
  },
  description: {
    type: String,
    required: true
  },
  shortDescription: { type: String },
  icon: { type: String, default: '💼' },
  color: { type: String, default: '#6366f1' },
  eligibility: {
    minQualification: {
      type: String,
      enum: ['10th', '12th', 'diploma', 'graduation', 'post-graduation']
    },
    requiredStreams: [{ type: String }],
    minAge: { type: Number },
    maxAge: { type: Number }
  },
  requiredSkills: [{ type: String }],
  recommendedCourses: [{ type: String }],
  certifications: [{ type: String }],
  salaryInsights: {
    entry: { type: String },
    mid: { type: String },
    senior: { type: String },
    currency: { type: String, default: 'INR' }
  },
  workCulture: {
    type: { type: String },
    environment: { type: String },
    workHours: { type: String },
    remote: { type: Boolean, default: false }
  },
  futureScope: { type: String },
  jobRoles: [{ type: String }],
  topCompanies: [{ type: String }],
  higherStudies: [{ type: String }],
  streams: [{ type: String }],
  tags: [{ type: String }],
  difficulty: {
    type: String,
    enum: ['easy', 'moderate', 'hard'],
    default: 'moderate'
  },
  growthRate: { type: String },
  demandLevel: {
    type: String,
    enum: ['low', 'medium', 'high', 'very-high'],
    default: 'medium'
  },
  isActive: { type: Boolean, default: true },
  views: { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

careerSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Career', careerSchema);
