// components/CourseCard/CourseCard.js
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../../viewmodels/hooks/useAuthContext';
import './CourseCard.css';

export default function CourseCard({ course, isAdmin, isPurchased }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { user: authUser } = useAuthContext();

  if (!course) return <div className="course-card error">Données du cours manquantes</div>;

  // Calcul de la réduction si promotion
  const discountPercentage = course.hasPromotion && course.originalPrice
    ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)
    : 0;

  const handleImageLoad = () => setImageLoaded(true);
  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  // Fonction pour générer les étoiles dynamiques
  const renderStars = () => {
    const rating = Math.round(course.rating || 0);
    return [1, 2, 3, 4, 5].map((star) => (
      <span key={star} className={star <= rating ? 'star-filled' : 'star-empty'}>
        ★
      </span>
    ));
  };

  return (
    <div className={`course-card ${course.featured ? 'featured' : ''}`}>
      
      {/* Badges */}
      {course.featured && <div className="featured-badge">Cours Populaire</div>}
      {course.hasPromotion && <div className="promotion-badge">-{discountPercentage}%</div>}

      {/* Image */}
      <div className="course-image">
        {!imageLoaded && (
          <div className="image-placeholder">
            <div className="loading-spinner"></div>
          </div>
        )}
        <img
          src={imageError ? '/images/default-course.jpg' : course.image}
          alt={course.title}
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={{ opacity: imageLoaded ? 1 : 0 }}
        />
        {course.level && <div className="course-level">{course.level}</div>}
      </div>

      {/* Contenu */}
      <div className="course-content">
        {course.category && <div className="course-category">{course.category}</div>}
        <h3 className="course-title">{course.title}</h3>
        {course.description && (
          <p className="course-description">
            {course.description.length > 120
              ? `${course.description.substring(0, 120)}...`
              : course.description}
          </p>
        )}

        {/* Métadonnées */}
        {course.instructor && (
          <div className="course-instructor">
            <span className="instructor-label">Formateur : </span>
            <span className="instructor-name">{course.instructor}</span>
          </div>
        )}
        <div className="course-meta">
          {course.duration && <span className="meta-item duration">Durée: {course.duration}</span>}
          {course.level && <span className="meta-item level">Niveau: {course.level}</span>}
        </div>

        {/* Évaluation */}
        <div className="course-rating">
          <div className="stars">{renderStars()}</div>
          <span className="rating-value">{course.rating?.toFixed(1) || 0}</span>
          <span className="students-count">({course.students || 0} étudiants)</span>
        </div>

        {/* Prix */}
        <div className="course-pricing">
          {course.hasPromotion && course.originalPrice ? (
            <>
              <span className="original-price">{course.originalPrice} TND</span>
              <span className="current-price">{course.price} TND</span>
            </>
          ) : (
            <span className="current-price">{course.price} TND</span>
          )}
        </div>

        {/* Actions dynamiques */}
        <div className="course-actions">
          {!authUser ? (
            <Link to="/login" className="btn btn-primary">
              S'inscrire pour voir
            </Link>
          ) : isAdmin ? (
            <div className="admin-actions">
              <Link to={`/course/${course.id}`} className="btn btn-primary">
                Voir Détails
              </Link>
              <Link to={`/admin/edit-course/${course.id}`} className="btn btn-secondary">
                Modifier
              </Link>
            </div>
          ) : isPurchased ? (
            <Link to={`/course/${course.id}`} className="btn btn-success">
              ✅ Accéder au cours
            </Link>
          ) : (
            <Link to={`/course/${course.id}`} className="btn btn-primary purchase-button">
              Acheter - {course.price} TND
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
