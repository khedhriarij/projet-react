// backend/models/Lesson.js (version finale)
const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['pdf', 'exercise', 'code', 'link', 'video', 'image', 'quiz'],
    required: true
  },
  title: { type: String, required: true },
  url: { type: String, required: true },
  description: String,
  fileSize: Number,
  duration: Number // pour les vidéos
});

const lessonSchema = new mongoose.Schema({
  courseId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Course', 
    required: true,
    index: true 
  },
  sectionId: { type: String, required: true },
  lessonNumber: { type: Number, required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  content: String, // Contenu HTML/Markdown
  duration: { type: Number, default: 0 }, // en minutes
  videoUrl: String,
  videoProvider: {
    type: String,
    enum: ['youtube', 'vimeo', 'direct', 'firebase'],
    default: 'youtube'
  },
  videoId: String,
  thumbnailUrl: String,
  resources: [resourceSchema],
  isPremium: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
  prerequisites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
  completionCriteria: {
    type: { type: String, enum: ['watch', 'quiz', 'both'], default: 'watch' },
    minQuizScore: { type: Number, default: 70 }
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'published'
  },
  views: { type: Number, default: 0 }
}, {
  timestamps: true
});

// Index composites pour performances
lessonSchema.index({ courseId: 1, sectionId: 1, lessonNumber: 1 });
lessonSchema.index({ courseId: 1, isPremium: 1 });
lessonSchema.index({ courseId: 1, status: 1 });

module.exports = mongoose.model('Lesson', lessonSchema);