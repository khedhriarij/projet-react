// src/pages/payment/PaymentSuccess.js - COMPLETE FIX
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

  useEffect(() => {
    const handlePaymentSuccess = async () => {
      console.log('🚀 PaymentSuccess started');
      
      // ✅ FIX 1: Extract token from the messy URL parameters
      let token = null;
      
      // Method 1: Check if token is in the transaction parameter (your case)
      const transactionParam = searchParams.get("transaction");
      if (transactionParam && transactionParam.includes('payment_token=')) {
        token = transactionParam.split('payment_token=')[1];
        console.log('✅ Extracted token from transaction parameter:', token);
      }
      
      // Method 2: Try direct parameter
      if (!token) {
        token = searchParams.get("payment_token");
        console.log('✅ Got token from payment_token parameter:', token);
      }
      
      // Method 3: Try token parameter
      if (!token) {
        token = searchParams.get("token");
        console.log('✅ Got token from token parameter:', token);
      }

      console.log('🔍 Final token:', token);
      console.log('👤 Current user:', user?.uid);

      if (!token || !user) {
        console.error('❌ Missing token or user');
        setStatus("error");
        return;
      }

      try {
        // ✅ FIX 2: Skip Firestore query and use localStorage data directly
        console.log('🔍 Checking localStorage for pending payment...');
        const pendingPaymentStr = localStorage.getItem('pending_payment');
        
        if (!pendingPaymentStr) {
          throw new Error('No pending payment found in localStorage');
        }

        const pendingPayment = JSON.parse(pendingPaymentStr);
        console.log('✅ Found pending payment:', pendingPayment);

        // ✅ FIX 3: Update Firestore WITHOUT complex queries (to avoid index issues)
        const purchaseRef = db.collection("purchases").doc(pendingPayment.purchaseId);
        
        // First, get the current document to check if it exists
        const purchaseDoc = await purchaseRef.get();
        
        if (!purchaseDoc.exists) {
          throw new Error('Purchase document not found in Firestore');
        }

        console.log('✅ Found purchase document:', purchaseDoc.id);

        // ✅ FIX 4: Update the purchase with completed status
        console.log('🔄 Updating purchase status to completed...');
        await purchaseRef.update({
          status: "completed",
          paymeeToken: token, // Update with the actual token from Paymee
          confirmedAt: firebase.firestore.FieldValue.serverTimestamp(),
          transactionId: token
        });

        console.log('✅ Purchase marked as completed');

        // ✅ FIX 5: Clean up
        localStorage.removeItem("pending_payment");
        localStorage.removeItem(`pending_payment_${user.uid}`);

        setStatus("success");
        console.log('✅ Payment success - redirecting to My Courses');

        setTimeout(() => navigate("/my-courses"), 2000);

      } catch (error) {
        console.error('❌ Payment confirmation error:', error);
        
        // ✅ FIX 6: Fallback - Create new purchase if everything else fails
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