// components/CourseCard/CourseCard.js - VERSION PROFESSIONNELLE
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../../viewmodels/hooks/useAuthContext';
import { useCoursePurchase } from '../../../viewmodels/hooks/useCoursePurchase';
import './CourseCard.css';

export default function CourseCard({ course, isAdmin }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { hasPurchasedCourse } = useCoursePurchase();
  const { user: authUser } = useAuthContext();

  // Calculs communs
  const discountPercentage = course.hasPromotion && course.originalPrice
    ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)
    : 0;

  const isPurchased = authUser ? hasPurchasedCourse(course.id) : false;

  const handleImageLoad = () => setImageLoaded(true);
  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

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
          {course.description.length > 120 
            ? `${course.description.substring(0, 120)}...` 
            : course.description
          }
        </p>

        {/* Métadonnées professionnelles */}
        <div className="course-instructor">
          <span className="instructor-label">Formateur : </span>
          <span className="instructor-name">{course.instructor}</span>
        </div>

        <div className="course-meta">
          <span className="meta-item instructor">Formateur: {course.instructor}</span>
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
          <span className="rating-value">{course.rating}</span>
          <span className="students-count">({course.students} étudiants)</span>
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

        {/* Actions conditionnelles */}
        <div className="course-actions">
          {!authUser ? (
            <Link to="/login" className="btn btn-primary">
              S'inscrire pour voir
            </Link>
          ) : isAdmin ? (
            <>
              <Link to={`/course/${course.id}`} className="btn btn-primary">
                Voir Détails
              </Link>
              <button className="btn btn-secondary">
                Modifier
              </button>
            </>
          ) : isPurchased ? (
            <Link to={`/course/${course.id}`} className="btn btn-primary">
              Accéder au cours
            </Link>
          ) : (
            <Link to={`/course/${course.id}`} className="btn btn-primary">
              Voir Détails
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}