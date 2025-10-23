// pages/course/CourseDetail.js - VERSION FINALE CORRIGÉE
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useCoursePurchase } from '../../hooks/useCoursePurchase';
import './coursedetail.css';

// Données mock pour le cours
const mockCourse = {
  id: 1,
  title: "React Avancé - Les Hooks et Context API",
  description: "Maîtrisez React avec les Hooks modernes, Context API et Redux. Développez des applications complexes avec les meilleures pratiques. Ce cours vous apprendra à créer des applications React professionnelles avec les dernières fonctionnalités.",
  price: 89,
  originalPrice: 129,
  category: "Développement",
  image: "/images/react.jpg",
  instructor: "Ahmed Ben Ali",
  rating: 4.8,
  students: 1240,
  duration: "12h 30min",
  level: "Intermédiaire",
  featured: true,
  objectives: [
    "Maîtriser les Hooks React (useState, useEffect, useContext, etc.)",
    "Comprendre et utiliser Context API efficacement",
    "Implémenter Redux pour la gestion d'état globale",
    "Créer des composants réutilisables et performants",
    "Développer des applications React complètes"
  ],
  requirements: [
    "Connaissances de base en JavaScript",
    "Expérience avec React (concepts fondamentaux)",
    "Environnement de développement configuré"
  ],
  lessons: [
    {
      id: 1,
      title: "Introduction aux Hooks React",
      duration: "45min",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      description: "Découvrez les bases des Hooks React et pourquoi ils ont révolutionné la façon de développer avec React.",
      objectives: [
        "Comprendre le concept des Hooks",
        "Différence entre composants classe et fonction",
        "Quand utiliser les Hooks"
      ],
      premium: false
    },
    {
      id: 2,
      title: "useState et useEffect en profondeur",
      duration: "1h 20min",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      description: "Plongez dans les deux Hooks les plus importants : useState pour la gestion d'état et useEffect pour les effets de bord.",
      objectives: [
        "Maîtriser useState pour tous les cas d'usage",
        "Comprendre le cycle de vie avec useEffect",
        "Optimiser les performances"
      ],
      premium: false
    },
    {
      id: 3,
      title: "Context API et useReducer",
      duration: "1h 30min",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      description: "Apprenez à gérer l'état global de votre application sans bibliothèque externe.",
      objectives: [
        "Créer et utiliser des Contexts",
        "Combiner useReducer avec Context",
        "Patterns avancés de gestion d'état"
      ],
      premium: true
    },
    {
      id: 4,
      title: "Création de Hooks personnalisés",
      duration: "1h 15min",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      description: "Réutilisez votre logique métier en créant vos propres Hooks personnalisés.",
      objectives: [
        "Structure d'un Hook personnalisé",
        "Règles des Hooks",
        "Cas pratiques réels"
      ],
      premium: true
    }
  ]
};

export default function CourseDetail() {
  const { id } = useParams();
  // eslint-disable-next-line no-unused-vars
  const { user } = useAuthContext(); // ← AJOUT DU COMMENTAIRE POUR IGNORER LE WARNING
  const { purchaseCourse, hasPurchasedCourse, updateCourseProgress, isProcessing } = useCoursePurchase();
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedLesson, setSelectedLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState([]);

  const isPurchased = hasPurchasedCourse(parseInt(id));
  const discount = course ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100) : 0;

  useEffect(() => {
    // Simulation du chargement des données
    const timer = setTimeout(() => {
      setCourse(mockCourse);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handlePurchase = async () => {
    const success = await purchaseCourse(course.id, {
      title: course.title,
      instructor: course.instructor,
      image: course.image,
      price: course.price
    });

    if (success) {
      alert('🎉 Cours acheté avec succès !');
      window.location.reload();
    }
  };

  const handleLessonComplete = () => {
    const currentLesson = course.lessons[selectedLesson];
    if (currentLesson && !completedLessons.includes(currentLesson.id)) {
      updateCourseProgress(course.id, currentLesson.id, true);
      setCompletedLessons(prev => [...prev, currentLesson.id]);
      alert(`✅ Leçon "${currentLesson.title}" marquée comme terminée !`);
    }
  };

  const canAccessLesson = (lesson) => {
    return !lesson.premium || isPurchased;
  };

  const progress = course ? Math.round((completedLessons.length / course.lessons.length) * 100) : 0;

  if (loading) {
    return (
      <div className="course-detail">
        <div className="course-detail-loading">
          <div className="loading-spinner"></div>
          <p>Chargement du cours...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="course-detail">
        <div className="no-results">
          <h3>Cours non trouvé</h3>
          <p>Le cours que vous recherchez n'existe pas.</p>
          <Link to="/catalog" className="btn btn-primary">
            Retour au catalogue
          </Link>
        </div>
      </div>
    );
  }

  const currentLesson = course.lessons[selectedLesson];

  return (
    <div className="course-detail">
      {/* Hero Section */}
      <div className="course-hero">
        <div className="hero-content">
          <div className="breadcrumb">
            <Link to="/catalog">Catalogue</Link> / {course.category} / {course.title}
          </div>
          
          <div className="hero-grid">
            <div className="hero-info">
              <span className="course-category">{course.category}</span>
              <h1>{course.title}</h1>
              <p className="course-description">{course.description}</p>
              
              <div className="course-meta-grid">
                <div className="meta-item">
                  <span className="meta-label">Formateur</span>
                  <span className="meta-value">{course.instructor}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Niveau</span>
                  <span className="meta-value">{course.level}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Durée</span>
                  <span className="meta-value">{course.duration}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Étudiants</span>
                  <span className="meta-value">{course.students.toLocaleString()}</span>
                </div>
              </div>

              <div className="rating-section">
                <span className="stars">★★★★★</span>
                <span className="rating">{course.rating}</span>
                <span className="rating-count">({course.students} avis)</span>
              </div>

              {isPurchased && (
                <div className="progress-section">
                  <div className="progress-bar-large">
                    <div 
                      className="progress-fill" 
                      style={{width: `${progress}%`}}
                    ></div>
                  </div>
                  <span className="overall-progress">
                    Progression globale: {progress}%
                  </span>
                </div>
              )}
            </div>

            <div className="purchase-card">
              <div className="course-preview">
                <img src={course.image} alt={course.title} />
                <div className="preview-overlay">
                  <button className="preview-btn">
                    ▶️ Voir l'aperçu
                  </button>
                </div>
              </div>

              <div className="pricing">
                {course.originalPrice && (
                  <div className="original-price">{course.originalPrice} TND</div>
                )}
                <div className="current-price">{course.price} TND</div>
                {discount > 0 && (
                  <div className="discount">Économisez {discount}%</div>
                )}
              </div>

              {isPurchased ? (
                <div className="purchased-badge">
                  ✅ Vous possédez ce cours
                </div>
              ) : (
                <button 
                  onClick={handlePurchase}
                  disabled={isProcessing}
                  className="purchase-btn"
                >
                  {isProcessing ? 'Traitement...' : `Acheter maintenant - ${course.price} TND`}
                </button>
              )}

              <div className="guarantee">
                ✅ Garantie satisfait ou remboursé 30 jours
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="course-content-section">
        <div className="content-grid">
          {/* Lessons Sidebar */}
          <div className="lessons-sidebar">
            <div className="sidebar-header">
              <h3>Contenu du cours</h3>
              <span>{course.lessons.length} leçons • {course.duration}</span>
            </div>
            <div className="lessons-list">
              {course.lessons.map((lesson, index) => {
                const isLocked = !canAccessLesson(lesson);
                const isCompleted = completedLessons.includes(lesson.id);
                
                return (
                  <div
                    key={lesson.id}
                    className={`lesson-item ${selectedLesson === index ? 'active' : ''} ${isLocked ? 'locked' : ''}`}
                    onClick={() => !isLocked && setSelectedLesson(index)}
                  >
                    <div className="lesson-number">
                      {isCompleted ? '✓' : index + 1}
                    </div>
                    <div className="lesson-info">
                      <h4>
                        {lesson.title}
                        {lesson.premium && <span className="premium-badge">PREMIUM</span>}
                      </h4>
                      <span className="lesson-duration">{lesson.duration}</span>
                    </div>
                    {isLocked && <span className="locked-icon">🔒</span>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Lesson Content */}
          <div className="lesson-content">
            {currentLesson && (
              <>
                <div className="video-container">
                  <iframe
                    src={currentLesson.videoUrl}
                    title={currentLesson.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>

                <div className="lesson-header">
                  <h2>{currentLesson.title}</h2>
                  <div className="lesson-meta">
                    Leçon {selectedLesson + 1} sur {course.lessons.length} • {currentLesson.duration}
                  </div>
                </div>

                <div className="lesson-summary">
                  <h3>Description</h3>
                  <p>{currentLesson.description}</p>

                  <div className="learning-objectives">
                    <h4>Objectifs d'apprentissage</h4>
                    <ul>
                      {currentLesson.objectives.map((objective, idx) => (
                        <li key={idx}>• {objective}</li>
                      ))}
                    </ul>
                  </div>

                  {isPurchased && canAccessLesson(currentLesson) && (
                    <button
                      onClick={handleLessonComplete}
                      className={`complete-btn ${completedLessons.includes(currentLesson.id) ? 'completed' : ''}`}
                    >
                      {completedLessons.includes(currentLesson.id) 
                        ? '✅ Leçon terminée' 
                        : 'Marquer comme terminée'}
                    </button>
                  )}

                  {!canAccessLesson(currentLesson) && (
                    <div style={{
                      background: '#fff3cd',
                      border: '1px solid #ffeaa7',
                      padding: '15px',
                      borderRadius: '6px',
                      textAlign: 'center'
                    }}>
                      <p>🔒 Cette leçon est réservée aux étudiants ayant acheté le cours.</p>
                      <button 
                        onClick={handlePurchase}
                        className="purchase-btn"
                        style={{marginTop: '10px'}}
                      >
                        Acheter le cours pour débloquer
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Course Info Sections */}
      <div className="course-info-sections">
        <div className="info-grid">
          <div className="info-card">
            <h3>🎯 Objectifs du cours</h3>
            <ul className="objectives-list">
              {course.objectives.map((objective, index) => (
                <li key={index}>{objective}</li>
              ))}
            </ul>
          </div>

          <div className="info-card">
            <h3>📋 Prérequis</h3>
            <ul className="requirements-list">
              {course.requirements.map((requirement, index) => (
                <li key={index}>{requirement}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}