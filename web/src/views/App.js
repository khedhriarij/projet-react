import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../styles/App.css';
//import logo from '../assets/learnup_logo.jpeg';

import CoursePlayer from './pages/course/CoursePlayer';
import TestMongoConnection from './components/TestMongoConnection';
// Context
import { CourseProvider } from '../viewmodels/context/CourContext'; 
import { QuizProvider } from '../viewmodels/context/QuizContext';

import QuizList from './components/Quiz/QuizList.jsx';
import QuizPlayer from './components/Quiz/QuizPlayer.jsx';
import QuizResults from './components/Quiz/QuizResults.jsx';
import QuizBuilder from './components/Quiz/QuizBuilder.jsx';
import QuizManagement from './components/Quiz/QuizManagement.jsx';

// Pages
import UserDashboard from './pages/dashboard/UserDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import Dashboard from './pages/dashboard/Dashboard';
import Create from './pages/create/Create';
import Login from './pages/login/Login';
import Signup from './pages/signup/Signup';
import Catalog from './pages/catalog/Catalog';
import CourseDetail from './pages/course/CourseDetail';
import MyCourses from './pages/my-courses/MyCourses';

// ✅ AJOUT CRITIQUE : Paiement Stripe
import PaymentSuccess from './pages/payment/PaymentSuccess';
import PaymentCancel from './pages/payment/PaymentCancel';

// Import des composants UI
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import OnlineUsers from './components/OnlineUsers';
import CertificatePage from './pages/CertificatePage/CertificatePage';

// Import des hooks et composants de protection
import { useAuthContext } from '../viewmodels/hooks/useAuthContext';
import AdminRoute from './components/AdminRoute';
import { useAdmin } from '../viewmodels/hooks/UseAdmin';
import ProfileForm from './components/Profile/ProfileForm';
import PublicCertificateVerification from './components/Certificate/PublicCertificateVerification';
import AdminCertificateManager from './pages/dashboard/admin/AdminCertificateManager';

function App() {
  const { user, authIsReady } = useAuthContext();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  useEffect(() => {
    console.log('=== APP COMPONENT ===');
    console.log('Auth is ready:', authIsReady);
    console.log('User:', user);
    console.log('Is Admin:', isAdmin);
  }, [user, authIsReady, isAdmin]);

  if (!authIsReady || adminLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '1.2em'
      }}>
        Chargement...
      </div>
    );
  }
  
  return (
    <CourseProvider>
      <QuizProvider>
        <div className="App">
          <BrowserRouter>
            {user && <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />}
            <div className='container'>
              <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
              <Routes>
                {/* Route principale */}
                <Route 
                  path="/" 
                  element={
                    user ? <Navigate to="/catalog" replace /> : <Navigate to="/login" replace />
                  } 
                />
                
                {/* ✅ ROUTES DE PAIEMENT STRIPE (AJOUT CRITIQUE) */}
                <Route 
                  path="/payment/success" 
                  element={user ? <PaymentSuccess /> : <Navigate to="/login" replace />} 
                />
                <Route 
                  path="/payment/cancel" 
                  element={user ? <PaymentCancel /> : <Navigate to="/login" replace />} 
                />
                
                {/* Dashboard Admin */}
                <Route 
                  path="/admin-dashboard" 
                  element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  } 
                />
                
                {/* Dashboard Utilisateur */}
                <Route 
                  path="/user-dashboard" 
                  element={user ? <UserDashboard /> : <Navigate to="/login" replace />} 
                />
                
                {/* Dashboard original */}
                <Route 
                  path="/dashboard" 
                  element={
                    <AdminRoute>
                      <Dashboard />
                    </AdminRoute>
                  } 
                />
                
                {/* Création de cours pour admin */}
                <Route 
                  path="/create" 
                  element={
                    <AdminRoute>
                      <Create />
                    </AdminRoute>
                  } 
                />
                
                {/* Catalogue des cours */}
                <Route 
                  path="/catalog" 
                  element={user ? <Catalog /> : <Navigate to="/login" replace />} 
                />
                
                {/* Détail du cours */}
                <Route 
                  path="/course/:id" 
                  element={user ? <CourseDetail /> : <Navigate to="/login" replace />} 
                />
                
                {/* Lecture du cours */}
                <Route 
                  path="/course/:id/learn" 
                  element={user ? <CoursePlayer /> : <Navigate to="/login" replace />} 
                />
                
                {/* Mes cours */}
                <Route 
                  path="/my-courses" 
                  element={user ? <MyCourses /> : <Navigate to="/login" replace />} 
                />
                
                {/* Routes Quiz */}
                <Route 
                  path="/admin/quiz/*" 
                  element={
                    <AdminRoute>
                      <QuizManagement />
                    </AdminRoute>
                  } 
                />
                
                <Route 
                  path="/quiz/:quizId" 
                  element={user ? <QuizPlayer /> : <Navigate to="/login" replace />} 
                />
                
                <Route 
                  path="/quiz/results/:quizId" 
                  element={user ? <QuizResults /> : <Navigate to="/login" replace />} 
                />
                
                {/* Certificats */}
                <Route 
                  path="/certificates" 
                  element={user ? <CertificatePage /> : <Navigate to="/login" replace />} 
                />
                
                <Route 
                  path="/verify-certificate/:certificateId" 
                  element={<PublicCertificateVerification />} 
                />
                
                <Route 
                  path="/admin/certificates" 
                  element={
                    <AdminRoute>
                      <AdminCertificateManager />
                    </AdminRoute>
                  } 
                />
                
                {/* Profil */}
                <Route 
                  path="/profile" 
                  element={user ? <ProfileForm /> : <Navigate to="/login" replace />} 
                />
                
                {/* Login/Signup */}
                <Route 
                  path="/login" 
                  element={!user ? <Login /> : <Navigate to="/" replace />} 
                />
                
                <Route 
                  path="/signup"  
                  element={!user ? <Signup /> : <Navigate to="/" replace />} 
                />
                
                {/* Test MongoDB */}
                <Route path="/test-mongo" element={<TestMongoConnection />} />
                
                {/* Routes quiz supplémentaires */}
                <Route 
                  path="/quiz-builder" 
                  element={
                    <AdminRoute>
                      <QuizBuilder />
                    </AdminRoute>
                  } 
                />
                
                <Route 
                  path="/quiz-list" 
                  element={user ? <QuizList /> : <Navigate to="/login" replace />} 
                />
                
                {/* Route fallback */}
                <Route 
                  path="*" 
                  element={<Navigate to="/" replace />} 
                />
              </Routes>
            </div>
            {user && <OnlineUsers/>}
          </BrowserRouter>
        </div>
      </QuizProvider>
    </CourseProvider> 
  );
}

export default App;