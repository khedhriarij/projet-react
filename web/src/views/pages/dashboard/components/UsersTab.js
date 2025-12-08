// pages/dashboard/UsersTab.js
import React, { useState, useEffect } from 'react';
import { useAdminDashboard } from '../hooks/useAdminDashboard';
import { handleApiError } from '../../../../models/services/api';

const UsersTab = ({ users: propUsers = [], isLoading: propLoading = false }) => {
  // Utiliser soit les props passées, soit le hook AdminDashboard
  const adminDashboard = useAdminDashboard();
  const { users: contextUsers, isLoading: contextLoading, handleUpdateUserRole, handleDeleteUser } = adminDashboard;
  
  // Utiliser les données de l'endroit le plus approprié
  const users = propUsers.length > 0 ? propUsers : contextUsers;
  const isLoading = propLoading || contextLoading?.users;
  
  // États locaux
  const [editingUserId, setEditingUserId] = useState(null);
  const [newRole, setNewRole] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [localUsers, setLocalUsers] = useState([]);

  // Initialiser les utilisateurs locaux
  useEffect(() => {
    if (users && Array.isArray(users)) {
      setLocalUsers(users);
    }
  }, [users]);

  // Filtrer les utilisateurs
  const filteredUsers = React.useMemo(() => {
    return localUsers.filter(user => {
      const matchesSearch = user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || 
                           (statusFilter === 'online' && user.online) ||
                           (statusFilter === 'offline' && !user.online);
      
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [localUsers, searchTerm, roleFilter, statusFilter]);

  // Gérer le changement de rôle
  const handleRoleChange = async (userId, currentRole) => {
    setEditingUserId(userId);
    setNewRole(currentRole);
  };

  const saveRoleChange = async (userId) => {
    try {
      const success = await handleUpdateUserRole(userId, newRole);
      if (success) {
        setLocalUsers(prev => prev.map(user => 
          user.id === userId ? { ...user, role: newRole } : user
        ));
        setEditingUserId(null);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du rôle:', error);
      alert('Erreur lors de la mise à jour du rôle');
    }
  };

  // Gérer la suppression
  const confirmDeleteUser = async (userId, userName) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur "${userName}" ?`)) {
      try {
        const success = await handleDeleteUser(userId);
        if (success) {
          setLocalUsers(prev => prev.filter(user => user.id !== userId));
        }
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  // Formater la date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (isLoading && localUsers.length === 0) {
    return (
      <div className="users-tab">
        <div className="tab-header">
          <h2>Gestion des Utilisateurs</h2>
          <div className="loading-indicator">
            Chargement des utilisateurs...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="users-tab">
      <div className="tab-header">
        <h2>Gestion des Utilisateurs</h2>
        <p className="tab-subtitle">
          {filteredUsers.length} utilisateur{filteredUsers.length !== 1 ? 's' : ''} trouvé{filteredUsers.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Filtres et recherche */}
      <div className="users-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Rechercher un utilisateur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="filter-controls">
          <select 
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">Tous les rôles</option>
            <option value="student">Étudiants</option>
            <option value="instructor">Formateurs</option>
            <option value="admin">Administrateurs</option>
          </select>

          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">Tous les statuts</option>
            <option value="online">En ligne</option>
            <option value="offline">Hors ligne</option>
          </select>
        </div>
      </div>

      {/* Tableau des utilisateurs */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Utilisateur</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Inscription</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <tr key={user.id || user.uid}>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar">
                        <div className="avatar-placeholder">
                          {user.displayName?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        {user.online && (
                          <span className="online-indicator" title="En ligne"></span>
                        )}
                      </div>
                      <div>
                        <strong>{user.displayName || 'Utilisateur sans nom'}</strong>
                        <p className="user-meta">
                          Dernière connexion: {user.lastLogin ? formatDate(user.lastLogin) : 'Jamais'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    {editingUserId === user.id ? (
                      <div className="role-edit">
                        <select 
                          value={newRole}
                          onChange={(e) => setNewRole(e.target.value)}
                          className="role-select"
                        >
                          <option value="student">Étudiant</option>
                          <option value="instructor">Formateur</option>
                          <option value="admin">Administrateur</option>
                        </select>
                        <button 
                          onClick={() => saveRoleChange(user.id)}
                          className="btn-save-role"
                        >
                          ✓
                        </button>
                        <button 
                          onClick={() => setEditingUserId(null)}
                          className="btn-cancel-role"
                        >
                          ✗
                        </button>
                      </div>
                    ) : (
                      <span 
                        className={`badge badge-${user.role}`}
                        onClick={() => handleRoleChange(user.id, user.role)}
                        style={{ cursor: 'pointer' }}
                        title="Cliquez pour modifier"
                      >
                        {user.role === 'admin' ? 'Administrateur' : 
                         user.role === 'instructor' ? 'Formateur' : 'Étudiant'}
                      </span>
                    )}
                  </td>
                  <td>{formatDate(user.createdAt)}</td>
                  <td>
                    <div className="status-cell">
                      <span className={`badge ${user.online ? 'badge-success' : 'badge-warning'}`}>
                        {user.online ? 'En ligne' : 'Hors ligne'}
                      </span>
                      <span className={`badge ${user.active !== false ? 'badge-success' : 'badge-danger'}`}>
                        {user.active !== false ? 'Actif' : 'Inactif'}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-icon" 
                        title="Voir profil"
                        onClick={() => console.log('Voir profil', user.id)}
                      >
                        👁️
                      </button>
                      <button 
                        className="btn-icon btn-warning" 
                        title="Modifier"
                        onClick={() => handleRoleChange(user.id, user.role)}
                      >
                        ⚙️
                      </button>
                      <button 
                        className="btn-icon btn-danger" 
                        title="Supprimer"
                        onClick={() => confirmDeleteUser(user.id, user.displayName || user.email)}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-data">
                  {searchTerm || roleFilter !== 'all' || statusFilter !== 'all' 
                    ? 'Aucun utilisateur ne correspond aux critères de recherche'
                    : 'Aucun utilisateur trouvé'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Statistiques */}
      <div className="users-stats">
        <div className="stat-card">
          <h4>Total Utilisateurs</h4>
          <p>{localUsers.length}</p>
        </div>
        <div className="stat-card">
          <h4>Étudiants</h4>
          <p>{localUsers.filter(u => u.role === 'student').length}</p>
        </div>
        <div className="stat-card">
          <h4>Formateurs</h4>
          <p>{localUsers.filter(u => u.role === 'instructor').length}</p>
        </div>
        <div className="stat-card">
          <h4>En ligne</h4>
          <p>{localUsers.filter(u => u.online).length}</p>
        </div>
      </div>

      <style jsx>{`
        .users-tab {
          padding: 20px;
        }
        
        .tab-header {
          margin-bottom: 24px;
        }
        
        .tab-subtitle {
          color: #666;
          margin-top: 4px;
        }
        
        .users-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          gap: 16px;
          flex-wrap: wrap;
        }
        
        .search-box {
          position: relative;
          flex: 1;
          max-width: 400px;
        }
        
        .search-input {
          width: 100%;
          padding: 10px 16px 10px 40px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 14px;
        }
        
        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #666;
        }
        
        .filter-controls {
          display: flex;
          gap: 12px;
        }
        
        .filter-select {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          background: white;
        }
        
        .user-cell {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .user-avatar {
          position: relative;
        }
        
        .avatar-placeholder {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #4a6cf7;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 16px;
        }
        
        .online-indicator {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 10px;
          height: 10px;
          background: #28a745;
          border-radius: 50%;
          border: 2px solid white;
        }
        
        .user-meta {
          margin: 4px 0 0;
          font-size: 12px;
          color: #666;
        }
        
        .badge {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
          margin: 2px;
        }
        
        .badge-success {
          background: #d4edda;
          color: #155724;
        }
        
        .badge-warning {
          background: #fff3cd;
          color: #856404;
        }
        
        .badge-danger {
          background: #f8d7da;
          color: #721c24;
        }
        
        .badge-admin {
          background: #6f42c1;
          color: white;
        }
        
        .badge-instructor {
          background: #17a2b8;
          color: white;
        }
        
        .badge-student {
          background: #28a745;
          color: white;
        }
        
        .status-cell {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        
        .action-buttons {
          display: flex;
          gap: 8px;
        }
        
        .btn-icon {
          background: #f8f9fa;
          border: 1px solid #dee2e6;
          border-radius: 4px;
          padding: 6px 10px;
          cursor: pointer;
          font-size: 16px;
          transition: all 0.2s;
        }
        
        .btn-icon:hover {
          background: #e9ecef;
          transform: translateY(-1px);
        }
        
        .btn-warning {
          background: #ffc107;
          color: #212529;
          border-color: #ffc107;
        }
        
        .btn-danger {
          background: #dc3545;
          color: white;
          border-color: #dc3545;
        }
        
        .role-edit {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        
        .role-select {
          padding: 4px 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 12px;
        }
        
        .btn-save-role, .btn-cancel-role {
          padding: 4px 8px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        }
        
        .btn-save-role {
          background: #28a745;
          color: white;
        }
        
        .btn-cancel-role {
          background: #dc3545;
          color: white;
        }
        
        .users-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 16px;
          margin-top: 30px;
        }
        
        .stat-card {
          background: white;
          padding: 16px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          text-align: center;
        }
        
        .stat-card h4 {
          margin: 0 0 8px;
          font-size: 14px;
          color: #666;
        }
        
        .stat-card p {
          margin: 0;
          font-size: 24px;
          font-weight: bold;
          color: #333;
        }
        
        .no-data {
          text-align: center;
          padding: 40px !important;
          color: #666;
          font-style: italic;
        }
        
        .loading-indicator {
          padding: 40px;
          text-align: center;
          color: #666;
        }
        
        @media (max-width: 768px) {
          .users-controls {
            flex-direction: column;
            align-items: stretch;
          }
          
          .search-box {
            max-width: 100%;
          }
          
          .filter-controls {
            width: 100%;
          }
          
          .table-container {
            overflow-x: auto;
          }
          
          .users-stats {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default UsersTab;