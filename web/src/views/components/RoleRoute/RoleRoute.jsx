// src/components/RoleRoute/RoleRoute.jsx
import { useRole } from '../../viewmodels/hooks/useRole';
import { Navigate } from 'react-router-dom';

const RoleRoute = ({ children, requiredRole, exact = false }) => {
  const { hasPermission, isExactly, loading, role } = useRole();
  
  if (loading) {
    return (
      <div className="loading-container">
        <div>Vérification des permissions...</div>
      </div>
    );
  }
  
  // Vérification exacte ou hiérarchique
  const hasAccess = exact ? isExactly(requiredRole) : hasPermission(requiredRole);
  
  if (!hasAccess) {
    console.warn(`Accès refusé. Rôle actuel: ${role}, Rôle requis: ${requiredRole}`);
    return <Navigate to="/unauthorized" replace />;
  }
  
  return children;
};

export default RoleRoute;