// pages/course/CourseDetail.js - VERSION OPTIMISÉE
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../../viewmodels/hooks/useAuthContext';
import { useCoursePurchase } from '../../../viewmodels/hooks/useCoursePurchase';
import { useCourseContext } from '../../../viewmodels/context/CourContext';
import { useQuizContext } from '../../../viewmodels/context/QuizContext';
import CoursePlayerIntegrated from './CoursePlayerIntegrated'; 
import fileStorageService from '../../../models/services/FileStorageService';
import { useCart } from '../../../viewmodels/context/CartContext';


import './coursedetail.css';

// Composant pour afficher les quiz du cours
const CourseQuizzes = ({ courseId }) => {
  const { getQuizzesByCourse, getQuizAttempts } = useQuizContext();
  const navigate = useNavigate();
  
  const quizzes = getQuizzesByCourse(courseId);
  
  const uniqueQuizzes = quizzes.filter((quiz, index, self) => 
    index === self.findIndex(q => q.id === quiz.id)
  );

  if (uniqueQuizzes.length === 0) {
    return (
      <div className="no-quizzes">
        <div className="no-quizzes-icon"></div>
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
                  <span>Durée:</span>
                  <span>{quiz.duration} min</span>
                </div>
                <div className="meta-item">
                  <span>Questions:</span>
                  <span>{quiz.questions.length}</span>
                </div>
                <div className="meta-item">
                  <span>Score requis:</span>
                  <span>{quiz.passingScore}%</span>
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
  const { user } = useAuthContext();
  const { purchaseCourse, hasPurchasedCourse, updateCourseProgress, isProcessing } = useCoursePurchase();
  const { getCourseById } = useCourseContext();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedLesson, setSelectedLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [isPurchased, setIsPurchased] = useState(false);
    const [courseFiles, setCourseFiles] = useState([]); 
  const [filesLoading, setFilesLoading] = useState(false); 
  useEffect(() => {
    const loadCourseFiles = async () => {
      if (course && course.id) {
        setFilesLoading(true);
        try {
          console.log(`🔄 Chargement fichiers pour cours ${course.id}...`);
          const files = await fileStorageService.getCourseFiles(course.id);
          setCourseFiles(files);
          console.log(`✅ ${files.length} fichiers chargés`);
        } catch (error) {
          console.error('❌ Erreur chargement fichiers:', error);
          setCourseFiles([]);
        } finally {
          setFilesLoading(false);
        }
      }
    };

    loadCourseFiles();
  }, [course]);
  // Vérification asynchrone de l'achat
  useEffect(() => {
    const checkPurchaseStatus = async () => {
      if (course && user) {
        try {
          const purchased = await hasPurchasedCourse(course.id);
          setIsPurchased(purchased);
        } catch (error) {
          console.error('Erreur vérification achat:', error);
          setIsPurchased(false);
        }
      } else {
        setIsPurchased(false);
      }
    };

    checkPurchaseStatus();
  }, [course, user, hasPurchasedCourse]);

  // Récupération du cours
  useEffect(() => {
    const courseId = parseInt(id);
    
    if (courseId) {
      const foundCourse = getCourseById(courseId);
      
      if (foundCourse) {
        setCourse(foundCourse);
        
        if (foundCourse.sections && foundCourse.sections.length > 0) {
          const allLessons = foundCourse.sections.flatMap(section => 
            section.lessons.map(lesson => ({
              ...lesson,
              sectionTitle: section.title
            }))
          );
          setCourse(prev => ({ ...prev, lessons: allLessons }));
        }
      }
      setLoading(false);
    }
  }, [id, getCourseById]);

  const discount = course && course.originalPrice 
    ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100) 
    : 0;

  const progress = course && course.lessons 
    ? Math.round((completedLessons.length / course.lessons.length) * 100) 
    : 0;

  // Fonction d'achat optimisée
  const handlePurchase = async () => {
    if (!course || !user) {
      alert('Veuillez vous connecter pour acheter un cours');
      return;
    }
    
    try {
      const success = await purchaseCourse(course.id, {
        title: course.title,
        instructor: course.instructor,
        image: course.image,
        price: course.price,
        originalPrice: course.originalPrice
      });

      if (!success) {
        alert('Erreur lors du démarrage du paiement');
      }
    } catch (err) {
      console.error('Erreur achat:', err);
      alert('Erreur: ' + err.message);
    }
  };

  const handleLessonComplete = () => {
    if (!course || !course.lessons) return;
    
    const currentLesson = course.lessons[selectedLesson];
    if (currentLesson && !completedLessons.includes(currentLesson.id)) {
      updateCourseProgress(course.id, currentLesson.id, true);
      setCompletedLessons(prev => [...prev, currentLesson.id]);
      alert(`Leçon "${currentLesson.title}" marquée comme terminée !`);
    }
  };

  const canAccessLesson = (lesson) => {
    return !lesson.premium || isPurchased;
  };

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
          <p>Le cours que vous recherchez n'existe pas ou a été supprimé.</p>
          <Link to="/catalog" className="btn btn-primary">
            Retour au catalogue
          </Link>
        </div>
      </div>
    );
  }

  const currentLesson = course.lessons && course.lessons[selectedLesson] 
    ? course.lessons[selectedLesson] 
    : null;

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
                  <span className="meta-value">{course.students?.toLocaleString() || 0}</span>
                </div>
              </div>

              <div className="rating-section">
                <span className="stars">★★★★★</span>
                <span className="rating">{course.rating || 4.5}</span>
                <span className="rating-count">({course.students || 0} avis)</span>
              </div>

              {user && (
                <div className="user-welcome">
                  <p>Bonjour, <strong>{user.displayName || user.email}</strong> ! Prêt à apprendre ?</p>
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
                <img 
                  src={course.image} 
                  alt={course.title}
                  onError={(e) => {
                    e.target.src = '/images/default-course.jpg';
                  }}
                />
              </div>

              <div className="pricing">
                {course.originalPrice && course.originalPrice > course.price && (
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
                <div className="purchase-actions">
                  <button 
                    onClick={() => addToCart(course)}
                    className="add-to-cart-btn"
                  >
                    🛒 Ajouter au panier
                  </button>
                  
                </div>
              )}



              <div className="guarantee">
                Garantie satisfait ou remboursé 30 jours
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation par onglets */}
      <div className="course-tabs-container">
        <div className="course-tabs">
          <button 
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Aperçu
          </button>
          <button 
            className={`tab-btn ${activeTab === 'lessons' ? 'active' : ''}`}
            onClick={() => setActiveTab('lessons')}
          >
            Leçons
          </button>
          <button 
            className={`tab-btn ${activeTab === 'player' ? 'active' : ''}`}
            onClick={() => setActiveTab('player')}
          >
            Lecture
          </button>
          <button 
            className={`tab-btn ${activeTab === 'resources' ? 'active' : ''}`}
            onClick={() => setActiveTab('resources')}
          >
            Ressources
          </button>
          <button 
            className={`tab-btn ${activeTab === 'quizzes' ? 'active' : ''}`}
            onClick={() => setActiveTab('quizzes')}
          >
            Quiz
          </button>
        </div>
      </div>

      {/* Contenu des onglets */}
      {activeTab === 'overview' && (
        <div className="overview-tab">
          <div className="course-info-sections">
            <div className="info-grid">
              <div className="info-card">
                <h3>Objectifs du cours</h3>
                <ul className="objectives-list">
                  {course.objectives && course.objectives.length > 0 ? (
                    course.objectives.map((objective, index) => (
                      <li key={index}>{objective}</li>
                    ))
                  ) : (
                    <li>Aucun objectif défini pour ce cours.</li>
                  )}
                </ul>
              </div>

              <div className="info-card">
                <h3>Ce qui est inclus</h3>
                <ul className="requirements-list">
                  {course.includes && course.includes.length > 0 ? (
                    course.includes.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))
                  ) : (
                    <li>Accès complet au contenu du cours</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'lessons' && (
        <div className="course-content-section">
          <div className="content-grid">
            <div className="lessons-sidebar">
              <div className="sidebar-header">
                <h3>Contenu du cours</h3>
                <span>
                  {course.lessons ? course.lessons.length : 0} leçons • {course.duration}
                </span>
              </div>
              <div className="lessons-list">
                {course.lessons && course.lessons.length > 0 ? (
                  course.lessons.map((lesson, index) => {
                    const isLocked = !canAccessLesson(lesson);
                    const isCompleted = completedLessons.includes(lesson.id);
                    
                    return (
                      <div
                        key={lesson.id || index}
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
                  })
                ) : (
                  <div className="no-lessons-message">
                    <p>Aucune leçon disponible pour le moment.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="lesson-content">
              {currentLesson ? (
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

                    {currentLesson.objectives && currentLesson.objectives.length > 0 && (
                      <div className="learning-objectives">
                        <h4>Objectifs d'apprentissage</h4>
                        <ul>
                          {currentLesson.objectives.map((objective, idx) => (
                            <li key={idx}>• {objective}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {isPurchased && canAccessLesson(currentLesson) && (
                      <button
                        onClick={handleLessonComplete}
                        className={`complete-btn ${completedLessons.includes(currentLesson.id) ? 'completed' : ''}`}
                      >
                        {completedLessons.includes(currentLesson.id) 
                          ? '✓ Leçon terminée' 
                          : 'Marquer comme terminée'}
                      </button>
                    )}

                    {!canAccessLesson(currentLesson) && (
                      <div className="locked-lesson-message">
                        <p>Cette leçon est réservée aux étudiants ayant acheté le cours.</p>
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
              ) : (
                <div className="no-lesson-selected">
                  <h3>Sélectionnez une leçon pour commencer</h3>
                  <p>Choisissez une leçon dans la liste de gauche pour afficher son contenu.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'player' && (
        <div className="player-tab">
          {isPurchased ? (
            <CoursePlayerIntegrated course={course} />
          ) : (
            <div className="purchase-required">
              <div className="purchase-message">
                <h3>Accédez au lecteur de cours complet</h3>
                <p>Achetez ce cours pour débloquer toutes les fonctionnalités du lecteur :</p>
                <ul>
                  <li>Navigation fluide entre les leçons</li>
                  <li>Suivi de progression en temps réel</li>
                  <li>Téléchargement des ressources</li>
                  <li>Interface optimisée pour l'apprentissage</li>
                </ul>
                <button onClick={handlePurchase} className="btn btn-primary large">
                  Acheter le cours - {course.price} TND
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'quizzes' && (
        <CourseQuizzes courseId={course.id} />
      )}

  {activeTab === 'resources' && (
  <div className="resources-tab">
    <div className="resources-content">
      <h2>📚 Ressources du cours</h2>

      {/* Vérification accès */}
      {!isPurchased ? (
        <div className="locked-resources">
          <h3>🔒 Accès réservé</h3>
          <p>Vous devez acheter ce cours pour accéder aux fichiers téléchargeables.</p>
          <button onClick={handlePurchase} className="purchase-btn">
            Acheter le cours – {course.price} TND
          </button>
        </div>
      ) : (
        <div className="resources-list">
          {filesLoading ? (
            <div className="resources-loading">
              <div className="loading-spinner"></div>
              <p>Chargement des ressources...</p>
            </div>
          ) : courseFiles.length === 0 ? (
            <div className="no-resources">
              <h3>Aucun fichier disponible</h3>
              <p>Les ressources seront ajoutées prochainement.</p>
            </div>
          ) : (
            <ul className="resource-items">
              {courseFiles.map((file, index) => {
                const fileIcon = {
                  pdf: "📄",
                  image: "🖼️",
                  doc: "📝",
                  ppt: "📊",
                  zip: "📦",
                  video: "🎬",
                }[file.type] || "📁";

                return (
                  <li key={file._id ?? index} className="resource-item">
                    <div className="resource-info">
                      <span className="resource-icon">{fileIcon}</span>
                      <div>
                        <h4>{file.name}</h4>
                        <span className="resource-size">
                          {file.size ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "—"}
                        </span>
                      </div>
                    </div>

                    <button
                      className="download-btn"
                      onClick={() => {
                        if (file.url) {
                          window.open(file.url, "_blank");
                        } else {
                          alert("Lien indisponible pour ce fichier.");
                        }
                      }}
                    >
                      Télécharger
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  </div>
)}

    </div>
  );
}