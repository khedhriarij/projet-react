// frontend/src/views/pages/course/CoursePlayerFinal.jsx - LECTEUR FINAL
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useCourseContext } from '../../../viewmodels/context/CourContext';
import { useCoursePurchase } from '../../../viewmodels/hooks/useCoursePurchase';
import lessonService from '../../../models/services/LessonService';
import fileStorageService from '../../../models/services/FileStorageService';
import './CoursePlayerFinal.css';

// Composant PDF Viewer intégré
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Configuration PDF worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function CoursePlayerFinal() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { getCourseById } = useCourseContext();
  const { updateCourseProgress, getCourseProgress, hasPurchasedCourse } = useCoursePurchase();
  
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [sections, setSections] = useState({});
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [currentSection, setCurrentSection] = useState('section1');
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [activeTab, setActiveTab] = useState('video');
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [lessonResources, setLessonResources] = useState([]);
  const [isPurchased, setIsPurchased] = useState(false);

  const videoRef = useRef(null);

  // Charger le cours et les leçons
  useEffect(() => {
    const loadCourseData = async () => {
      setLoading(true);
      const courseId = parseInt(id);
      
      if (courseId) {
        // Charger le cours
        const foundCourse = getCourseById(courseId);
        setCourse(foundCourse);

        // Vérifier l'achat
        const purchased = await hasPurchasedCourse(courseId);
        setIsPurchased(purchased);

        // Charger les leçons depuis l'API
        const lessonsResult = await lessonService.getCourseLessons(courseId);
        
        if (lessonsResult.success) {
          setLessons(lessonsResult.data);
          setSections(lessonsResult.sections);
          
          // Récupérer la progression
          const progress = getCourseProgress(courseId);
          setCompletedLessons(progress?.completedLessons || []);
          
          // Si on vient d'une redirection avec une leçon spécifique
          const searchParams = new URLSearchParams(location.search);
          const lessonId = searchParams.get('lesson');
          if (lessonId) {
            const lessonIndex = lessonsResult.data.findIndex(l => l._id === lessonId);
            if (lessonIndex !== -1) {
              setCurrentLessonIndex(lessonIndex);
              setCurrentSection(lessonsResult.data[lessonIndex].sectionId);
            }
          }
        }

        setLoading(false);
      }
    };

    loadCourseData();
  }, [id, getCourseById, location.search, hasPurchasedCourse, getCourseProgress]);

  // Gestion vidéo
  const handleVideoProgress = (e) => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration);
    }
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (time) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // PDF handling
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const loadLessonResources = async () => {
    if (currentLesson) {
      try {
        // Charger les fichiers liés à cette leçon
        const files = await fileStorageService.getCourseFiles(course.id);
        const lessonId = currentLesson._id || currentLesson.lessonNumber;
        const lessonFiles = files.filter(file => 
          file.lessonId === lessonId.toString() || 
          file.lessonId === currentLesson._id
        );
        setLessonResources(lessonFiles);
        
        // Si la leçon a un PDF, le charger
        if (currentLesson.pdfUrl) {
          setPdfUrl(currentLesson.pdfUrl);
        }
      } catch (error) {
        console.error('Erreur chargement ressources:', error);
      }
    }
  };

  useEffect(() => {
    loadLessonResources();
  }, [currentLesson]);

  const currentLesson = lessons[currentLessonIndex];
  const sectionLessons = sections[currentSection] || [];

  const markLessonComplete = () => {
    if (!currentLesson || !course) return;
    
    const lessonId = currentLesson._id || `lesson_${currentLessonIndex}`;
    
    if (!completedLessons.includes(lessonId)) {
      const newCompletedLessons = [...completedLessons, lessonId];
      setCompletedLessons(newCompletedLessons);
      
      updateCourseProgress(course.id, {
        completedLessons: newCompletedLessons,
        progress: Math.round((newCompletedLessons.length / lessons.length) * 100),
        lastAccessed: new Date().toISOString()
      });
      
      alert(`✅ Leçon "${currentLesson.title}" terminée !`);
    }
  };

  const goToNextLesson = () => {
    if (currentLessonIndex < lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
      const nextLesson = lessons[currentLessonIndex + 1];
      setCurrentSection(nextLesson.sectionId);
      setIsPlaying(false);
    } else {
      alert('🎉 Félicitations ! Vous avez terminé ce cours !');
    }
  };

  const downloadPDF = () => {
    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `${currentLesson.title.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (loading) {
    return (
      <div className="course-player-final loading">
        <div className="loading-spinner"></div>
        <p>Chargement du cours...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="course-player-final error">
        <h3>Cours non trouvé</h3>
        <button onClick={() => navigate('/catalog')}>Retour au catalogue</button>
      </div>
    );
  }

  if (!isPurchased) {
    return (
      <div className="course-player-final locked">
        <div className="locked-content">
          <h2>🔒 Cours verrouillé</h2>
          <p>Vous devez acheter ce cours pour accéder au lecteur.</p>
          <button 
            onClick={() => navigate(`/course/${course.id}`)}
            className="purchase-btn"
          >
            Acheter le cours - {course.price} TND
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="course-player-final">
      {/* En-tête */}
      <div className="player-header">
        <div className="header-content">
          <button 
            onClick={() => navigate(`/course/${course.id}`)}
            className="back-btn"
          >
            ← Retour au cours
          </button>
          <div className="course-title">
            <h1>{course.title}</h1>
            <span className="progress-indicator">
              Progression: {Math.round((completedLessons.length / lessons.length) * 100)}%
            </span>
          </div>
        </div>
      </div>

      <div className="player-layout">
        {/* Sidebar des leçons */}
        <div className="lessons-sidebar">
          <div className="sidebar-header">
            <h3>Contenu du cours</h3>
            <span>{completedLessons.length}/{lessons.length} leçons</span>
          </div>

          <div className="sections-list">
            {Object.entries(sections).map(([sectionId, sectionLessons]) => (
              <div key={sectionId} className="section-item">
                <div 
                  className="section-header"
                  onClick={() => setCurrentSection(sectionId)}
                >
                  <h4>Section {sectionId.replace('section', '')}</h4>
                  <span>{sectionLessons.length} leçons</span>
                </div>
                
                <div className="lessons-list">
                  {sectionLessons.map((lesson, index) => {
                    const globalIndex = lessons.findIndex(l => l._id === lesson._id);
                    const isCompleted = completedLessons.includes(lesson._id);
                    const isCurrent = globalIndex === currentLessonIndex;
                    
                    return (
                      <div
                        key={lesson._id}
                        className={`lesson-item ${isCurrent ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                        onClick={() => {
                          setCurrentLessonIndex(globalIndex);
                          setIsPlaying(false);
                        }}
                      >
                        <div className="lesson-status">
                          {isCompleted ? '✓' : index + 1}
                        </div>
                        <div className="lesson-info">
                          <span className="lesson-title">{lesson.title}</span>
                          <span className="lesson-duration">{lesson.duration}</span>
                        </div>
                        {isCompleted && <div className="completion-badge">Terminé</div>}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contenu principal */}
        <div className="player-content">
          {currentLesson ? (
            <>
              {/* Onglets */}
              <div className="content-tabs">
                <button 
                  className={`tab-btn ${activeTab === 'video' ? 'active' : ''}`}
                  onClick={() => setActiveTab('video')}
                >
                  📹 Vidéo
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'pdf' ? 'active' : ''}`}
                  onClick={() => setActiveTab('pdf')}
                >
                  📄 PDF
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'resources' ? 'active' : ''}`}
                  onClick={() => setActiveTab('resources')}
                >
                  📚 Ressources
                </button>
              </div>

              {/* Onglet Vidéo */}
              {activeTab === 'video' && (
                <div className="video-tab">
                  <div className="video-container">
                    {currentLesson.videoProvider === 'youtube' ? (
                      <iframe
                        src={currentLesson.videoUrl}
                        title={currentLesson.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    ) : (
                      <video
                        ref={videoRef}
                        src={currentLesson.videoUrl}
                        controls
                        onTimeUpdate={handleVideoProgress}
                        onLoadedMetadata={(e) => setDuration(e.target.duration)}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                        className="video-player"
                      >
                        Votre navigateur ne supporte pas la vidéo.
                      </video>
                    )}
                  </div>

                  {/* Contrôles vidéo personnalisés */}
                  {currentLesson.videoProvider !== 'youtube' && (
                    <div className="video-controls">
                      <button onClick={handlePlayPause} className="control-btn">
                        {isPlaying ? '⏸️' : '▶️'}
                      </button>
                      <div className="progress-container">
                        <span className="time-current">{formatTime(currentTime)}</span>
                        <div 
                          className="progress-bar"
                          onClick={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const percent = (e.clientX - rect.left) / rect.width;
                            handleSeek(percent * duration);
                          }}
                        >
                          <div 
                            className="progress-fill" 
                            style={{ width: `${(currentTime / duration) * 100}%` }}
                          ></div>
                        </div>
                        <span className="time-duration">{formatTime(duration)}</span>
                      </div>
                    </div>
                  )}

                  {/* Informations leçon */}
                  <div className="lesson-info">
                    <h2>{currentLesson.title}</h2>
                    <p className="lesson-description">{currentLesson.description}</p>
                    <div className="lesson-meta">
                      <span>Durée: {currentLesson.duration}</span>
                      <span>Leçon {currentLessonIndex + 1} sur {lessons.length}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Onglet PDF */}
              {activeTab === 'pdf' && pdfUrl && (
                <div className="pdf-tab">
                  <div className="pdf-header">
                    <h3>{currentLesson.title} - PDF</h3>
                    <button onClick={downloadPDF} className="download-pdf-btn">
                      📥 Télécharger PDF
                    </button>
                  </div>
                  
                  <div className="pdf-viewer">
                    <Document
                      file={pdfUrl}
                      onLoadSuccess={onDocumentLoadSuccess}
                    >
                      <Page pageNumber={pageNumber} />
                    </Document>
                  </div>
                  
                  <div className="pdf-controls">
                    <button 
                      onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
                      disabled={pageNumber <= 1}
                    >
                      ← Précédent
                    </button>
                    <span>
                      Page {pageNumber} sur {numPages || '...'}
                    </span>
                    <button 
                      onClick={() => setPageNumber(prev => Math.min(prev + 1, numPages || prev))}
                      disabled={pageNumber >= (numPages || 1)}
                    >
                      Suivant →
                    </button>
                  </div>
                </div>
              )}

              {/* Onglet Ressources */}
              {activeTab === 'resources' && (
                <div className="resources-tab">
                  <h3>📚 Ressources de la leçon</h3>
                  
                  {/* Ressources de la leçon */}
                  {currentLesson.resources && currentLesson.resources.length > 0 && (
                    <div className="resources-list">
                      {currentLesson.resources.map((resource, index) => (
                        <div key={index} className="resource-item">
                          <div className="resource-icon">
                            {resource.type === 'pdf' ? '📄' : 
                             resource.type === 'exercise' ? '💪' : '🔗'}
                          </div>
                          <div className="resource-info">
                            <h4>{resource.title}</h4>
                            <p>{resource.description}</p>
                          </div>
                          <a 
                            href={resource.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="resource-btn"
                          >
                            {resource.type === 'pdf' ? 'Voir' : 'Accéder'}
                          </a>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Fichiers uploadés */}
                  {lessonResources.length > 0 && (
                    <>
                      <h4>Fichiers complémentaires</h4>
                      <div className="files-list">
                        {lessonResources.map(file => (
                          <div key={file._id} className="file-item">
                            <span className="file-icon">
                              {file.type === 'pdf' ? '📄' : 
                               file.type === 'video' ? '🎬' : '📎'}
                            </span>
                            <div className="file-info">
                              <strong>{file.name}</strong>
                              <small>{file.description}</small>
                            </div>
                            <a 
                              href={file.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="download-btn"
                            >
                              Télécharger
                            </a>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {(!currentLesson.resources || currentLesson.resources.length === 0) && 
                   lessonResources.length === 0 && (
                    <div className="no-resources">
                      <p>Aucune ressource disponible pour cette leçon.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Navigation */}
              <div className="navigation-section">
                <div className="nav-buttons">
                  <button 
                    className="complete-btn"
                    onClick={markLessonComplete}
                    disabled={completedLessons.includes(currentLesson._id)}
                  >
                    {completedLessons.includes(currentLesson._id) 
                      ? '✅ Leçon terminée' 
                      : 'Marquer comme terminée'}
                  </button>
                  
                  <button 
                    className="next-btn"
                    onClick={goToNextLesson}
                    disabled={currentLessonIndex >= lessons.length - 1}
                  >
                    Leçon suivante →
                  </button>
                </div>
                
                <div className="progress-summary">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ 
                        width: `${Math.round((completedLessons.length / lessons.length) * 100)}%` 
                      }}
                    ></div>
                  </div>
                  <span>
                    {completedLessons.length} sur {lessons.length} leçons terminées
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="no-lesson">
              <h3>Sélectionnez une leçon</h3>
              <p>Choisissez une leçon dans le menu de gauche pour commencer.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}