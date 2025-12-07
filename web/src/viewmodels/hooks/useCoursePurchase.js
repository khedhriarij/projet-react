// src/viewmodels/hooks/useCoursePurchase.js - UPDATED WITH CART SUPPORT
import { useAuthContext } from './useAuthContext';
import { paymentService } from '../../services/paymentService';
import firebase from 'firebase/app';
import 'firebase/firestore';

export const useCoursePurchase = () => {
  const { user } = useAuthContext();
  const db = firebase.firestore();

  const hasPurchasedCourse = async (courseId) => {
    if (!user) {
      console.log('🔐 User not logged in');
      return false;
    }

    try {
      const courseIdNum = typeof courseId === 'string' ? parseInt(courseId) : courseId;
      
      console.log('🔍 Checking purchase for:', {
        userId: user.uid,
        courseId: courseIdNum
      });

      const snapshot = await db.collection('purchases')
        .where('userId', '==', user.uid)
        .where('courseId', '==', courseIdNum)
        .where('status', '==', 'completed')
        .limit(1)
        .get();

      const hasPurchased = !snapshot.empty;
      
      console.log('📋 Purchase check result:', {
        hasPurchased,
        documentsFound: snapshot.size
      });

      return hasPurchased;
    } catch (error) {
      console.error('❌ Error checking purchase:', error);
      return false;
    }
  };

  const getPurchasedCourses = async () => {
    if (!user) {
      console.log('🔐 User not logged in - getPurchasedCourses');
      return [];
    }

    try {
      console.log('🔍 Fetching purchased courses for user:', user.uid);

      const snapshot = await db.collection('purchases')
        .where('userId', '==', user.uid)
        .where('status', '==', 'completed')
        .get();

      console.log('📚 Purchased courses found:', snapshot.size);

      const purchasedCourses = snapshot.docs.map(doc => {
        const purchaseData = doc.data();
        return {
          purchaseId: doc.id,
          ...purchaseData,
          id: purchaseData.courseId,
          title: purchaseData.courseData?.title || 'Titre non disponible',
          image: purchaseData.courseData?.image || '/images/default-course.jpg',
          instructor: purchaseData.courseData?.instructor || 'Instructeur inconnu',
          progress: purchaseData.progress || 0,
          purchasedAt: purchaseData.purchasedAt?.toDate() || new Date()
        };
      });

      console.log('📋 Final purchased courses:', purchasedCourses);
      return purchasedCourses;
    } catch (error) {
      console.error('❌ Error fetching purchased courses:', error);
      return [];
    }
  };

  const purchaseCourse = async (courseId, courseData) => {
    console.log('🔄 Starting purchase process for your Firestore');
    
    if (!user) {
      alert('Veuillez vous connecter pour acheter un cours');
      return false;
    }

    try {
      const courseIdNum = typeof courseId === 'string' ? parseInt(courseId) : courseId;

      const purchaseRef = await db.collection('purchases').add({
        userId: user.uid,
        courseId: courseIdNum,
        courseData: {
          title: courseData.title,
          image: courseData.image,
          instructor: courseData.instructor,
          price: courseData.price,
          originalPrice: courseData.originalPrice
        },
        amount: courseData.price,
        currency: 'TND',
        status: 'pending',
        progress: 0,
        completedLessons: [],
        purchasedAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      console.log('📝 Pending purchase created in Firestore:', purchaseRef.id);

      const paymentModel = {
        courseId: courseIdNum,
        amount: courseData.price,
        userId: user.uid,
        currency: 'TND'
      };

      const result = await paymentService.createPayment(paymentModel, user);
      
      if (result.success && result.redirect_url) {
        await purchaseRef.update({
          paymeeToken: result.token
        });

        console.log('💾 Paymee token saved to Firestore:', result.token);

        const pendingPayment = {
          purchaseId: purchaseRef.id,
          userId: user.uid,
          courseId: courseIdNum,
          courseData: courseData,
          amount: courseData.price,
          paymeeToken: result.token,
          timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('pending_payment', JSON.stringify(pendingPayment));
        console.log('💾 Pending payment saved to localStorage with token');

        console.log('🔗 Redirecting to Paymee...');
        window.location.href = result.redirect_url;
        return true;
      } else {
        await purchaseRef.update({
          status: 'failed',
          error: result.message
        });
        
        localStorage.removeItem('pending_payment');
        alert(result.message || 'Erreur lors de la création du paiement');
        return false;
      }
    } catch (error) {
      console.error('💥 Purchase error:', error);
      localStorage.removeItem('pending_payment');
      alert('Erreur lors du processus d\'achat');
      return false;
    }
  };

  // ADD THIS NEW FUNCTION FOR CART PURCHASES
  const purchaseCart = async (cartItems, totalAmount) => {
    console.log('🔄 Starting cart purchase process');
    
    if (!user) {
      alert('Veuillez vous connecter pour acheter');
      return false;
    }

    try {
      // Create a bundle purchase record
      const purchaseRef = await db.collection('purchases').add({
        userId: user.uid,
        courseId: `CART_${Date.now()}`,
        courseData: {
          title: `Panier de ${cartItems.length} cours`,
          image: cartItems[0]?.image || '/images/default-course.jpg',
          instructor: 'Multiples formateurs',
          price: totalAmount,
          originalPrice: totalAmount * 1.2
        },
        amount: totalAmount,
        currency: 'TND',
        status: 'pending',
        progress: 0,
        completedLessons: [],
        purchasedAt: firebase.firestore.FieldValue.serverTimestamp(),
        cartItems: cartItems,
        isBundle: true
      });

      console.log('📝 Cart purchase created in Firestore:', purchaseRef.id);

      const paymentModel = {
        courseId: purchaseRef.id,
        amount: totalAmount,
        userId: user.uid,
        currency: 'TND'
      };

      const result = await paymentService.createPayment(paymentModel, user);
      
      if (result.success && result.redirect_url) {
        await purchaseRef.update({
          paymeeToken: result.token
        });

        const pendingPayment = {
          purchaseId: purchaseRef.id,
          userId: user.uid,
          courseId: purchaseRef.id,
          courseData: {
            title: `Panier de ${cartItems.length} cours`,
            price: totalAmount
          },
          cartItems: cartItems,
          isBundle: true,
          amount: totalAmount,
          paymeeToken: result.token,
          timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('pending_payment', JSON.stringify(pendingPayment));
        console.log('💾 Cart pending payment saved');

        window.location.href = result.redirect_url;
        return true;
      } else {
        await purchaseRef.update({
          status: 'failed',
          error: result.message
        });
        
        localStorage.removeItem('pending_payment');
        alert(result.message || 'Erreur lors de la création du paiement');
        return false;
      }
    } catch (error) {
      console.error('💥 Cart purchase error:', error);
      localStorage.removeItem('pending_payment');
      alert('Erreur lors du processus d\'achat du panier');
      return false;
    }
  };

  return {
    hasPurchasedCourse,
    getPurchasedCourses,
    purchaseCourse,
    purchaseCart // ADD THIS TO THE RETURN OBJECT
  };
};