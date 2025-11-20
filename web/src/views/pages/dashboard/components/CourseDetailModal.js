// src/pages/dashboard/CourseDetailModal.js
import React from 'react';

const CourseDetailModal = ({ course, onClose }) => {
  if (!course) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content course-detail-modal">
        <div className="modal-header">
          <h3>Détails du Cours</h3>
          <button 
            className="btn-icon"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        <div className="course-detail-content">
          <div className="course-detail-header">
            <div className="course-detail-image">
              <img 
                src={course.image} 
                alt={course.title}
                onError={(e) => {
                  e.target.src = '/images/default-course.jpg';
                }}
              />
            </div>
            <div className="course-detail-info">
              <h3>{course.title}</h3>
              <div className="course-detail-meta">
                <span className="meta-badge category">{course.category}</span>
                <span className="meta-badge level">{course.level}</span>
                <span className={`meta-badge status ${course.status}`}>
                  {course.status === 'published' ? 'Publié' : 'Brouillon'}
                </span>
              </div>
              <p><strong>Formateur:</strong> {course.instructor}</p>
              <p><strong>Durée:</strong> {course.duration}</p>
            </div>
          </div>

          <div className="course-detail-stats">
            <div className="stat-item">
              <span className="stat-value">{course.students || 0}</span>
              <span className="stat-label">Étudiants</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{course.rating || 4.5}/5</span>
              <span className="stat-label">Note</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">
                {course.hasPromotion ? (
                  <span style={{color: '#22c55e'}}>Promo active</span>
                ) : (
                  'Standard'
                )}
              </span>
              <span className="stat-label">Statut Prix</span>
            </div>
          </div>

          <div className="course-detail-sections">
            <div className="detail-section">
              <h4>📝 Description</h4>
              <p>{course.description || 'Aucune description disponible.'}</p>
            </div>

            <div className="detail-section">
              <h4>💰 Informations de Prix</h4>
              <div className="pricing-info">
                {course.hasPromotion ? (
                  <div className="pricing-display">
                    <del className="original-price">{course.originalPrice} TND</del>
                    <span className="current-price">{course.price} TND</span>
                    <span className="discount-badge-large">
                      -{course.discountPercentage}%
                    </span>
                  </div>
                ) : (
                  <div className="pricing-display">
                    <span className="current-price">{course.price} TND</span>
                  </div>
                )}
                <p><strong>Type:</strong> {course.hasPromotion ? 'Promotionnel' : 'Standard'}</p>
              </div>
            </div>

            <div className="detail-section">
              <h4>📊 Métriques</h4>
              <ul className="detail-list">
                <li><strong>ID:</strong> {course.id}</li>
                <li><strong>Statut:</strong> {course.status === 'published' ? 'Publié' : 'Brouillon'}</li>
                <li><strong>Niveau:</strong> {course.level}</li>
                <li><strong>Durée:</strong> {course.duration}</li>
                <li><strong>Catégorie:</strong> {course.category}</li>
              </ul>
            </div>

            <div className="detail-section">
              <h4>🎯 Actions Rapides</h4>
              <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                <button 
                  className="btn btn-primary"
                  onClick={() => {
                    window.open(`/course/${course.id}`, '_blank');
                  }}
                >
                  👁️ Voir la page publique
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => {
                    console.log('Éditer le cours:', course.id);
                    alert(`Fonction d'édition pour le cours: ${course.title}`);
                  }}
                >
                  ✏️ Modifier le cours
                </button>
                <button 
                  className="btn"
                  style={{background: '#f0f9ff', color: '#0369a1'}}
                  onClick={() => {
                    console.log('Voir les stats du cours:', course.id);
                  }}
                >
                  📈 Voir les statistiques
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailModal;