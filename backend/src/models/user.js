// backend/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  displayName: String,
  photoURL: String,
  role: { 
    type: String, 
    enum: ['student', 'instructor', 'admin'], 
    default: 'student' 
  },
  enrolledCourses: [{
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    enrolledAt: { type: Date, default: Date.now },
    completed: { type: Boolean, default: false },
    progress: { type: Number, default: 0 }
  }],
  purchases: [{
    paymentId: String,
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    amount: Number,
    status: String,
    purchaseDate: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now },
  lastLogin: Date
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);