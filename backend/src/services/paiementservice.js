// backend/services/PaymentService.js
const axios = require('axios');
const paymeeConfig = require('../config/paymee');
const Payment = require('../models/payment');
const Course = require('../models/Course');

class PaymentService {
  async createPayment(userId, courseId) {
    try {
      const course = await Course.findById(courseId);
      if (!course) throw new Error('Cours non trouvé');
      
      // Générer référence unique
      const reference = `PAY_${Date.now()}_${userId.substring(0,8)}`;
      
      const paymentData = {
        amount: course.price,
        note: `Paiement pour le cours: ${course.title}`,
        first_name: req.user.displayName || 'Client',
        last_name: 'EduPlatform',
        email: req.user.email,
        phone_number: '20000000', // À adapter
        return_url: `${process.env.FRONTEND_URL}/payment/success`,
        cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
        webhook_url: `${process.env.BACKEND_URL}/api/payment/webhook`,
        order_id: reference
      };
      
      const response = await axios.post(
        `${paymeeConfig.urls.base}${paymeeConfig.urls.checkout}`,
        paymentData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${paymeeConfig.apiToken}`
          }
        }
      );
      
      // Sauvegarder dans MongoDB
      const payment = new Payment({
        userId,
        courseId,
        amount: course.price,
        reference,
        paymeeToken: response.data.data.token,
        paymentUrl: response.data.data.payment_url,
        status: 'pending'
      });
      
      await payment.save();
      
      return {
        paymentUrl: response.data.data.payment_url,
        reference,
        token: response.data.data.token
      };
      
    } catch (error) {
      console.error('Erreur création paiement:', error);
      throw error;
    }
  }
  
  async verifyPayment(token) {
    try {
      const response = await axios.get(
        `${paymeeConfig.urls.base}${paymeeConfig.urls.verify}/${token}`,
        {
          headers: {
            'Authorization': `Token ${paymeeConfig.apiToken}`
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Erreur vérification paiement:', error);
      throw error;
    }
  }
}

module.exports = PaymentService;