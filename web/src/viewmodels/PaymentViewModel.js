// src/viewmodels/PaymentViewModel.js
import { useState } from 'react';
import { paymentService } from '../services/paymentService';
import { PaymentModel, CoursePurchaseModel } from '../models/PaymentModel';

export const usePaymentViewModel = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [error, setError] = useState(null);

  const initiatePayment = async (course, user) => {
    setIsProcessing(true);
    setError(null);

    try {
      const paymentData = new PaymentModel({
        courseId: course.id,
        amount: course.price,
        userId: user?.uid,
        currency: 'TND'
      });

      const result = await paymentService.createPayment(paymentData, user);
      
      if (result.success) {
        // Stocker temporairement les infos de paiement
        const pendingPayment = {
          ...paymentData,
          paymeeToken: result.token,
          status: 'pending'
        };
        
        paymentService.storePendingPayment(pendingPayment, user.uid);
        return result;
      } else {
        throw new Error(result.message || 'Erreur lors de la création du paiement');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  const verifyPayment = async (token, userId) => {
    try {
      const result = await paymentService.verifyPayment(token);
      
      if (result.success && result.payment.status === 'success') {
        // Finaliser l'achat
        const success = await finalizePurchase(token, userId);
        return { success, payment: result.payment };
      }
      
      return { success: false, payment: result.payment };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const finalizePurchase = async (paymentToken, userId) => {
    const pendingPayment = paymentService.getPendingPayment(userId);
    
    if (pendingPayment && pendingPayment.paymeeToken === paymentToken) {
      const purchase = new CoursePurchaseModel({
        courseId: pendingPayment.courseId,
        userId: userId,
        paymentToken: paymentToken,
        courseData: pendingPayment.courseData
      });

      const success = await paymentService.savePurchase(purchase, userId);
      
      if (success) {
        paymentService.clearPendingPayment(userId);
        return true;
      }
    }
    
    return false;
  };

  const checkPendingPayment = (userId) => {
    return paymentService.getPendingPayment(userId);
  };

  return {
    // State
    isProcessing,
    paymentStatus,
    error,
    
    // Actions
    initiatePayment,
    verifyPayment,
    finalizePurchase,
    checkPendingPayment,
    
    // Getters
    hasError: !!error,
    isPaymentSuccessful: paymentStatus === 'completed'
  };
};