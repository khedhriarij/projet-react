// components/CourseCard/CourseCard.js
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCoursePurchase } from '../../hooks/useCoursePurchase';
import { useAuthContext } from '../../hooks/useAuthContext';
import './CourseCard.css';

export default function CourseCard({ course, isAdmin, user }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { hasPurchasedCourse } = useCoursePurchase();
  const { user: authUser } = useAuthContext();

  const {
    id,
    title,
    description,
    price,
    originalPrice,
    category,
    image,
    instructor,
    rating,
    students,
    duration,
    level,
    featured
  } = course;

  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
  const isPurchased = hasPurchasedCourse(id);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  return (
    <div className={`course-card ${featured ? 'featured' : ''}`}>
      {featured && <div className="featured-badge">⭐ Cours Populaire</div>}
      
      <div className="course-image">
        {!imageLoaded && (
          <div className="image-placeholder">
            <div className="loading-spinner"></div>
          </div>
        )}
        <img
          src={imageError ? '/images/course-placeholder.jpg' : image}
          alt={title}
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={{ opacity: imageLoaded ? 1 : 0 }}
        />
        
        {discount > 0 && (
          <div className="discount-badge">-{discount}%</div>
        )}
        
        <div className="course-level">{level}</div>
      </div>

      <div className="course-content">
        <div className="course-category">{category}</div>
        
        <h3 className="course-title">{title}</h3>
        
        <p className="course-description">
          {description.length > 120 
            ? `${description.substring(0, 120)}...` 
            : description
          }
        </p>

        <div className="course-instructor">
          <span className="instructor-label">Formateur :</span>
          <span className="instructor-name">{instructor}</span>
        </div>

        <div className="course-meta">
          <div className="rating">
            <span className="stars">★★★★★</span>
            <span className="rating-value">{rating}</span>
            <span className="rating-count">({students})</span>
          </div>
          <div className="duration">{duration}</div>
        </div>

        <div className="course-footer">
          <div className="price-section">
            {originalPrice && (
              <span className="original-price">{originalPrice} TND</span>
            )}
            <span className="current-price">{price} TND</span>
          </div>

          <div className="action-buttons">
            {authUser ? (
              isAdmin ? (
                <Link to={`/edit-course/${id}`} className="btn btn-outline">
                  ✏️ Modifier
                </Link>
              ) : isPurchased ? (
                <Link to={`/course/${id}`} className="btn btn-primary">
                  📚 Accéder au cours
                </Link>
              ) : (
                <Link to={`/course/${id}`} className="btn btn-primary">
                  Voir détail
                </Link>
              )
            ) : (
              <Link to="/login" className="btn btn-primary">
                S'inscrire pour voir
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}