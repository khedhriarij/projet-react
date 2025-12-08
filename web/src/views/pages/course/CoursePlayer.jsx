// src/views/pages/course/CoursePlayer.jsx - VERSION CORRIGÉE
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCourseContext } from '../../../viewmodels/context/CourContext';
import fileStorageService from '../../../models/services/FileStorageService';
import './CoursePlayer.css';

export default function CoursePlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getCourseById } = useCourseContext();
  
  const [course, setCourse] = useState(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [videoProgress, setVideoProgress] = useState(0);
  const [showResources, setShowResources] = useState(false);
  const [lessonFiles, setLessonFiles] = useState([]); 
  const [filesLoading, setFilesLoading] = useState(false); // Ajout de l'état pour le chargement

  // Charger le cours et les fichiers
  useEffect(() => {
    const courseId = parseInt(id);
    if (courseId) {
      const foundCourse = getCourseById(courseId);
      if (foundCourse) {
        setCourse(foundCourse);
        console.log('✅ Cours chargé:', foundCourse.title);
        
        // Charger les fichiers du cours
        loadCourseFiles(courseId);
      }
    }
  }, [id, getCourseById]); 

  // Fonction pour charger les fichiers du cours
  const loadCourseFiles = async (courseId) => {
    setFilesLoading(true);
    try {
      console.log(`🔄 Chargement fichiers pour cours ${courseId}...`);
      const files = await fileStorageService.getCourseFiles(courseId);
      setLessonFiles(files);
      console.log(`✅ ${files.length} fichiers chargés pour le lecteur`);
    } catch (error) {
      console.error('❌ Erreur chargement fichiers:', error);
    } finally {
      setFilesLoading(false);
    }
  };

  // Simulation progression vidéo
  useEffect(() => {
    const interval = setInterval(() => {
      setVideoProgress(prev => prev >= 100 ? 100 : prev + 0.5);
    }, 1000);
    return () => clearInterval(interval);
  }, [currentLesson]);

  if (!course) {
    return (
      <div className="course-player">
        <div className="loading-course">
          <div className="loading-spinner"></div>
          <p>Chargement du cours...</p>
        </div>
      </div>
    );
  }

  const currentSectionData = course.sections?.[currentSection];
  const currentLessonData = currentSectionData?.lessons?.[currentLesson];

  return (
    <div className="course-player">
      {/* En-tête */}
      <div className="player-header">
        <div className="header-content">
          <button onClick={() => navigate(`/course/${course.id}`)} className="back-btn">
            ← Retour au cours
          </button>
          <div className="progress-section">
            <span>🎬 Lecture du cours</span>
          </div>
        </div>
      </div>

      <div className="player-layout">
        {/* Sidebar */}
        <div className="lessons-sidebar">
          <div className="sidebar-header">
            <h3>{course.title}</h3>
            <span>0% complété</span>
          </div>

          <div className="sections-list">
            {course.sections?.map((section, sectionIndex) => (
              <div key={sectionIndex} className="section-item">
                <div className="section-header">
                  <h4>{sectionIndex + 1}. {section.title}</h4>
                </div>
                <div className="lessons-list">
                  {section.lessons?.map((lesson, lessonIndex) => {
                    const isCurrent = sectionIndex === currentSection && lessonIndex === currentLesson;
                    return (
                      <div
                        key={lessonIndex}
                        className={`lesson-item ${isCurrent ? 'active' : ''}`}
                        onClick={() => {
                          setCurrentSection(sectionIndex);
                          setCurrentLesson(lessonIndex);
                          setVideoProgress(0);
                        }}
                      >
                        <div className="lesson-status">{lessonIndex + 1}</div>
                        <div className="lesson-info">
                          <span className="lesson-title">{lesson.title}</span>
                          <span className="lesson-duration">{lesson.duration}</span>
                        </div>
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
          {currentLessonData ? (
            <>
              {/* Lecteur vidéo */}
              <div className="video-section">
                <div className="video-container">
                  <iframe
                    src={currentLessonData.videoUrl}
                    title={currentLessonData.title}
                    allowFullScreen
                  ></iframe>
                </div>

                {/* Barre de progression */}
                <div className="video-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill video-progress-fill" 
                      style={{ width: `${videoProgress}%` }}
                    ></div>
                  </div>
                  <span>{Math.round(videoProgress)}% regardé</span>
                </div>

                <div className="lesson-info-card">
                  <h2>{currentLessonData.title}</h2>
                  <p>{currentLessonData.description}</p>
                </div>
              </div>

              {/* Ressources */}
              <div className="resources-section">
                <div className="section-header">
                  <h3>📚 Ressources</h3>
                  <button onClick={() => setShowResources(!showResources)} className="toggle-btn">
                    {showResources ? 'Masquer' : 'Afficher'}
                  </button>
                </div>

                {showResources && (
                  <div className="resources-list">
                    {filesLoading ? (
                      <div className="resources-loading">
                        <div className="loading-spinner"></div>
                        <p>Chargement des ressources...</p>
                      </div>
                    ) : lessonFiles.length === 0 ? (
                      <div className="no-resources">
                        <p>Aucune ressource disponible pour cette leçon.</p>
                      </div>
                    ) : (
                      lessonFiles
                        .filter(file => file.lessonId === currentLesson.toString()) // Filtre par leçon actuelle
                        .map(file => (
                          <div key={file._id} className="resource-item">
                            <div className="resource-icon">
                              {file.type === 'pdf' ? '📄' : 
                               file.type === 'video' ? '🎬' : 
                               file.type === 'code' ? '💻' : '📎'}
                            </div>
                            <div className="resource-info">
                              <h4>{file.name}</h4>
                              <p>{file.description || 'Ressource de la leçon'}</p>
                              {file.size && (
                                <small>{(file.size / 1024 / 1024).toFixed(2)} MB</small>
                              )}
                            </div>
                            <button 
                              className="download-btn" 
                              onClick={() => {
                                if (file.url && file.url !== '#') {
                                  window.open(file.url, '_blank');
                                } else {
                                  alert('Lien de téléchargement non disponible');
                                }
                              }}
                            >
                              Télécharger
                            </button>
                          </div>
                        ))
                    )}
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className="navigation-section">
                <div className="nav-buttons">
                  <button className="complete-btn" onClick={() => alert('Leçon terminée !')}>
                    Marquer comme terminée
                  </button>
                  <button className="next-btn" onClick={() => alert('Module suivant !')}>
                    Module suivant →
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="no-lesson">
              <h3>Sélectionnez une leçon</h3>
              <p>Choisissez une leçon dans le menu de gauche.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}