const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  courseId: { 
    type: Number, 
    required: true 
  },
  lessonId: { 
    type: String, 
    required: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['pdf', 'video', 'code', 'document', 'image'],
    required: true 
  },
  url: { 
    type: String, 
    required: true 
  },
  size: { 
    type: Number 
  },
  mimeType: { 
    type: String 
  },
  description: { 
    type: String 
  },
  storageProvider: { 
    type: String,
    enum: ['firebase', 'mongodb', 'external', 'local'],
    default: 'external'
  },
  uploadDate: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('File', fileSchema);