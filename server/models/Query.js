const mongoose = require('mongoose');

const querySchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  subject: { type: String, required: true, trim: true },
  message: { type: String, required: true },
  category: {
    type: String,
    enum: ['career-guidance', 'technical-support', 'general', 'admission', 'scholarship', 'other'],
    default: 'general'
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'resolved', 'closed'],
    default: 'open'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  replies: [{
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    adminName: { type: String },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }],
  resolvedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Query', querySchema);
