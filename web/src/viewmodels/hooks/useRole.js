// src/viewmodels/hooks/useRole.js
import { useUserProfile } from './useUserProfile';

export const useRole = () => {
  const { profile, loading } = useUserProfile();
  
  // Vérifications de rôle
  const isAdmin = profile?.role === 'admin';
  const isTeacher = profile?.role === 'teacher';
  const isStudent = profile?.role === 'student';
  
  // Hiérarchie des rôles pour les permissions
  const roleHierarchy = { 
    student: 1, 
    teacher: 2, 
    admin: 3 
  };

  // Vérifier si l'utilisateur a la permission requise
  const hasPermission = (requiredRole) => {
    if (!profile || loading) return false;
    return roleHierarchy[profile.role] >= roleHierarchy[requiredRole];
  };

  // Vérifier si l'utilisateur a exactement le rôle
  const isExactly = (role) => {
    return profile?.role === role;
  };

  return { 
    isAdmin, 
    isTeacher, 
    isStudent, 
    hasPermission, 
    isExactly,
    role: profile?.role,
    loading 
  };
};