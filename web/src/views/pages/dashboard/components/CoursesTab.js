// src/pages/dashboard/components/CoursesTab.js - VERSION PROFESSIONNELLE
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CourseDescription from '../../../components/CourseDescription';
import CourseDetailModal from './CourseDetailModal';
import CourseEditModal from './CourseEditModal';

const CoursesTab = ({ courses, onNewCourse, onDeleteCourse }) => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showCourseDetail, setShowCourseDetail] = useState(false);
  const [showCourseEdit, setShowCourseEdit] = useState(false);

  const handleViewCourse = (course) => {
    setSelectedCourse(course);
    setShowCourseDetail(true);
  };

  const handleEditCourse = (course) => {
    setSelectedCourse(course);
    setShowCourseEdit(true);
  };

  const handleCloseDetail = () => {
    setSelectedCourse(null);
    setShowCourseDetail(false);
  };

  const handleCloseEdit = () => {
    setSelectedCourse(null);
    setShowCourseEdit(false);
  };

  const handleUpdateCourse = () => {
    setShowCourseEdit(false);
  };

  return (
    <div className="courses-tab">
      <div className="tab-header">
        <h2>Gestion des Cours ({courses.length} cours)</h2>
        <div className="header-actions">
          <button 
            className="btn btn-primary"
            onClick={onNewCourse}
          >
            Nouveau Cours
          </button>
          <Link 
            to="/admin/quiz/create" 
            className="btn btn-primary"
          >
            Créer un Quiz
          </Link>
        </div>
      </div>

      {/* Tableau des cours */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Titre</th>
              <th>Catégorie</th>
              <th>Formateur</th>
              <th>Prix</th>
              <th>Promotion</th>
              <th>Étudiants</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map(course => (
              <tr key={course.id}>
                <td>
                  <div className="course-cell">
                    <div 
                      className="course-thumb-placeholder"
                      style={{
                        backgroundImage: `url(${course.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    >
                      {!course.image || course.image === '/images/default-course.jpg' ? (
                        <span className="course-icon">📚</span>
                      ) : null}
                    </div>
                    <div className="course-info">
                      <strong className="course-title">{course.title}</strong>
                      <CourseDescription description={course.description} />
                    </div>
                  </div>
                </td>
                <td>{course.category}</td>
                <td>{course.instructor}</td>
                <td>
                  <div className="price-display">
                    {course.hasPromotion ? (
                      <>
                        <del className="original-price">{course.originalPrice} TND</del>
                        <strong className="current-price">{course.price} TND</strong>
                      </>
                    ) : (
                      <strong className="current-price">{course.price} TND</strong>
                    )}
                  </div>
                </td>
                <td>
                  {course.hasPromotion ? (
                    <span className="discount-badge">
                      -{course.discountPercentage}%
                    </span>
                  ) : (
                    <span className="no-discount">Aucune</span>
                  )}
                </td>
                <td>{course.students || 0}</td>
                <td>
                  <span className={`status-badge ${course.status}`}>
                    {course.status === 'published' ? 'Publié' : 'Brouillon'}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="btn-icon view-btn" 
                      title="Voir détails"
                      onClick={() => handleViewCourse(course)}
                    >
                      Voir
                    </button>
                    <button 
                      className="btn-icon edit-btn" 
                      title="Éditer"
                      onClick={() => handleEditCourse(course)}
                    >
                      Modifier
                    </button>
                    <button 
                      className="btn-icon delete-btn" 
                      title="Supprimer"
                      onClick={() => onDeleteCourse(course.id)}
                    >
                      Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal des détails du cours */}
      {showCourseDetail && selectedCourse && (
        <CourseDetailModal 
          course={selectedCourse} 
          onClose={handleCloseDetail} 
        />
      )}

      {/* Modal d'édition du cours */}
      {showCourseEdit && selectedCourse && (
        <CourseEditModal 
          course={selectedCourse}
          onClose={handleCloseEdit}
          onUpdate={handleUpdateCourse}
        />
      )}
    </div>
  );
};

export default CoursesTab;