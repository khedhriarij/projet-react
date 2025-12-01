// src/models/PaymentModel.js
export class PaymentModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.courseId = data.courseId || null;
    this.amount = data.amount || 0;
    this.currency = data.currency || 'TND';
    this.status = data.status || 'pending'; // pending, completed, failed, cancelled
    this.paymeeToken = data.paymeeToken || null;
    this.transactionId = data.transactionId || null;
    this.userId = data.userId || null;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

export class CoursePurchaseModel {
  constructor(data = {}) {
    this.courseId = data.courseId || null;
    this.userId = data.userId || null;
    this.purchasedAt = data.purchasedAt || new Date().toISOString();
    this.paymentToken = data.paymentToken || null;
    this.progress = data.progress || 0;
    this.completedLessons = data.completedLessons || [];
    this.courseData = data.courseData || {};
  }
}