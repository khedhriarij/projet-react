// backend/models/Payment.js
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  courseId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Course', 
    required: true 
  },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'TND' },
  reference: { type: String, required: true, unique: true },
  paymeeToken: String,
  paymentUrl: String,
  status: { 
    type: String, 
    enum: ['pending', 'completed', 'failed', 'cancelled'], 
    default: 'pending' 
  },
  paymentMethod: String,
  transactionId: String,
  metadata: mongoose.Schema.Types.Mixed,
  processedAt: Date,
  webhookReceived: { type: Boolean, default: false }
}, {
  timestamps: true
});

paymentSchema.index({ userId: 1, status: 1 });
paymentSchema.index({ reference: 1 });

module.exports = mongoose.model('Payment', paymentSchema);