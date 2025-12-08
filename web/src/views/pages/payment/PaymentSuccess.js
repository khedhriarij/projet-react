import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthContext } from '../../../viewmodels/hooks/useAuthContext';
import firebase from 'firebase/app';
import 'firebase/firestore';
import './payment.css';

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuthContext();
  const [status, setStatus] = useState('processing');
  const db = firebase.firestore();

  const handleCartPurchase = async (pendingPayment, token) => {
    try {
      if (pendingPayment.cartItems && pendingPayment.isBundle) {
        const batch = db.batch();
        
        // Create purchase for each course in the cart
        for (const course of pendingPayment.cartItems) {
          const purchaseRef = db.collection("purchases").doc();
          
          batch.set(purchaseRef, {
            userId: user.uid,
            courseId: course.id,
            courseData: {
              title: course.title,
              image: course.image,
              instructor: course.instructor,
              price: course.price,
              originalPrice: course.originalPrice
            },
            amount: course.price,
            currency: 'TND',
            paymeeToken: token,
            status: "completed",
            progress: 0,
            completedLessons: [],
            purchasedAt: firebase.firestore.FieldValue.serverTimestamp(),
            confirmedAt: firebase.firestore.FieldValue.serverTimestamp(),
            transactionId: token,
            fromCart: true,
            cartPurchaseId: pendingPayment.purchaseId
          });
        }
        
        // Commit all purchases in one batch
        await batch.commit();
        console.log(`✅ Created ${pendingPayment.cartItems.length} purchase records from cart`);
      }
    } catch (error) {
      console.error('Error creating cart purchases:', error);
      throw error;
    }
  };

  useEffect(() => {
    const handlePaymentSuccess = async () => {
      console.log('🚀 PaymentSuccess started');
      
      let token = null;
      const transactionParam = searchParams.get("transaction");
      
      if (transactionParam && transactionParam.includes('payment_token=')) {
        token = transactionParam.split('payment_token=')[1];
        console.log('✅ Extracted token from transaction parameter:', token);
      }
      
      if (!token) {
        token = searchParams.get("payment_token");
      }
      
      if (!token) {
        token = searchParams.get("token");
      }

      console.log('🔍 Final token:', token);
      console.log('👤 Current user:', user?.uid);

      if (!token || !user) {
        console.error('❌ Missing token or user');
        setStatus("error");
        return;
      }

      try {
        console.log('🔍 Checking localStorage for pending payment...');
        const pendingPaymentStr = localStorage.getItem('pending_payment');
        
        if (!pendingPaymentStr) {
          throw new Error('No pending payment found in localStorage');
        }

        const pendingPayment = JSON.parse(pendingPaymentStr);
        console.log('✅ Found pending payment:', pendingPayment);

        // Check if it's a cart purchase
        if (pendingPayment.isBundle && pendingPayment.cartItems) {
          // Handle cart purchase
          await handleCartPurchase(pendingPayment, token);
        } else {
          // Handle single course purchase
          const purchaseRef = db.collection("purchases").doc(pendingPayment.purchaseId);
          const purchaseDoc = await purchaseRef.get();
          
          if (purchaseDoc.exists) {
            console.log('✅ Found purchase document:', purchaseDoc.id);
            
            await purchaseRef.update({
              status: "completed",
              paymeeToken: token,
              confirmedAt: firebase.firestore.FieldValue.serverTimestamp(),
              transactionId: token
            });
            
            console.log('✅ Purchase marked as completed');
          } else {
            console.warn('⚠️ Purchase document not found, creating fallback...');
            await db.collection("purchases").add({
              userId: user.uid,
              courseId: pendingPayment.courseId,
              courseData: pendingPayment.courseData,
              amount: pendingPayment.amount,
              currency: 'TND',
              paymeeToken: token,
              status: 'completed',
              progress: 0,
              completedLessons: [],
              purchasedAt: firebase.firestore.FieldValue.serverTimestamp(),
              confirmedAt: firebase.firestore.FieldValue.serverTimestamp(),
              transactionId: token
            });
          }
        }

        // Clean up
        localStorage.removeItem("pending_payment");
        localStorage.removeItem(`pending_payment_${user.uid}`);

        setStatus("success");
        console.log('✅ Payment success - redirecting to My Courses');

        setTimeout(() => navigate("/my-courses"), 2000);

      } catch (error) {
        console.error('❌ Payment confirmation error:', error);
        
        // Fallback
        try {
          console.log('🔄 Trying fallback creation...');
          const pendingPaymentStr = localStorage.getItem('pending_payment');
          
          if (pendingPaymentStr) {
            const pendingPayment = JSON.parse(pendingPaymentStr);
            
            await db.collection("purchases").add({
              userId: user.uid,
              courseId: pendingPayment.courseId,
              courseData: pendingPayment.courseData,
              amount: pendingPayment.amount,
              currency: 'TND',
              paymeeToken: token,
              status: 'completed',
              progress: 0,
              completedLessons: [],
              purchasedAt: firebase.firestore.FieldValue.serverTimestamp(),
              confirmedAt: firebase.firestore.FieldValue.serverTimestamp(),
              transactionId: token
            });
            
            console.log('✅ Fallback purchase created successfully');
            localStorage.removeItem("pending_payment");
            setStatus("success");
            setTimeout(() => navigate("/my-courses"), 2000);
            return;
          }
        } catch (fallbackError) {
          console.error('❌ Fallback also failed:', fallbackError);
        }
        
        setStatus("error");
      }
    };

    if (user) {
      handlePaymentSuccess();
    } else {
      console.error('❌ User not authenticated');
      setStatus("error");
    }
  }, [user, searchParams, navigate, db]);

  return (
    <div className="payment-result-page">
      <div className="payment-result-content">
        {status === "processing" && (
          <>
            <div className="loading-spinner large"></div>
            <h2>Traitement de votre paiement...</h2>
            <p>Veuillez patienter pendant la confirmation.</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="success-icon">✅</div>
            <h2>Paiement Confirmé !</h2>
            <p>Votre cours a été ajouté à votre compte.</p>
            <p>Redirection vers vos cours...</p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="error-icon">❌</div>
            <h2>Erreur de Confirmation</h2>
            <p>Le paiement n'a pas pu être confirmé automatiquement.</p>
            <p>Votre cours devrait apparaître dans vos cours sous peu.</p>
            <div className="action-buttons">
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/my-courses')}
              >
                Vérifier mes cours
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => navigate('/catalog')}
              >
                Retour au catalogue
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
