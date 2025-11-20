// pages/my-courses/MyCourses.js
import { useState, useEffect } from 'react';
import { useAuthContext } from '../../../viewmodels/hooks/useAuthContext';
import { useCoursePurchase } from '../../../viewmodels/hooks/useCoursePurchase';
import { useNavigate } from 'react-router-dom';
import './mycourses.css';

export default function MyCourses() {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const { getPurchasedCourses } = useCoursePurchase();
  const [purchasedCourses, setPurchasedCourses] = useState([]);

  useEffect(() => {
    if (user) {
      const courses = getPurchasedCourses();
      setPurchasedCourses(courses);
    }
  }, [user, getPurchasedCourses]);

  return (
    <div className="my-courses">
      <div className="my-courses-header">
        <h1>Mes Cours Achetés</h1>
        <p>Continuez votre apprentissage où vous vous étiez arrêté</p>
      </div>
      
      {purchasedCourses.length === 0 ? (
        <div className="no-courses">
          <div className="no-courses-icon">📚</div>
          <h3>Vous n'avez pas encore acheté de cours</h3>
          <p>Découvrez notre catalogue pour commencer votre apprentissage</p>
          <button onClick={() => navigate('/catalog')}>
            Explorer le catalogue
          </button>
        </div>
      ) : (
        <div className="courses-grid">
          {purchasedCourses.map(course => (
            <div key={course.courseId} className="purchased-course-card">
              <div className="course-image">
                <img src={course.image} alt={course.title} />
                <div className="progress-overlay">
                  <span>{course.progress}%</span>
                </div>
              </div>
              <div className="course-content">
                <h3>{course.title}</h3>
                <div className="course-instructor">
                  Formateur: {course.instructor}
                </div>
                <div className="progress-section">
                  <div className="progress-bar">
                    <div 
                      className="progress" 
                      style={{width: `${course.progress}%`}}
                    ></div>
                  </div>
                  <span className="progress-text">{course.progress}% complété</span>
                </div>
                <div className="purchase-date">
                  Acheté le: {new Date(course.purchasedAt).toLocaleDateString('fr-FR')}
                </div>
                <button 
                  onClick={() => navigate(`/course/${course.courseId}`)}
                  className={`continue-btn ${course.progress === 100 ? 'completed' : ''}`}
                >
                  {course.progress === 100 ? '✅ Cours terminé' : 
                   course.progress > 0 ? 'Continuer' : 'Commencer'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}