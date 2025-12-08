// src/views/pages/Signup/Signup.js - VERSION PROFESSIONNELLE
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSignup } from '../../../viewmodels/hooks/useSignup';
import './signup.css';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailError, setThumbnailError] = useState(null);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  
  const { signup, isPending, error } = useSignup();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setThumbnailError(null);

    if (!agreeToTerms) {
      setThumbnailError('Veuillez accepter les conditions d\'utilisation');
      return;
    }

    const success = await signup(email, password, displayName, thumbnail);
    if (success) {
      navigate('/catalog'); // Redirection vers la page d'accueil
    }
  };

  const handleFileChange = (e) => {
    setThumbnail(null);
    setThumbnailError(null);
    
    const selected = e.target.files[0];
    if (!selected) {
      setThumbnailError('Veuillez sélectionner un fichier');
      return;
    }
    
    if (!selected.type.includes('image')) {
      setThumbnailError('Le fichier doit être une image');
      return;
    }
    
    if (selected.size > 500000) { // 500KB
      setThumbnailError('La taille de l\'image doit être inférieure à 500KB');
      return;
    }
    
    setThumbnailError(null);
    setThumbnail(selected);
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        {/* Header avec logo */}
        <div className="signup-header">
          <div className="logo">
            <span className="logo-icon">🎓</span>
            <span className="logo-text">EduPlatform</span>
          </div>
          <h1>Créer votre compte</h1>
          <p>Rejoignez notre communauté d'apprentissage</p>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="signup-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="displayName">Nom complet *</label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Votre nom complet"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Adresse email *</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe *</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 caractères"
              minLength="6"
              required
            />
            <small>Le mot de passe doit contenir au moins 6 caractères</small>
          </div>

          {/* Upload photo de profil */}
          <div className="form-group">
            <label>Photo de profil</label>
            <div className="file-upload-area">
              <input
                type="file"
                id="thumbnail"
                onChange={handleFileChange}
                accept="image/*"
                className="file-input"
              />
              <label htmlFor="thumbnail" className="file-label">
                <span className="upload-icon">📷</span>
                <span className="upload-text">
                  {thumbnail ? thumbnail.name : 'Choisir une photo'}
                </span>
                <span className="upload-hint">PNG, JPG - Max 500KB</span>
              </label>
            </div>
            {thumbnailError && <div className="file-error">{thumbnailError}</div>}
          </div>

          {/* Conditions d'utilisation */}
          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
              />
              <span className="checkmark"></span>
              J'accepte les <a href="/terms" target="_blank">conditions d'utilisation</a> et la <a href="/privacy" target="_blank">politique de confidentialité</a>
            </label>
          </div>

          {/* Bouton de soumission */}
          <button 
            type="submit" 
            disabled={isPending}
            className={`submit-btn ${isPending ? 'loading' : ''}`}
          >
            {isPending ? (
              <>
                <div className="spinner"></div>
                Création du compte...
              </>
            ) : (
              'Créer mon compte'
            )}
          </button>

          {/* Lien de connexion */}
          <div className="login-link">
            <p>Déjà un compte ? <Link to="/login">Se connecter</Link></p>
          </div>
        </form>

        {/* Footer */}
        <div className="signup-footer">
          <p>© 2024 EduPlatform. Tous droits réservés.</p>
        </div>
      </div>
    </div>
  );
}