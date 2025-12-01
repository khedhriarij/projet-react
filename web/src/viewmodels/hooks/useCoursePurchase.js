// src/viewmodels/hooks/useCoursePurchase.js - VERSION CORRECTE
import { useAuthContext } from './useAuthContext';
import { paymentService } from '../../services/paymentService';
import firebase from 'firebase/app';
import 'firebase/firestore';

export const useCoursePurchase = () => {
  const { user } = useAuthContext();
  const db = firebase.firestore();

  // Vérifie si un cours est acheté (via Firestore)
  const hasPurchasedCourse = async (courseId) => {
    if (!user) return false;
    
    const snapshot = await db.collection('purchases')
      .where('userId', '==', user.uid)
      .where('courseId', '==', courseId)
      .where('status', '==', 'completed')
      .limit(1)
      .get();

    return !snapshot.empty;
  };

  // Récupère les cours achetés (via Firestore)
  const getPurchasedCourses = async () => {
    if (!user) return [];

    const snapshot = await db.collection('purchases')
      .where('userId', '==', user.uid)
      .where('status', '==', 'completed')
      .get();

    return snapshot.docs.map(doc => ({
      purchaseId: doc.id,
      ...doc.data()
    }));
  };

  // PROCESSUS DE PAIEMENT RÉEL
  const purchaseCourse = async (courseId, courseData) => {
    if (!user) {
      alert('Veuillez vous connecter pour acheter un cours');
      return false;
    }

    try {
      // 1. Créer un achat en attente dans Firestore
      const purchaseRef = await db.collection('purchases').add({
        userId: user.uid,
        courseId: courseId,
        courseData: courseData,
        amount: courseData.price,
        currency: 'TND',
        status: 'pending',
        progress: 0,
        completedLessons: [],
        purchasedAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      // 2. Créer le paiement avec Paymee
      const paymentModel = {
        courseId: courseId,
        amount: courseData.price,
        userId: user.uid,
        currency: 'TND'
      };

      const result = await paymentService.createPayment(paymentModel, user);
      
      if (result.success && result.redirect_url) {
        // 3. Sauvegarder le token Paymee
        await purchaseRef.update({
          paymeeToken: result.token
        });

        // 4. Stocker les infos en attendant la confirmation
        const pendingPayment = {
          purchaseId: purchaseRef.id,
          userId: user.uid,
          courseId: courseId,
          courseData: courseData,
          amount: courseData.price,
          paymeeToken: result.token
        };
        
        localStorage.setItem('pending_payment', JSON.stringify(pendingPayment));

        // 5. Rediriger vers Paymee
        window.location.href = result.redirect_url;
        return true;
      } else {
        await purchaseRef.update({ status: 'failed', error: result.message });
        alert(result.message || 'Erreur lors de la création du paiement');
        return false;
      }
    } catch (error) {
  console.error('Erreur achat:', error);
  alert('Erreur lors du processus d\'achat');
  return false;
}
  };

  return {
    hasPurchasedCourse,
    getPurchasedCourses,
    purchaseCourse
  };
};