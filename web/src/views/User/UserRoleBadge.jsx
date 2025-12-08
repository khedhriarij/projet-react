// src/views/components/User/UserRoleBadge.jsx - VERSION AMÉLIORÉE
import './UserRoleBadge.css';

const UserRoleBadge = ({ role, size = 'medium', showIcon = true, showLabel = true }) => {
  const getRoleConfig = (role) => {
    const configs = {
      admin: { 
        label: 'Administrateur', 
        color: '#ef4444', 
        bgColor: '#fef2f2',
        icon: '👑' 
      },
      teacher: { 
        label: 'Enseignant', 
        color: '#3b82f6', 
        bgColor: '#eff6ff',
        icon: '📚' 
      },
      student: { 
        label: 'Étudiant', 
        color: '#10b981', 
        bgColor: '#f0fdf4',
        icon: '🎓' 
      }
    };
    return configs[role] || configs.student;
  };

  const config = getRoleConfig(role);

  return (
    <span 
      className={`role-badge role-badge-${size}`}
      style={{ 
        backgroundColor: config.bgColor,
        color: config.color,
        border: `1px solid ${config.color}20`
      }}
    >
      {showIcon && <span className="role-icon">{config.icon}</span>}
      {showLabel && <span className="role-label">{config.label}</span>}
    </span>
  );
};

export default UserRoleBadge;