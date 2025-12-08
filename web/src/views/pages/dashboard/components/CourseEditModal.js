// src/pages/dashboard/components/CourseEditModal.js
import React, { useState, useEffect } from 'react';
import { useCourseContext } from '../../../../viewmodels/context/CourContext';
import './CourseEditModal.css';

const CourseEditModal = ({ course, onClose, onUpdate }) => {
  const { updateCourse } = useCourseContext();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    instructor: '',
    price: '',
    originalPrice: '',
    discountPercentage: 0,
    level: 'Intermédiaire',
    duration: '',
    image: '',
    status: 'published',
    objectives: [],
    includes: [],
    languages: ['Français']
  });
  const [newObjective, setNewObjective] = useState('');
  const [newInclude, setNewInclude] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');

  // Images par défaut
  const defaultImages = [
    { url: '/images/react.jpg', label: 'React' },
    { url: '/images/figma.webp', label: 'Figma' },
    { url: '/images/marketing-digital.jpg', label: 'Marketing' },
    { url: '/images/python.jpeg', label: 'Python' },
    { url: '/images/adobe.jpg', label: 'Adobe' },
    { url: '/images/agile.jpeg', label: 'Agile' },
    { url: '/images/ai.jpeg', label: 'IA' },
    { url: '/images/cour.png', label: 'Général' },
    { url: '/images/default-course.jpg', label: 'Défaut' }
  ];

  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title || '',
        description: course.description || '',
        category: course.category || '',
        instructor: course.instructor || '',
        price: course.price || '',
        originalPrice: course.originalPrice || '',
        discountPercentage: course.discountPercentage || 0,
        level: course.level || 'Intermédiaire',
        duration: course.duration || '',
        image: course.image || '/images/default-course.jpg',
        status: course.status || 'published',
        objectives: course.objectives || [],
        includes: course.includes || [],
        languages: course.languages || ['Français']
      });
    }
  }, [course]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value === '' ? '' : parseFloat(value)
    }));
  };

  const handleImageSelect = (imageUrl) => {
    setFormData(prev => ({
      ...prev,
      image: imageUrl
    }));
  };

  const addObjective = () => {
    if (newObjective.trim()) {
      setFormData(prev => ({
        ...prev,
        objectives: [...prev.objectives, newObjective.trim()]
      }));
      setNewObjective('');
    }
  };

  const removeObjective = (index) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.filter((_, i) => i !== index)
    }));
  };

  const addInclude = () => {
    if (newInclude.trim()) {
      setFormData(prev => ({
        ...prev,
        includes: [...prev.includes, newInclude.trim()]
      }));
      setNewInclude('');
    }
  };

  const removeInclude = (index) => {
    setFormData(prev => ({
      ...prev,
      includes: prev.includes.filter((_, i) => i !== index)
    }));
  };

  const generateModificationPrompt = () => {
    const changes = [];
    
    if (course.title !== formData.title) {
      changes.push(`- Titre modifié: "${course.title}" → "${formData.title}"`);
    }
    if (course.description !== formData.description) {
      changes.push(`- Description mise à jour`);
    }
    if (course.category !== formData.category) {
      changes.push(`- Catégorie changée: "${course.category}" → "${formData.category}"`);
    }
    if (course.instructor !== formData.instructor) {
      changes.push(`- Formateur modifié: "${course.instructor}" → "${formData.instructor}"`);
    }
    if (course.price !== formData.price) {
      changes.push(`- Prix ajusté: ${course.price} TND → ${formData.price} TND`);
    }
    if (course.level !== formData.level) {
      changes.push(`- Niveau modifié: "${course.level}" → "${formData.level}"`);
    }
    if (course.status !== formData.status) {
      changes.push(`- Statut changé: "${course.status}" → "${formData.status}"`);
    }

    const prompt = `Modifications apportées au cours "${course.title}" (ID: ${course.id}) :

${changes.length > 0 ? changes.join('\n') : 'Aucune modification significative détectée'}

Détails complets du cours après modification :
• Titre: ${formData.title}
• Catégorie: ${formData.category}
• Formateur: ${formData.instructor}
• Niveau: ${formData.level}
• Durée: ${formData.duration}
• Prix: ${formData.price} TND ${formData.originalPrice ? `(Promo: ${formData.originalPrice} TND)` : ''}
• Statut: ${formData.status === 'published' ? 'Publié' : 'Brouillon'}
• Objectifs d'apprentissage: ${formData.objectives.length}
• Éléments inclus: ${formData.includes.length}

Modifié par l'administrateur le ${new Date().toLocaleDateString('fr-FR')}`;

    setGeneratedPrompt(prompt);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await updateCourse(course.id, formData);
      generateModificationPrompt();
      if (onUpdate) onUpdate();
      alert('Cours modifié avec succès !');
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      alert('Erreur lors de la modification du cours');
    }
  };

  if (!course) return null;

  return (
    <div className="modal-overlay active">
      <div className="modal-content course-edit-modal">
        <div className="modal-header">
          <h2>Modifier le Cours</h2>
          <button className="btn-icon close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="course-edit-form">
          <div className="form-sections">
            {/* Section Informations de base */}
            <div className="form-section">
              <h3>Informations de base</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Titre du cours *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Catégorie *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Sélectionnez une catégorie</option>
                    <option value="Développement">Développement</option>
                    <option value="Design">Design</option>
                    <option value="Business">Business</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Formateur *</label>
                  <input
                    type="text"
                    name="instructor"
                    value={formData.instructor}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Niveau</label>
                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleInputChange}
                  >
                    <option value="Débutant">Débutant</option>
                    <option value="Intermédiaire">Intermédiaire</option>
                    <option value="Avancé">Avancé</option>
                    <option value="Tous niveaux">Tous niveaux</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Décrivez le contenu du cours..."
                />
              </div>
            </div>

            {/* Section Image */}
            <div className="form-section">
              <h3>Image du cours</h3>
              
              <div className="form-group">
                <label>URL de l'image</label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="https://exemple.com/image.jpg"
                />
              </div>

              <div className="default-images">
                <label>Images prédéfinies</label>
                <div className="image-grid">
                  {defaultImages.map((img, index) => (
                    <div
                      key={index}
                      className={`image-option ${formData.image === img.url ? 'selected' : ''}`}
                      onClick={() => handleImageSelect(img.url)}
                    >
                      <div 
                        className="image-preview"
                        style={{ backgroundImage: `url(${img.url})` }}
                      ></div>
                      <span>{img.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {formData.image && (
                <div className="image-preview-large">
                  <strong>Aperçu :</strong>
                  <div className="preview-container">
                    <img 
                      src={formData.image} 
                      alt="Aperçu" 
                      onError={(e) => {
                        e.target.src = '/images/default-course.jpg';
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Section Prix et Promotion */}
            <div className="form-section">
              <h3>Prix et Promotion</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Prix (TND) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleNumberChange}
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
                
                <div className="form-group">
                  <label>Prix original (TND)</label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleNumberChange}
                    min="0"
                    step="0.01"
                    placeholder="Pour les promotions"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Pourcentage de promotion</label>
                <input
                  type="number"
                  name="discountPercentage"
                  value={formData.discountPercentage}
                  onChange={handleNumberChange}
                  min="0"
                  max="100"
                  step="1"
                />
                <small>Calculé automatiquement si prix original saisi</small>
              </div>
            </div>

            {/* Section Métadonnées */}
            <div className="form-section">
              <h3>Métadonnées</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Durée</label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="Ex: 10h 30min"
                  />
                </div>
                
                <div className="form-group">
                  <label>Statut</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="draft">Brouillon</option>
                    <option value="published">Publié</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section Objectifs d'apprentissage */}
            <div className="form-section">
              <h3>Objectifs d'apprentissage</h3>
              
              <div className="form-group">
                <div className="array-input">
                  <input
                    type="text"
                    value={newObjective}
                    onChange={(e) => setNewObjective(e.target.value)}
                    placeholder="Nouvel objectif d'apprentissage"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addObjective())}
                  />
                  <button type="button" onClick={addObjective} className="btn-add">
                    Ajouter
                  </button>
                </div>
              </div>

              <div className="array-list">
                {formData.objectives.map((objective, index) => (
                  <div key={index} className="array-item">
                    <span>{objective}</span>
                    <button
                      type="button"
                      onClick={() => removeObjective(index)}
                      className="btn-remove"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Section Éléments inclus */}
            <div className="form-section">
              <h3>Éléments inclus</h3>
              
              <div className="form-group">
                <div className="array-input">
                  <input
                    type="text"
                    value={newInclude}
                    onChange={(e) => setNewInclude(e.target.value)}
                    placeholder="Nouvel élément inclus"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInclude())}
                  />
                  <button type="button" onClick={addInclude} className="btn-add">
                    Ajouter
                  </button>
                </div>
              </div>

              <div className="array-list">
                {formData.includes.map((include, index) => (
                  <div key={index} className="array-item">
                    <span>{include}</span>
                    <button
                      type="button"
                      onClick={() => removeInclude(index)}
                      className="btn-remove"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Annuler
            </button>
            <button type="submit" className="btn btn-primary">
              Enregistrer les modifications
            </button>
          </div>
        </form>

        {/* Prompt généré */}
        {generatedPrompt && (
          <div className="prompt-section">
            <h3>Rapport de modifications</h3>
            <div className="prompt-container">
              <pre>{generatedPrompt}</pre>
              <button 
                onClick={() => navigator.clipboard.writeText(generatedPrompt)}
                className="btn btn-secondary btn-sm"
              >
                Copier le rapport
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseEditModal;