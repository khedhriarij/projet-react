import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './App.css';
import { CourseProvider } from './context/CourContext'; 

// Import de tous les composants
import UserDashboard from './pages/dashboard/UserDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import Dashboard from './pages/dashboard/Dashboard';
import Create from './pages/create/Create';
import Login from './pages/login/Login';
import Signup from './pages/signup/Signup';
import Project from './pages/project/Project';
import Catalog from './pages/catalog/Catalog';
import CourseDetail from './pages/course/CourseDetail';
import MyCourses from './pages/my-courses/MyCourses';

// Import des composants UI
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import OnlineUsers from './components/OnlineUsers';

// Import des hooks et composants de protection
import { useAuthContext } from './hooks/useAuthContext';
import AdminRoute from './components/AdminRoute';
import { useAdmin } from './hooks/UseAdmin';

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
        
      </div>
    );
  }
  
  return (
    <CourseProvider>
      <div className="App">
        <BrowserRouter>
          {user && <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />}
          <div className='container'>
            <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
            <Routes>
              {/* Route principale - Redirection intelligente */}
             <Route 
  path="/" 
  element={
    user ? (
      <Navigate to="/catalog" replace /> 
    ) : (
      <Navigate to="/login" replace />
    )
  } 
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
              
              {/* Dashboard original (gardé pour compatibilité) */}
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
              
              {/* Catalogue des cours - PAGE D'ACCUEIL PRINCIPALE */}
              <Route 
                path="/catalog" 
                element={user ? <Catalog /> : <Navigate to="/login" replace />} 
              />
              
              {/* Détail du cours */}
              <Route 
                path="/course/:id" 
                element={user ? <CourseDetail /> : <Navigate to="/login" replace />} 
              />
              
              {/* Mes cours */}
              <Route 
                path="/my-courses" 
                element={user ? <MyCourses /> : <Navigate to="/login" replace />} 
              />
              
              {/* Login - OUVERT DIRECTEMENT */}
              <Route 
                path="/login" 
                element={!user ? <Login /> : <Navigate to="/" replace />} 
              />
              
              <Route 
                path="/signup"  
                element={!user ? <Signup /> : <Navigate to="/" replace />} 
              />
              
              <Route 
                path="/projects/:id" 
                element={user ? <Project /> : <Navigate to="/login" replace />} 
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
    </CourseProvider> 
  );
}

export default App;