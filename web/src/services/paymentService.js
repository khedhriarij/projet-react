// src/services/paymentService.js
import { PaymentModel, CoursePurchaseModel } from '../models/PaymentModel';

class PaymentService {
  constructor() {
    this.apiKey = process.env.REACT_APP_PAYMEE_API_KEY;
    this.baseUrl = process.env.REACT_APP_PAYMEE_ENVIRONMENT === 'production' 
      ? 'https://paymee.tn/api/v2/payments'
      : 'https://sandbox.paymee.tn/api/v2/payments';
  }

  async createPayment(paymentModel, user) {
    console.log('🔄 [DEBUG] createPayment appelée');
    const baseUrl = process.env.REACT_APP_BASE_URL;

    // ✅ CORRECTION : Structure EXACTE de Paymee
    const paymentData = {
      amount: paymentModel.amount,
      note: `Achat cours: ${paymentModel.courseId}`,
      first_name: user?.displayName?.split(' ')[0] || 'Client',
      last_name: user?.displayName?.split(' ')[1] || 'EduPlatform',
      email: user?.email || 'client@example.com',
      phone: '+21611111111',
      return_url: `${baseUrl}/payment/success`, // ✅ REMOVE TEMPLATE PARAMETERS
      cancel_url: `${baseUrl}/payment/cancel`,  
      webhook_url: `${baseUrl}/api/payment/webhook`,
      order_id: `COURSE_${paymentModel.courseId}_${Date.now()}`,
    };

    console.log('📤 [DEBUG] Données envoyées à Paymee:', paymentData);

    try {
      const response = await fetch(`${this.baseUrl}/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${this.apiKey}`
        },
        body: JSON.stringify(paymentData)
      });

      console.log('📥 [DEBUG] Réponse reçue - Status:', response.status);

      const responseText = await response.text();
      console.log('📥 [DEBUG] Réponse texte:', responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        throw new Error(`Réponse non-JSON: ${responseText}`);
      }

      console.log('✅ [DEBUG] Réponse Paymee complète:', data);

      if (!response.ok) {
        throw new Error(data.message || `Erreur HTTP: ${response.status}`);
      }

      // ✅ CORRECTION : Structure de réponse Paymee (avec "data" et "payment_url")
      if (data.status && data.data) {
        return {
          success: true,
          token: data.data.token,
          redirect_url: data.data.payment_url, // ✅ "payment_url" pas "redirect_url"
          payment: data.data
        };
      } else {
        throw new Error(data.message || 'Erreur Paymee');
      }
    } catch (error) {
      console.error('💥 [DEBUG] Erreur complète:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  async verifyPayment(token) {
    try {
      console.log('🔍 [PAYMEE] Verifying payment with token:', token);
      
      const response = await fetch(`${this.baseUrl}/${token}`, {
        headers: {
          'Authorization': `Token ${this.apiKey}`
        }
      });

      console.log('📨 [PAYMEE] Verification response status:', response.status);

      if (!response.ok) {
        throw new Error(`Erreur vérification: ${response.status}`);
      }

      const data = await response.json();
      console.log('📄 [PAYMEE] Verification response data:', data);

      // Paymee might return data in different structures
      const paymentData = data.data || data.result || data;
      
      return {
        success: true,
        payment: paymentData
      };
    } catch (error) {
      console.error('❌ [PAYMEE] Verification error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Gestion des paiements en attente (localStorage temporaire)
  storePendingPayment(paymentModel, userId) {
    const pendingPayment = {
      ...paymentModel,
      userId: userId,
      storedAt: new Date().toISOString()
    };
    
    localStorage.setItem(`pending_payment_${userId}`, JSON.stringify(pendingPayment));
  }

  getPendingPayment(userId) {
    const pending = localStorage.getItem(`pending_payment_${userId}`);
    return pending ? JSON.parse(pending) : null;
  }

  clearPendingPayment(userId) {
    localStorage.removeItem(`pending_payment_${userId}`);
  }

  // Gestion des achats (à remplacer par Firebase plus tard)
  async savePurchase(purchaseModel, userId) {
    try {
      const purchasedCourses = this.getPurchasedCourses(userId);
      
      // Vérifier si le cours n'est pas déjà acheté
      if (!purchasedCourses.find(course => course.courseId === purchaseModel.courseId)) {
        purchasedCourses.push(purchaseModel);
        localStorage.setItem(`purchasedCourses_${userId}`, JSON.stringify(purchasedCourses));
      }
      
      return true;
    } catch (error) {
      console.error('PaymentService - Erreur sauvegarde achat:', error);
      return false;
    }
  }

  getPurchasedCourses(userId) {
    return JSON.parse(localStorage.getItem(`purchasedCourses_${userId}`) || '[]');
  }

  hasPurchasedCourse(userId, courseId) {
    const purchasedCourses = this.getPurchasedCourses(userId);
    return purchasedCourses.some(course => course.courseId === courseId);
  }
}

export const paymentService = new PaymentService();