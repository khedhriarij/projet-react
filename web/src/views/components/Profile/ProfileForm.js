// src/components/Profile/ProfileForm.js
import React, { useState, useEffect } from 'react';
import { useUserProfile } from '../../../viewmodels/hooks/useUserProfile';
import './ProfileForm.css';

const ProfileForm = () => {
  const { profile, loading, error, updateProfile } = useUserProfile();
  const [formData, setFormData] = useState({
    displayName: '',
    phoneNumber: '',
    bio: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (profile) {
      setFormData({
        displayName: profile.displayName || '',
        phoneNumber: profile.phoneNumber || '',
        bio: profile.bio || ''
      });
    }
  }, [profile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    
    const success = await updateProfile(formData);
    if (success) {
      setMessage('Profil mis a jour avec succes');
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage('Erreur lors de la mise a jour');
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (loading && !profile) {
    return <div className="loading">Chargement du profil...</div>;
  }

  return (
    <div className="profile-form">
      <h2>Modifier le Profil</h2>
      
      {message && <div className={`message ${message.includes('Erreur') ? 'error' : 'success'}`}>{message}</div>}
      {error && <div className="error">Erreur: {error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nom complet *</label>
          <input
            type="text"
            name="displayName"
            value={formData.displayName}
            onChange={handleChange}
            required
            placeholder="Votre nom complet"
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={profile?.email || ''}
            disabled
            className="disabled-input"
          />
          <small>L email ne peut pas etre modifie</small>
        </div>

        <div className="form-group">
          <label>Numero de telephone</label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="+216 XX XXX XXX"
          />
        </div>

        <div className="form-group">
          <label>Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Parlez-nous de vous..."
            rows="4"
          />
        </div>

        <button type="submit" disabled={loading} className="btn btn-primary">
          {loading ? 'Mise a jour...' : 'Mettre a jour le profil'}
        </button>
      </form>
    </div>
  );
};

export default ProfileForm;