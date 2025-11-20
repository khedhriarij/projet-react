// pages/dashboard/UsersTab.js
import React from 'react';

const UsersTab = () => {
  const users = [
    {
      id: 1,
      displayName: "Ahmed Ben Salah",
      email: "ahmed@example.com",
      role: "student",
      online: true,
      active: true,
      createdAt: "2024-01-15",
      lastLogin: "2024-01-20"
    },
    {
      id: 2, 
      displayName: "Sarah Trabelsi",
      email: "sarah@example.com",
      role: "instructor",
      online: false,
      active: true,
      createdAt: "2024-01-10",
      lastLogin: "2024-01-18"
    },
    {
      id: 3,
      displayName: "Mohamed Dridi",
      email: "mohamed@example.com", 
      role: "instructor",
      online: true,
      active: true,
      createdAt: "2024-01-05",
      lastLogin: "2024-01-20"
    }
  ];

  return (
    <div className="users-tab">
      <div className="tab-header">
        <h2>Gestion des Utilisateurs</h2>
      </div>

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
            {users.map(user => (
              <tr key={user.id}>
                <td>
                  <div className="user-cell">
                    <div className="user-avatar">
                      <div className="avatar-placeholder">
                        {user.displayName.charAt(0)}
                      </div>
                    </div>
                    <div>
                      <strong>{user.displayName}</strong>
                      <p className="user-meta">
                        Dernière connexion: {user.lastLogin}
                      </p>
                    </div>
                  </div>
                </td>
                <td>{user.email}</td>
                <td>
                  <span className={`badge badge-${user.role}`}>
                    {user.role === 'instructor' ? 'Formateur' : 'Étudiant'}
                  </span>
                </td>
                <td>{user.createdAt}</td>
                <td>
                  <div className="status-cell">
                    <span className={`badge ${user.online ? 'badge-success' : 'badge-warning'}`}>
                      {user.online ? 'En ligne' : 'Hors ligne'}
                    </span>
                    <span className={`badge ${user.active ? 'badge-success' : 'badge-danger'}`}>
                      {user.active ? 'Actif' : 'Inactif'}
                    </span>
                  </div>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-icon" title="Voir profil">👁️</button>
                    <button className="btn-icon btn-warning" title="Modifier">⚙️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersTab;