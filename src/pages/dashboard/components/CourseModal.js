// src/pages/dashboard/CourseModal.js
import React from 'react';

const CourseModal = ({ 
  newCourse, 
  defaultImages, 
  onInputChange, 
  onImageUrlChange, 
  onSelectDefaultImage, 
  onSubmitCourse, 
  onCloseModal 
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Créer un Nouveau Cours</h3>
          <button 
            className="btn-icon"
            onClick={onCloseModal}
          >
            ✕
          </button>
        </div>
        <form onSubmit={onSubmitCourse}>
          <div className="form-group">
            <label>Titre du cours *</label>
            <input
              type="text"
              name="title"
              value={newCourse.title}
              onChange={onInputChange}
              required
              placeholder="Ex: React Avancé - Les Hooks"
            />
          </div>
          
          <div className="form-group">
            <label>Catégorie *</label>
            <select
              name="category"
              value={newCourse.category}
              onChange={onInputChange}
              required
            >
              <option value="">Sélectionnez une catégorie</option>
              <option value="Développement">Développement</option>
              <option value="Design">Design</option>
              <option value="Business">Business</option>
              <option value="Marketing">Marketing</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Formateur *</label>
            <input
              type="text"
              name="instructor"
              value={newCourse.instructor}
              onChange={onInputChange}
              required
              placeholder="Ex: Ahmed Ben Ali"
            />
          </div>

          {/* SECTION IMAGE AVEC OPTIONS PAR DÉFAUT */}
          <div className="form-group">
            <label>Image du cours</label>
            
            {/* Champ URL */}
            <input
              type="url"
              name="image"
              value={newCourse.image}
              onChange={onImageUrlChange}
              placeholder="https://exemple.com/image.jpg"
              style={{marginBottom: '15px'}}
            />
            
            {/* Images prédéfinies rapides */}
            <div style={{marginBottom: '15px'}}>
              <small style={{color: '#666', display: 'block', marginBottom: '8px'}}>
                Ou choisir une image prédéfinie :
              </small>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '8px'
              }}>
                {defaultImages.map((img, index) => (
                  <div
                    key={index}
                    onClick={() => onSelectDefaultImage(img.url)}
                    style={{
                      border: newCourse.image === img.url ? '3px solid var(--primary-color)' : '2px solid #ddd',
                      borderRadius: '6px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      background: '#f8f9fa',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <div 
                      style={{
                        width: '100%',
                        height: '60px',
                        backgroundImage: `url(${img.url})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                      onError={(e) => {
                        console.log('❌ Image non trouvée:', img.url);
                        e.target.style.background = '#ffcccc';
                      }}
                    ></div>
                    <div style={{
                      padding: '4px',
                      textAlign: 'center',
                      fontSize: '0.7em',
                      background: newCourse.image === img.url ? 'var(--primary-color)' : 'transparent',
                      color: newCourse.image === img.url ? 'white' : '#666'
                    }}>
                      {img.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Aperçu de l'image */}
            {newCourse.image && (
              <div style={{
                marginTop: '10px',
                textAlign: 'center',
                padding: '10px',
                background: '#f8f9fa',
                borderRadius: '6px',
                border: '1px solid #e9ecef'
              }}>
                <strong>Aperçu :</strong>
                <div style={{
                  width: '120px',
                  height: '80px',
                  margin: '10px auto',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <img 
                    src={newCourse.image} 
                    alt="Aperçu" 
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                    onError={(e) => {
                      console.log('❌ Erreur de chargement de l\'image:', newCourse.image);
                      e.target.src = '/images/default-course.jpg';
                    }}
                  />
                </div>
              </div>
            )}
            
            <small style={{color: '#666', fontSize: '0.8em'}}>
              Entrez une URL d'image ou choisissez une option rapide
            </small>
          </div>

          {/* SECTION PRIX AVEC CALCUL AUTOMATIQUE */}
          <div className="form-group">
            <label>Prix Original (TND) *</label>
            <input
              type="number"
              name="originalPrice"
              value={newCourse.originalPrice}
              onChange={onInputChange}
              required
              placeholder="Ex: 129"
              min="1"
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label>Prix Promotionnel (TND)</label>
            <input
              type="number"
              name="price"
              value={newCourse.price}
              onChange={onInputChange}
              placeholder="Ex: 89 (laisser vide pour pas de promotion)"
              min="1"
              step="0.01"
            />
            <small style={{color: '#666', fontSize: '0.8em'}}>
              Laisser vide si pas de promotion
            </small>
          </div>

          <div className="form-group">
            <label>Pourcentage de Promotion</label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px',
              background: newCourse.hasPromotion ? '#f0f9ff' : '#f8f9fa',
              border: `1px solid ${newCourse.hasPromotion ? '#bae6fd' : '#e9ecef'}`,
              borderRadius: '6px'
            }}>
              <input
                type="number"
                name="discountPercentage"
                value={newCourse.discountPercentage}
                readOnly
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  fontWeight: 'bold',
                  color: newCourse.hasPromotion ? '#22c55e' : '#666'
                }}
              />
              <span style={{
                color: newCourse.hasPromotion ? '#22c55e' : '#666',
                fontWeight: 'bold'
              }}>%</span>
            </div>
            
            {newCourse.hasPromotion && (
              <div style={{
                marginTop: '10px',
                padding: '12px',
                background: '#ecfdf5',
                border: '1px solid #d1fae5',
                borderRadius: '6px'
              }}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <div>
                    <div style={{fontSize: '0.9em', color: '#666'}}>Prix original</div>
                    <del style={{color: '#999', fontSize: '1.1em'}}>{newCourse.originalPrice} TND</del>
                  </div>
                  <div style={{fontSize: '1.5em', color: '#dc2626'}}>→</div>
                  <div>
                    <div style={{fontSize: '0.9em', color: '#666'}}>Prix promotionnel</div>
                    <strong style={{color: '#e91e63', fontSize: '1.3em'}}>{newCourse.price} TND</strong>
                  </div>
                </div>
                <div style={{
                  marginTop: '8px',
                  textAlign: 'center',
                  background: '#22c55e',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '0.9em',
                  fontWeight: 'bold'
                }}>
                  Économie de {newCourse.discountPercentage}%
                </div>
              </div>
            )}
            
            {parseFloat(newCourse.price) > parseFloat(newCourse.originalPrice) && newCourse.originalPrice && (
              <div style={{
                marginTop: '10px',
                padding: '8px',
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '4px',
                color: '#dc2626',
                fontSize: '0.8em'
              }}>
                ⚠️ Le prix promotionnel ne peut pas être supérieur au prix original
              </div>
            )}
          </div>
          
          <div className="form-group">
            <label>Niveau</label>
            <select
              name="level"
              value={newCourse.level}
              onChange={onInputChange}
            >
              <option value="Débutant">Débutant</option>
              <option value="Intermédiaire">Intermédiaire</option>
              <option value="Avancé">Avancé</option>
              <option value="Tous niveaux">Tous niveaux</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Durée</label>
            <input
              type="text"
              name="duration"
              value={newCourse.duration}
              onChange={onInputChange}
              placeholder="Ex: 10h 30min"
            />
          </div>
          
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={newCourse.description}
              onChange={onInputChange}
              placeholder="Description du cours..."
              rows="4"
            />
          </div>
          
          <div className="form-group">
            <label>Statut</label>
            <select
              name="status"
              value={newCourse.status}
              onChange={onInputChange}
            >
              <option value="draft">Brouillon</option>
              <option value="published">Publié</option>
            </select>
          </div>
          
          <div className="modal-actions">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={onCloseModal}
            >
              Annuler
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
            >
              Créer le Cours
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseModal;