const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  courseId: {
    type: Number,
    required: true,
    index: true
  },
  sectionId: {
    type: String,
    required: true
  },
  lessonNumber: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  duration: {
    type: String,
    required: true
  },
  videoUrl: {
    type: String,
    required: true
  },
  videoProvider: {
    type: String,
    enum: ['youtube', 'vimeo', 'direct', 'external'],
    default: 'youtube'
  },
  videoId: {
    type: String
  },
  pdfUrl: {
    type: String
  },
  resources: [{
    type: {
      type: String,
      enum: ['pdf', 'exercise', 'code', 'link', 'video', 'image']
    },
    title: String,
    url: String,
    description: String,
    fileSize: Number
  }],
  isPremium: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: String,
    default: 'system'
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'published'
  }
}, {
  timestamps: true
});

// Index pour les requêtes fréquentes
lessonSchema.index({ courseId: 1, sectionId: 1, lessonNumber: 1 });

module.exports = mongoose.model('Lesson', lessonSchema);