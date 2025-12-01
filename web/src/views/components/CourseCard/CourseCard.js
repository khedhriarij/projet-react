// components/CourseCard/CourseCard.js - VERSION CORRECTE
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../../viewmodels/hooks/useAuthContext';
import './CourseCard.css';

export default function CourseCard({ course, isAdmin, isPurchased }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { user: authUser } = useAuthContext();

  // Calcul du pourcentage de réduction
  const discountPercentage = course?.hasPromotion && course?.originalPrice
    ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)
    : 0;

  const handleImageLoad = () => setImageLoaded(true);
  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  if (!course) {
    return <div className="course-card error">Données du cours manquantes</div>;
  }

  return (
    <div className={`course-card ${course.featured ? 'featured' : ''}`}>
      {/* Badges */}
      {course.featured && <div className="featured-badge">Cours Populaire</div>}
      {course.hasPromotion && (
        <div className="promotion-badge">-{discountPercentage}%</div>
      )}

      {/* Image avec gestion de chargement */}
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
        <div className="course-level">{course.level}</div>
      </div>

      {/* Contenu */}
      <div className="course-content">
        <div className="course-category">{course.category}</div>
        <h3 className="course-title">{course.title}</h3>
        <p className="course-description">
          {course.description?.length > 120 
            ? `${course.description.substring(0, 120)}...` 
            : course.description
          }
        </p>

        {/* Métadonnées */}
        <div className="course-instructor">
          <span className="instructor-label">Formateur : </span>
          <span className="instructor-name">{course.instructor}</span>
        </div>

        <div className="course-meta">
          <span className="meta-item duration">Durée: {course.duration}</span>
          <span className="meta-item level">Niveau: {course.level}</span>
        </div>

        {/* Évaluations */}
        <div className="course-rating">
          <div className="stars">
            <span className="star-filled">★</span>
            <span className="star-filled">★</span>
            <span className="star-filled">★</span>
            <span className="star-filled">★</span>
            <span className="star-filled">★</span>
          </div>
          <span className="rating-value">{course.rating || 4.5}</span>
          <span className="students-count">({course.students || 0} étudiants)</span>
        </div>

        {/* Prix */}
        <div className="course-pricing">
          {course.hasPromotion ? (
            <>
              <span className="original-price">{course.originalPrice} TND</span>
              <span className="current-price">{course.price} TND</span>
            </>
          ) : (
            <span className="current-price">{course.price} TND</span>
          )}
        </div>

        {/* Actions conditionnelles - VERSION AMÉLIORÉE */}
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
              Accéder au cours
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