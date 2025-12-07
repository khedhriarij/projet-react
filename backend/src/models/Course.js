// backend/models/Course.js
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  description: { type: String, required: true },
  shortDescription: String,
  instructor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  category: { type: String, required: true },
  subcategory: String,
  price: { type: Number, required: true, default: 0 },
  discountPrice: Number,
  isFree: { type: Boolean, default: false },
  level: { 
    type: String, 
    enum: ['beginner', 'intermediate', 'advanced'], 
    default: 'beginner' 
  },
  duration: { type: Number, default: 0 }, // en heures
  totalLessons: { type: Number, default: 0 },
  thumbnailUrl: String,
  promoVideoUrl: String,
  tags: [String],
  rating: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 },
  totalEnrollments: { type: Number, default: 0 },
  requirements: [String],
  learningOutcomes: [String],
  certificateAvailable: { type: Boolean, default: false },
  status: { 
    type: String, 
    enum: ['draft', 'published', 'archived'], 
    default: 'draft' 
  },
  language: { type: String, default: 'fr' },
  publishedAt: Date
}, {
  timestamps: true
});

courseSchema.index({ title: 'text', description: 'text', tags: 'text' });
courseSchema.index({ category: 1, price: 1 });
courseSchema.index({ instructor: 1, status: 1 });

module.exports = mongoose.model('Course', courseSchema);