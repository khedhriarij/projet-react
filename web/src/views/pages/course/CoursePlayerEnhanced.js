// src/views/pages/course/CoursePlayerEnhanced.js - VERSION CORRIGÉE
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCourseContext } from '../../../viewmodels/context/CourContext';
import { useCoursePurchase } from '../../../viewmodels/hooks/useCoursePurchase';
import './CoursePlayerEnhanced.css';

export default function CoursePlayerEnhanced() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getCourseById } = useCourseContext();
  const { updateCourseProgress, getCourseProgress } = useCoursePurchase();
  
  const [course, setCourse] = useState(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showResources, setShowResources] = useState(false);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const videoRef = useRef(null);

  useEffect(() => {
    const courseId = parseInt(id);
    if (courseId) {
      const foundCourse = getCourseById(courseId);
      if (foundCourse) {
        setCourse(foundCourse);
        
        // Charger la progression
        const progress = getCourseProgress(courseId);
        setCompletedLessons(progress?.completedLessons || []);
      }
    }
  }, [id, getCourseById, getCourseProgress]);

  const currentSectionData = course?.sections?.[currentSection];
  const currentLessonData = currentSectionData?.lessons?.[currentLesson];

  const handleVideoProgress = (e) => {
    if (videoRef.current) {
      const video = videoRef.current;
      setCurrentTime(video.currentTime);
      setDuration(video.duration);
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

  const markLessonComplete = () => {
    if (!course || !currentLessonData) return;
    
    const lessonId = currentLessonData.id || `${currentSection}-${currentLesson}`;
    
    if (!completedLessons.includes(lessonId)) {
      const newCompletedLessons = [...completedLessons, lessonId];
      setCompletedLessons(newCompletedLessons);
      
      updateCourseProgress(course.id, {
        completedLessons: newCompletedLessons,
        progress: Math.round((newCompletedLessons.length / getTotalLessons()) * 100),
        lastAccessed: new Date().toISOString()
      });
      
      alert(`✅ Leçon "${currentLessonData.title}" marquée comme terminée !`);
    }
  };

  const getTotalLessons = () => {
    return course?.sections?.reduce((total, section) => total + (section.lessons?.length || 0), 0) || 0;
  };

  const goToNextLesson = () => {
    if (!currentSectionData) return;

    const nextLesson = currentLesson + 1;
    if (nextLesson < currentSectionData.lessons.length) {
      setCurrentLesson(nextLesson);
      setIsPlaying(false);
    } else {
      const nextSection = currentSection + 1;
      if (nextSection < course.sections.length) {
        setCurrentSection(nextSection);
        setCurrentLesson(0);
        setIsPlaying(false);
      } else {
        alert('🎉 Félicitations ! Vous avez terminé ce cours !');
      }
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // FONCTION POUR TÉLÉCHARGER UN PDF RÉEL
  const downloadRealPDF = async (lessonTitle) => {
    try {
      // Import dynamique de jsPDF
      const { jsPDF } = await import('jspdf');
      
      // Créer un nouveau PDF
      const pdf = new jsPDF();
      
      // Ajouter le contenu au PDF
      pdf.setFontSize(20);
      pdf.setTextColor(79, 70, 229);
      pdf.text(course?.title || 'Cours', 20, 30);
      
      pdf.setFontSize(16);
      pdf.setTextColor(31, 41, 55);
      pdf.text(lessonTitle, 20, 50);
      
      pdf.setFontSize(10);
      pdf.setTextColor(107, 114, 128);
      pdf.text(`Section ${currentSection + 1} • Leçon ${currentLesson + 1}`, 20, 65);
      pdf.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 20, 75);
      pdf.text('Plateforme: EduPlatform', 20, 85);
      
      // Ligne de séparation
      pdf.setDrawColor(79, 70, 229);
      pdf.line(20, 90, 190, 90);
      
      // Contenu principal
      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);
      
      let yPosition = 110;
      
      // Notes de cours
      pdf.setFontSize(14);
      pdf.setTextColor(79, 70, 229);
      pdf.text('📝 Notes de Cours', 20, yPosition);
      
      yPosition += 15;
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
      
      const notes = [
        '• Concept principal de la leçon',
        '• Définitions importantes', 
        '• Exemples pratiques',
        '• Bonnes pratiques',
        '• Pièges à éviter'
      ];
      
      notes.forEach(note => {
        if (yPosition > 270) {
          pdf.addPage();
          yPosition = 20;
        }
        pdf.text(note, 25, yPosition);
        yPosition += 8;
      });
      
      yPosition += 10;
      
      // Description
      if (currentLessonData?.description) {
        pdf.setFontSize(14);
        pdf.setTextColor(79, 70, 229);
        pdf.text('💡 Résumé du Contenu', 20, yPosition);
        
        yPosition += 15;
        pdf.setFontSize(10);
        pdf.setTextColor(0, 0, 0);
        
        const description = pdf.splitTextToSize(currentLessonData.description, 170);
        description.forEach(line => {
          if (yPosition > 270) {
            pdf.addPage();
            yPosition = 20;
          }
          pdf.text(line, 20, yPosition);
          yPosition += 8;
        });
        
        yPosition += 10;
      }
      
      // Footer
      pdf.setFontSize(8);
      pdf.setTextColor(107, 114, 128);
      pdf.text(`© ${new Date().getFullYear()} EduPlatform - Document généré automatiquement`, 20, 285);
      
      // Télécharger le PDF
      pdf.save(`EduPlatform-${course?.title?.replace(/\s+/g, '-')}-${lessonTitle.replace(/\s+/g, '-')}.pdf`);
      
      alert('📄 PDF généré et téléchargé avec succès!');
      
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      alert('❌ Erreur lors de la génération du PDF. Veuillez réessayer.');
    }
  };

  if (!course) {
    return (
      <div className="course-player-enhanced">
        <div className="loading-course">
          <div className="loading-spinner"></div>
          <p>Chargement du cours...</p>
        </div>
      </div>
    );
  }

  const overallProgress = Math.round((completedLessons.length / getTotalLessons()) * 100);

  return (
    <div className="course-player-enhanced">
      {/* En-tête */}
      <div className="player-header">
        <div className="header-content">
          <button 
            onClick={() => navigate(`/course/${course.id}`)} 
            className="back-btn"
          >
            ← Retour au cours
          </button>
          
          <div className="course-info">
            <h1>{course.title}</h1>
            <div className="progress-overview">
              <span>Progression globale: {overallProgress}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="player-layout">
        {/* Sidebar des leçons */}
        <div className="lessons-sidebar">
          <div className="sidebar-header">
            <h3>Contenu du cours</h3>
            <span>{completedLessons.length}/{getTotalLessons()} leçons</span>
          </div>

          <div className="sections-list">
            {course.sections?.map((section, sectionIndex) => (
              <div key={sectionIndex} className="section-item">
                <div className="section-header">
                  <h4>
                    <span className="section-number">{sectionIndex + 1}.</span>
                    {section.title}
                  </h4>
                  <span className="section-lessons">
                    {section.lessons?.length} leçons
                  </span>
                </div>
                
                <div className="lessons-list">
                  {section.lessons?.map((lesson, lessonIndex) => {
                    const lessonId = lesson.id || `${sectionIndex}-${lessonIndex}`;
                    const isCompleted = completedLessons.includes(lessonId);
                    const isCurrent = sectionIndex === currentSection && lessonIndex === currentLesson;
                    
                    return (
                      <div
                        key={lessonIndex}
                        className={`lesson-item ${isCurrent ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                        onClick={() => {
                          setCurrentSection(sectionIndex);
                          setCurrentLesson(lessonIndex);
                          setIsPlaying(false);
                        }}
                      >
                        <div className="lesson-status">
                          {isCompleted ? '✓' : lessonIndex + 1}
                        </div>
                        <div className="lesson-info">
                          <span className="lesson-title">{lesson.title}</span>
                          <span className="lesson-duration">{lesson.duration}</span>
                        </div>
                        {isCompleted && <div className="completion-check">✅</div>}
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
              {/* Lecteur vidéo amélioré */}
              <div className="video-section">
                <div className="video-container">
                  {currentLessonData.videoUrl ? (
                    <>
                      <video
                        ref={videoRef}
                        src={currentLessonData.videoUrl}
                        onTimeUpdate={handleVideoProgress}
                        onLoadedMetadata={(e) => setDuration(e.target.duration)}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                        onEnded={() => setIsPlaying(false)}
                        controls
                        className="video-player"
                      >
                        Votre navigateur ne supporte pas la lecture vidéo.
                      </video>
                      
                      {/* Contrôles personnalisés */}
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
                        
                        <button className="control-btn" onClick={() => videoRef.current.requestFullscreen()}>
                          ⛶
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="no-video">
                      <div className="no-video-icon">📺</div>
                      <h3>Aucune vidéo disponible</h3>
                      <p>Cette leçon ne contient pas de contenu vidéo.</p>
                    </div>
                  )}
                </div>

                {/* Informations de la leçon */}
                <div className="lesson-info-card">
                  <div className="lesson-header">
                    <h2>{currentLessonData.title}</h2>
                    <div className="lesson-meta">
                      Section {currentSection + 1} • Leçon {currentLesson + 1} • {currentLessonData.duration}
                    </div>
                  </div>
                  
                  <div className="lesson-description">
                    <h4>Description</h4>
                    <p>{currentLessonData.description}</p>
                  </div>

                  {currentLessonData.objectives && (
                    <div className="learning-objectives">
                      <h4>🎯 Objectifs d'apprentissage</h4>
                      <ul>
                        {currentLessonData.objectives.map((objective, idx) => (
                          <li key={idx}>{objective}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Section Ressources PDF */}
              <div className="resources-section">
                <div className="section-header">
                  <h3>📚 Ressources de la leçon</h3>
                  <button 
                    onClick={() => setShowResources(!showResources)} 
                    className="toggle-btn"
                  >
                    {showResources ? 'Masquer' : 'Afficher'}
                  </button>
                </div>

                {showResources && (
                  <div className="resources-list">
                    {/* PDF des notes de cours */}
                    <div className="resource-item pdf-resource">
                      <div className="resource-icon">📄</div>
                      <div className="resource-info">
                        <h4>Notes de cours - {currentLessonData.title}</h4>
                        <p>Document PDF contenant les points clés, résumés et exercices</p>
                        <div className="resource-meta">
                          <span>PDF • Complet • Format professionnel</span>
                        </div>
                      </div>
                      <div className="resource-actions">
                        <button 
                          className="btn-download-primary"
                          onClick={() => downloadRealPDF(currentLessonData.title)}
                        >
                          📥 Télécharger le PDF
                        </button>
                      </div>
                    </div>

                    {/* Exercices pratiques */}
                    <div className="resource-item exercise-resource">
                      <div className="resource-icon">💪</div>
                      <div className="resource-info">
                        <h4>Exercices pratiques</h4>
                        <p>PDF avec exercices et problèmes pour mettre en pratique</p>
                        <div className="resource-meta">
                          <span>PDF • Exercices • Solutions</span>
                        </div>
                      </div>
                      <div className="resource-actions">
                        <button 
                          className="btn-download-primary"
                          onClick={() => downloadRealPDF(`Exercices-${currentLessonData.title}`)}
                        >
                          📥 Télécharger les exercices
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation entre les leçons */}
              <div className="navigation-section">
                <div className="nav-buttons">
                  <button 
                    className="complete-btn"
                    onClick={markLessonComplete}
                    disabled={completedLessons.includes(currentLessonData.id || `${currentSection}-${currentLesson}`)}
                  >
                    {completedLessons.includes(currentLessonData.id || `${currentSection}-${currentLesson}`) 
                      ? '✅ Leçon terminée' 
                      : 'Marquer comme terminée'
                    }
                  </button>
                  
                  <button 
                    className="next-btn"
                    onClick={goToNextLesson}
                  >
                    {currentLesson < currentSectionData.lessons.length - 1 
                      ? 'Leçon suivante →' 
                      : currentSection < course.sections.length - 1 
                        ? 'Section suivante →' 
                        : 'Terminer le cours'
                    }
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="no-lesson">
              <div className="no-lesson-icon">📖</div>
              <h3>Sélectionnez une leçon</h3>
              <p>Choisissez une leçon dans le menu de gauche pour commencer votre apprentissage.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}