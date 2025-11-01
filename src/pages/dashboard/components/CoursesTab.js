// src/pages/dashboard/components/CoursesTab.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CourseDescription from '../../../components/CourseDescription';
import CourseDetailModal from './CourseDetailModal';

const CoursesTab = ({ courses, onNewCourse, onDeleteCourse }) => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showCourseDetail, setShowCourseDetail] = useState(false);

  const handleViewCourse = (course) => {
    setSelectedCourse(course);
    setShowCourseDetail(true);
  };

  const handleCloseDetail = () => {
    setSelectedCourse(null);
    setShowCourseDetail(false);
  };

  return (
    <div className="courses-tab">
      <div className="tab-header">
        <h2>Gestion des Cours ({courses.length} cours)</h2>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button 
            className="btn btn-primary"
            onClick={onNewCourse}
          >
            + Nouveau Cours
          </button>
          <Link 
            to="/admin/quiz/create" 
            className="btn btn-primary"
            style={{ 
              textDecoration: 'none', 
              display: 'flex', 
              alignItems: 'center',
              padding: '10px 20px'
            }}
          >
            🎯 Créer un Quiz
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
                        <span>📚</span>
                      ) : null}
                    </div>
                    <div style={{minWidth: 0, flex: 1}}>
                      <strong style={{display: 'block', marginBottom: '8px'}}>{course.title}</strong>
                      <CourseDescription description={course.description} />
                    </div>
                  </div>
                </td>
                <td>{course.category}</td>
                <td>{course.instructor}</td>
                <td>
                  <div>
                    {course.hasPromotion ? (
                      <>
                        <del style={{color: '#999', fontSize: '0.9em'}}>
                          {course.originalPrice} TND
                        </del>
                        <br />
                        <strong style={{color: '#e91e63'}}>
                          {course.price} TND
                        </strong>
                      </>
                    ) : (
                      <strong>{course.price} TND</strong>
                    )}
                  </div>
                </td>
                <td>
                  {course.hasPromotion ? (
                    <span style={{
                      background: '#22c55e',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '0.8em',
                      fontWeight: 'bold'
                    }}>
                      -{course.discountPercentage}%
                    </span>
                  ) : (
                    <span style={{color: '#999'}}>Aucune</span>
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
                      className="btn-icon" 
                      title="Voir détails"
                      onClick={() => handleViewCourse(course)}
                    >
                      👁️
                    </button>
                    <button className="btn-icon" title="Éditer">✏️</button>
                    <button 
                      className="btn-icon btn-danger" 
                      title="Supprimer"
                      onClick={() => onDeleteCourse(course.id)}
                    >
                      🗑️
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
    </div>
  );
};

export default CoursesTab;