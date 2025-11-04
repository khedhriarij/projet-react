// pages/course/CourseDetail.js - VERSION CORRIGÉE
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useCoursePurchase } from '../../hooks/useCoursePurchase';
import { useQuizContext } from '../../context/QuizContext';
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
// Composant pour afficher les quiz du cours
// Composant pour afficher les quiz du cours
const CourseQuizzes = ({ courseId }) => {
  const { getQuizzesByCourse, getQuizAttempts } = useQuizContext();
  const navigate = useNavigate();
  
  const quizzes = getQuizzesByCourse(courseId);

  // Éviter les doublons
  const uniqueQuizzes = quizzes.filter((quiz, index, self) => 
    index === self.findIndex(q => q.id === quiz.id)
  );

  if (uniqueQuizzes.length === 0) {
    return (
      <div className="no-quizzes">
        <div className="no-quizzes-icon">📝</div>
        <h3>Aucun quiz disponible</h3>
        <p>Les quiz pour ce cours seront bientôt disponibles.</p>
      </div>
    );
  }

  return (
    <div className="course-quizzes">
      <div className="quizzes-header">
        <h2>Quiz & Évaluations</h2>
        <p>Testez vos connaissances et validez votre apprentissage</p>
      </div>

      <div className="quizzes-grid">
        {uniqueQuizzes.map(quiz => {
          const attempts = getQuizAttempts(quiz.id);
          const bestAttempt = attempts.length > 0 
            ? Math.max(...attempts.map(a => a.percentage))
            : null;

          const isPassed = bestAttempt && bestAttempt >= quiz.passingScore;
          const attemptCount = attempts.length;

          return (
            <div key={quiz.id} className="quiz-card">
              <div className="quiz-header">
                <h3>{quiz.title}</h3>
                {bestAttempt && (
                  <span className={`status-badge ${isPassed ? 'passed' : 'failed'}`}>
                    {isPassed ? 'Réussi' : 'Échoué'}
                  </span>
                )}
              </div>
              
              <p className="quiz-description">{quiz.description}</p>
              
              <div className="quiz-meta">
                <div className="meta-item">
                  <span className="meta-icon">⏱️</span>
                  <span>{quiz.duration} min</span>
                </div>
                <div className="meta-item">
                  <span className="meta-icon">❓</span>
                  <span>{quiz.questions.length} questions</span>
                </div>
                <div className="meta-item">
                  <span className="meta-icon">🎯</span>
                  <span>{quiz.passingScore}% pour réussir</span>
                </div>
              </div>

              {bestAttempt && (
                <div className="quiz-progress">
                  <div className="progress-info">
                    <span>Meilleur score</span>
                    <span className="score">{bestAttempt}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className={`progress-fill ${isPassed ? 'passed' : 'failed'}`}
                      style={{ width: `${bestAttempt}%` }}
                    ></div>
                  </div>
                  <div className="attempt-info">
                    {attemptCount} tentative{attemptCount > 1 ? 's' : ''}
                  </div>
                </div>
              )}

              <div className="quiz-actions">
                <button 
                  onClick={() => navigate(`/quiz/${quiz.id}`)}
                  className={`quiz-btn ${bestAttempt ? 'retake' : 'start'}`}
                >
                  {bestAttempt ? 'Repasser le quiz' : 'Commencer le quiz'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
// Composant principal CourseDetail
export default function CourseDetail() {
  const { id } = useParams();
  // Supprimez l'import non utilisé ou utilisez-le
  const { user } = useAuthContext(); // Maintenant utilisé dans l'affichage
  const { purchaseCourse, hasPurchasedCourse, updateCourseProgress, isProcessing } = useCoursePurchase();
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedLesson, setSelectedLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [activeTab, setActiveTab] = useState('lessons'); // 'lessons' | 'resources' | 'quizzes'

  const isPurchased = hasPurchasedCourse(parseInt(id));
  const discount = course ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100) : 0;

  useEffect(() => {
    // Simulation du chargement des données
    const timer = setTimeout(() => {
      setCourse(mockCourse);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
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

              {/* Affichage du nom de l'utilisateur connecté */}
              {user && (
                <div className="user-welcome">
                  <p>👋 Bonjour, <strong>{user.displayName || user.email}</strong> ! Prêt à apprendre ?</p>
                </div>
              )}

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

      {/* Navigation par onglets */}
      <div className="course-tabs-container">
        <div className="course-tabs">
          <button 
            className={`tab-btn ${activeTab === 'lessons' ? 'active' : ''}`}
            onClick={() => setActiveTab('lessons')}
          >
            📚 Leçons
          </button>
          <button 
            className={`tab-btn ${activeTab === 'resources' ? 'active' : ''}`}
            onClick={() => setActiveTab('resources')}
          >
            📎 Ressources
          </button>
          <button 
            className={`tab-btn ${activeTab === 'quizzes' ? 'active' : ''}`}
            onClick={() => setActiveTab('quizzes')}
          >
            🎯 Quiz & Évaluations
          </button>
        </div>
      </div>

      {/* Contenu des onglets */}
      {activeTab === 'lessons' && (
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
                      <div className="locked-lesson-message">
                        <p>🔒 Cette leçon est réservée aux étudiants ayant acheté le cours.</p>
                        <button 
                          onClick={handlePurchase}
                          className="purchase-btn"
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
      )}

      {activeTab === 'quizzes' && (
        <CourseQuizzes courseId={course.id} />
      )}

      {activeTab === 'resources' && (
        <div className="resources-tab">
          <div className="resources-content">
            <h2>📎 Ressources du Cours</h2>
            <div className="resources-list">
              <div className="resource-item">
                <h3>📖 Documentation React</h3>
                <p>Documentation officielle de React sur les Hooks</p>
                <a href="https://reactjs.org/docs/hooks-intro.html" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                  📥 Télécharger
                </a>
              </div>
              <div className="resource-item">
                <h3>💻 Code Source des Exemples</h3>
                <p>Tous les exemples de code du cours</p>
                <button className="btn btn-secondary">
                  📥 Télécharger
                </button>
              </div>
              <div className="resource-item">
                <h3>🎬 Vidéos Supplémentaires</h3>
                <p>Contenu bonus et cas pratiques avancés</p>
                <button className="btn btn-secondary">
                  📥 Télécharger
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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