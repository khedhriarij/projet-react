// pages/dashboard/AdminDashboard.js
import React, { useState } from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useAdmin } from '../../hooks/UseAdmin';
import { useCourseContext } from '../../context/CourContext';
import './admindashboard.css';
import { Link } from 'react-router-dom';


const CourseDescription = ({ description }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!description) {
    return <span style={{color: '#999', fontStyle: 'italic'}}>Aucune description</span>;
  }

  const displayText = isExpanded ? description : `${description.substring(0, 36)}...`;

  return (
    <div className="course-description-container">
      <p className={`course-description-text ${!isExpanded ? 'course-description-truncated' : ''}`}>
        {displayText}
      </p>
      {description.length > 36 && (
        <button 
          className="see-more-btn"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Voir moins' : 'Voir plus'}
        </button>
      )}
    </div>
  );
};

const AdminDashboard = () => {
  const { user } = useAuthContext();
  const { isAdmin } = useAdmin();
  const { courses, addCourse, deleteCourse } = useCourseContext();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [showNewCourseForm, setShowNewCourseForm] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: '',
    category: '',
    instructor: '',
    originalPrice: '', // Prix original (avant promotion)
    price: '', // Prix après promotion (prix de vente)
    description: '',
    level: 'Intermédiaire',
    duration: '10h 00min',
    image: '/images/default-course.jpg',
    discountPercentage: 0, // Calculé automatiquement
    hasPromotion: false,
    status: 'draft'
  });

  // Images par défaut disponibles - CORRIGÉ AVEC BONS CHEMINS
  const defaultImages = [
    { url: '/images/react.jpg', label: 'React' },
    { url: '/images/figma.webp', label: 'Figma' },
    { url: '/images/marketing-digital.jpg', label: 'Marketing' },
    { url: '/images/python.jpeg', label: 'Python' },
    { url: '/images/adobe.jpg', label: 'Adobe' },
    { url: '/images/agile.jpeg', label: 'Agile' },
    { url: '/images/ai.jpeg', label: 'Intelligence Artificielle' }, 
    { url: '/images/cour.png', label: 'Cours Général' },
    { url: '/images/default-course.jpg', label: 'Défaut' }
  ];

  // Fonction pour calculer le pourcentage de promotion
  const calculateDiscountPercentage = (originalPrice, promoPrice) => {
    const original = parseFloat(originalPrice);
    const promo = parseFloat(promoPrice);
    
    if (!original || !promo || original <= 0 || promo <= 0) {
      return 0;
    }
    
    if (promo >= original) {
      return 0; // Pas de promotion si le prix promo est supérieur ou égal
    }
    
    const discount = ((original - promo) / original) * 100;
    return Math.round(discount); // Arrondi à l'entier
  };

  // Fonction UNIFIÉE pour gérer les changements
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setNewCourse(prev => {
      const updatedCourse = {
        ...prev,
        [name]: value
      };
      
      // Calcul automatique du pourcentage de promotion
      if (name === 'originalPrice' || name === 'price') {
        const originalPrice = name === 'originalPrice' ? value : prev.originalPrice;
        const promoPrice = name === 'price' ? value : prev.price;
        
        if (originalPrice && promoPrice) {
          const original = parseFloat(originalPrice);
          const promo = parseFloat(promoPrice);
          
          // Validation : le prix promo ne peut pas être supérieur au prix original
          if (promo >= original) {
            updatedCourse.discountPercentage = 0;
            updatedCourse.hasPromotion = false;
          } else {
            const discountPercentage = calculateDiscountPercentage(original, promo);
            updatedCourse.discountPercentage = discountPercentage;
            updatedCourse.hasPromotion = discountPercentage > 0;
          }
        } else {
          // Si un des champs est vide, pas de promotion
          updatedCourse.discountPercentage = 0;
          updatedCourse.hasPromotion = false;
        }
      }
      
      return updatedCourse;
    });
  };

  const handleImageUrlChange = (e) => {
    const { value } = e.target;
    setNewCourse(prev => ({
      ...prev,
      image: value || '/images/default-course.jpg'
    }));
  };

  // Fonction pour sélectionner une image prédéfinie
  const handleSelectDefaultImage = (imageUrl) => {
    setNewCourse(prev => ({
      ...prev,
      image: imageUrl
    }));
  };

  const handleSubmitCourse = (e) => {
    e.preventDefault();
    
    console.log('🎯 Début de la création du cours...');
    
    // Validation des données
    if (!newCourse.title || !newCourse.category || !newCourse.instructor || !newCourse.originalPrice) {
      alert('❌ Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    // Validation des prix
    const originalPrice = parseFloat(newCourse.originalPrice);
    const promoPrice = parseFloat(newCourse.price) || originalPrice; // Si pas de promo, utiliser original
    
    if (promoPrice > originalPrice) {
      alert('❌ Le prix promotionnel ne peut pas être supérieur au prix original');
      return;
    }
    
    if (originalPrice <= 0) {
      alert('❌ Le prix original doit être supérieur à 0');
      return;
    }

    // Créer le cours via le contexte
    const courseData = {
      title: newCourse.title,
      category: newCourse.category,
      instructor: newCourse.instructor,
      price: promoPrice, // Prix de vente (après promotion)
      originalPrice: newCourse.hasPromotion ? originalPrice : null,
      description: newCourse.description,
      level: newCourse.level,
      duration: newCourse.duration,
      image: newCourse.image,
      discountPercentage: newCourse.discountPercentage,
      status: newCourse.status
    };

    try {
      // Utilisez la fonction addCourse du contexte
      addCourse(courseData);
      
      console.log('✅ Cours créé avec succès via le contexte');
      
      // Réinitialiser le formulaire
      setNewCourse({
        title: '',
        category: '',
        instructor: '',
        originalPrice: '',
        price: '',
        description: '',
        level: 'Intermédiaire',
        duration: '10h 00min',
        image: '/images/default-course.jpg',
        discountPercentage: 0,
        hasPromotion: false,
        status: 'draft'
      });
      
      // Fermer le formulaire
      setShowNewCourseForm(false);
      
      alert('✅ Cours créé avec succès ! Il est maintenant sauvegardé.');
      
    } catch (error) {
      console.error('❌ Erreur lors de la création du cours:', error);
      alert('❌ Erreur lors de la création du cours');
    }
  };

  const handleDeleteCourse = (courseId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) {
      deleteCourse(courseId);
      alert('✅ Cours supprimé avec succès !');
    }
  };

  const handleCloseModal = () => {
    setShowNewCourseForm(false);
    setNewCourse({
      title: '',
      category: '',
      instructor: '',
      originalPrice: '',
      price: '',
      description: '',
      level: 'Intermédiaire',
      duration: '10h 00min',
      image: '/images/default-course.jpg',
      discountPercentage: 0,
      hasPromotion: false,
      status: 'draft'
    });
  };

  // Données mockées pour les stats
  const stats = {
    totalRevenue: 125000,
    monthlyRevenue: 25000,
    totalStudents: 1560,
    totalCourses: courses.length,
    totalInstructors: 8,
    activeUsers: 42,
    conversionRate: 15.5,
    monthlyGrowth: 12.5
  };

  const users = [
    {
      id: 1,
      displayName: "Ahmed Ben Salah",
      email: "ahmed@example.com",
      role: "student",
      online: true,
      active: true,
      createdAt: "2024-01-15",
      lastLogin: "2024-01-20"
    },
    {
      id: 2, 
      displayName: "Sarah Trabelsi",
      email: "sarah@example.com",
      role: "instructor",
      online: false,
      active: true,
      createdAt: "2024-01-10",
      lastLogin: "2024-01-18"
    },
    {
      id: 3,
      displayName: "Mohamed Dridi",
      email: "mohamed@example.com", 
      role: "instructor",
      online: true,
      active: true,
      createdAt: "2024-01-05",
      lastLogin: "2024-01-20"
    }
  ];

  const popularCourses = [
    {
      id: 1,
      title: "React Avancé - Les Hooks et Context API",
      category: "Développement",
      instructor: "Ahmed Ben Ali",
      enrollmentCount: 1240,
      revenue: 110360
    },
    {
      id: 2,
      title: "UI/UX Design avec Figma",
      category: "Design",
      instructor: "Sarah Trabelsi",
      enrollmentCount: 890,
      revenue: 61410
    },
    {
      id: 3,
      title: "Marketing Digital 2024",
      category: "Business", 
      instructor: "Mohamed Dridi",
      enrollmentCount: 1560,
      revenue: 123240
    }
  ];

  // Fonctions pour la gestion des cours
  const handleNewCourseClick = () => {
    setShowNewCourseForm(true);
  };

  if (!isAdmin) {
    return (
      <div className="admin-dashboard">
        <div className="access-denied">
          <h2>Welcome</h2>
          <p>Chère admin</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-layout">
        {/* Navigation Sidebar */}
        <nav className="admin-sidebar">
          <div className="sidebar-header">
            <h2>EduPlatform Admin</h2>
            <p>Tableau de Bord</p>
          </div>
          
          <div className="sidebar-nav">
            <button 
              className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <span className="nav-icon">📊</span>
              <span className="nav-label">Vue d'ensemble</span>
            </button>
            
            <button 
              className={`nav-item ${activeTab === 'courses' ? 'active' : ''}`}
              onClick={() => setActiveTab('courses')}
            >
              <span className="nav-icon">📚</span>
              <span className="nav-label">Gestion des Cours</span>
            </button>
            
           
<button 
  className={`nav-item ${activeTab === 'quizzes' ? 'active' : ''}`}
  onClick={() => setActiveTab('quizzes')}
>
  <span className="nav-icon">🎯</span>
  <span className="nav-label">Gestion des Quiz</span>
</button>

            <button 
              className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              <span className="nav-icon">👥</span>
              <span className="nav-label">Utilisateurs</span>
            </button>
            
            <button 
              className={`nav-item ${activeTab === 'payments' ? 'active' : ''}`}
              onClick={() => setActiveTab('payments')}
            >
              <span className="nav-icon">💳</span>
              <span className="nav-label">Paiements</span>
            </button>
          </div>
        </nav>

        {/* Contenu Principal */}
        <main className="admin-main">
          <header className="admin-header">
            <div className="header-title">
              <h1>
                {activeTab === 'overview' && 'Vue d\'Ensemble'}
                {activeTab === 'courses' && 'Gestion des Cours'}
                {activeTab === 'users' && 'Gestion des Utilisateurs'}
                {activeTab === 'payments' && 'Gestion des Paiements'}
              </h1>
              <p>Bienvenue, {user && user.displayName ? user.displayName : 'Administrateur'} 👋</p>
            </div>
          </header>

          <div className="admin-content">
            {/* Vue d'ensemble */}
            {activeTab === 'overview' && (
              <div className="overview-tab">
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-header">
                      <div className="stat-icon revenue">💰</div>
                      <div className="stat-trend positive">+{stats.monthlyGrowth}%</div>
                    </div>
                    <div className="stat-value">{stats.totalRevenue.toLocaleString()} TND</div>
                    <div className="stat-label">Revenus Totaux</div>
                    <div className="stat-subtitle">{stats.monthlyRevenue.toLocaleString()} TND ce mois</div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-header">
                      <div className="stat-icon students">👥</div>
                      <div className="stat-trend positive">+12%</div>
                    </div>
                    <div className="stat-value">{stats.totalStudents}</div>
                    <div className="stat-label">Étudiants Actifs</div>
                    <div className="stat-subtitle">{stats.activeUsers} en ligne</div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-header">
                      <div className="stat-icon courses">📚</div>
                      <div className="stat-trend positive">+5%</div>
                    </div>
                    <div className="stat-value">{stats.totalCourses}</div>
                    <div className="stat-label">Cours Disponibles</div>
                    <div className="stat-subtitle">{stats.totalInstructors} formateurs</div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-header">
                      <div className="stat-icon conversion">📈</div>
                      <div className="stat-trend positive">+8%</div>
                    </div>
                    <div className="stat-value">{stats.conversionRate}%</div>
                    <div className="stat-label">Taux de Conversion</div>
                    <div className="stat-subtitle">Performance moyenne</div>
                  </div>
                </div>

                {/* Graphiques Simplifiés */}
                <div className="charts-grid">
                  <div className="chart-card">
                    <h3>Revenus Mensuels</h3>
                    <div className="simple-chart">
                      <div className="chart-bars">
                        {[
                          { month: 'Jan', revenue: 12000 },
                          { month: 'Fév', revenue: 19000 },
                          { month: 'Mar', revenue: 15000 },
                          { month: 'Avr', revenue: 22000 },
                          { month: 'Mai', revenue: 18000 },
                          { month: 'Jun', revenue: 25000 }
                        ].map((item, index) => (
                          <div key={index} className="chart-bar-container">
                            <div 
                              className="chart-bar" 
                              style={{ height: `${(item.revenue / 30000) * 100}%` }}
                            ></div>
                            <span className="chart-label">{item.month}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="chart-card">
                    <h3>Répartition par Catégorie</h3>
                    <div className="simple-pie">
                      <div className="pie-chart">
                        <div className="pie-segment development"></div>
                        <div className="pie-segment design"></div>
                        <div className="pie-segment business"></div>
                        <div className="pie-segment marketing"></div>
                      </div>
                      <div className="pie-legend">
                        <div className="legend-item">
                          <span className="legend-color development"></span>
                          <span>Développement (40%)</span>
                        </div>
                        <div className="legend-item">
                          <span className="legend-color design"></span>
                          <span>Design (25%)</span>
                        </div>
                        <div className="legend-item">
                          <span className="legend-color business"></span>
                          <span>Business (20%)</span>
                        </div>
                        <div className="legend-item">
                          <span className="legend-color marketing"></span>
                          <span>Marketing (15%)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cours Populaires */}
                <div className="popular-courses">
                  <h3>Cours les Plus Populaires</h3>
                  <div className="courses-list">
                    {popularCourses.map((course, index) => (
                      <div key={course.id} className="popular-course-item">
                        <span className="rank">#{index + 1}</span>
                        <div className="course-image-placeholder"></div>
                        <div className="course-info">
                          <h4>{course.title}</h4>
                          <p>{course.category} • {course.instructor}</p>
                        </div>
                        <div className="course-stats">
                          <span className="students">👥 {course.enrollmentCount}</span>
                          <span className="revenue">💰 {course.revenue.toLocaleString()} TND</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Gestion des Cours */}
            {activeTab === 'courses' && (
  <div className="courses-tab">
    <div className="tab-header">
      <h2>Gestion des Cours ({courses.length} cours)</h2>
      <div style={{ display: 'flex', gap: '15px' }}>
        <button 
          className="btn btn-primary"
          onClick={handleNewCourseClick}
        >
          + Nouveau Cours
        </button>
        {/* BOUTON POUR CRÉER UN QUIZ */}
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
                {/* MODAL DE CRÉATION DE COURS */}
                {showNewCourseForm && (
                  <div className="modal-overlay">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h3>Créer un Nouveau Cours</h3>
                        <button 
                          className="btn-icon"
                          onClick={handleCloseModal}
                        >
                          ✕
                        </button>
                      </div>
                      <form onSubmit={handleSubmitCourse}>
                        <div className="form-group">
                          <label>Titre du cours *</label>
                          <input
                            type="text"
                            name="title"
                            value={newCourse.title}
                            onChange={handleInputChange}
                            required
                            placeholder="Ex: React Avancé - Les Hooks"
                          />
                        </div>
                        
                        <div className="form-group">
                          <label>Catégorie *</label>
                          <select
                            name="category"
                            value={newCourse.category}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="">Sélectionnez une catégorie</option>
                            <option value="Développement">Développement</option>
                            <option value="Design">Design</option>
                            <option value="Business">Business</option>
                            <option value="Marketing">Marketing</option>
                          </select>
                        </div>
                        
                        <div className="form-group">
  <label>Formateur *</label>
  <input
    type="text"
    name="instructor"
    value={newCourse.instructor}
    onChange={handleInputChange}
    required
    placeholder="Ex: Ahmed Ben Ali"
  />
</div>

{/* SECTION IMAGE AVEC OPTIONS PAR DÉFAUT */}
<div className="form-group">
  <label>Image du cours</label>
  
  {/* Champ URL */}
  <input
    type="url"
    name="image"
    value={newCourse.image}
    onChange={handleImageUrlChange}
    placeholder="https://exemple.com/image.jpg"
    style={{marginBottom: '15px'}}
  />
  
  {/* Images prédéfinies rapides */}
  <div style={{marginBottom: '15px'}}>
    <small style={{color: '#666', display: 'block', marginBottom: '8px'}}>
      Ou choisir une image prédéfinie :
    </small>
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '8px'
    }}>
      {defaultImages.map((img, index) => (
        <div
          key={index}
          onClick={() => handleSelectDefaultImage(img.url)}
          style={{
            border: newCourse.image === img.url ? '3px solid var(--primary-color)' : '2px solid #ddd',
            borderRadius: '6px',
            overflow: 'hidden',
            cursor: 'pointer',
            background: '#f8f9fa',
            transition: 'all 0.3s ease'
          }}
        >
          <div 
            style={{
              width: '100%',
              height: '60px',
              backgroundImage: `url(${img.url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
            onError={(e) => {
              console.log('❌ Image non trouvée:', img.url);
              e.target.style.background = '#ffcccc';
            }}
          ></div>
          <div style={{
            padding: '4px',
            textAlign: 'center',
            fontSize: '0.7em',
            background: newCourse.image === img.url ? 'var(--primary-color)' : 'transparent',
            color: newCourse.image === img.url ? 'white' : '#666'
          }}>
            {img.label}
          </div>
        </div>
      ))}
    </div>
  </div>

  {/* Aperçu de l'image */}
  {newCourse.image && (
    <div style={{
      marginTop: '10px',
      textAlign: 'center',
      padding: '10px',
      background: '#f8f9fa',
      borderRadius: '6px',
      border: '1px solid #e9ecef'
    }}>
      <strong>Aperçu :</strong>
      <div style={{
        width: '120px',
        height: '80px',
        margin: '10px auto',
        border: '1px solid #ddd',
        borderRadius: '4px',
        overflow: 'hidden'
      }}>
        <img 
          src={newCourse.image} 
          alt="Aperçu" 
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
          onError={(e) => {
            console.log('❌ Erreur de chargement de l\'image:', newCourse.image);
            e.target.src = '/images/default-course.jpg';
          }}
        />
      </div>
    </div>
  )}
  
  <small style={{color: '#666', fontSize: '0.8em'}}>
    Entrez une URL d'image ou choisissez une option rapide
  </small>
</div>
                        {/* SECTION IMAGE AVEC OPTIONS PAR DÉFAUT */}
                        <div className="form-group">
                          <label>Image du cours</label>
                          
                          {/* Champ URL */}
                          <input
                            type="url"
                            name="image"
                            value={newCourse.image}
                            onChange={handleImageUrlChange}
                            placeholder="https://exemple.com/image.jpg"
                            style={{marginBottom: '15px'}}
                          />
                          
                          {/* Images prédéfinies rapides */}
                          <div style={{marginBottom: '15px'}}>
                            <small style={{color: '#666', display: 'block', marginBottom: '8px'}}>
                              Ou choisir une image prédéfinie :
                            </small>
                            <div style={{
                              display: 'grid',
                              gridTemplateColumns: 'repeat(4, 1fr)',
                              gap: '8px'
                            }}>
                              {defaultImages.map((img, index) => (
                                <div
                                  key={index}
                                  onClick={() => handleSelectDefaultImage(img.url)}
                                  style={{
                                    border: newCourse.image === img.url ? '3px solid var(--primary-color)' : '2px solid #ddd',
                                    borderRadius: '6px',
                                    overflow: 'hidden',
                                    cursor: 'pointer',
                                    background: '#f8f9fa',
                                    transition: 'all 0.3s ease'
                                  }}
                                >
                                  <div 
                                    style={{
                                      width: '100%',
                                      height: '60px',
                                      backgroundImage: `url(${img.url})`,
                                      backgroundSize: 'cover',
                                      backgroundPosition: 'center'
                                    }}
                                    onError={(e) => {
                                      console.log('❌ Image non trouvée:', img.url);
                                      e.target.style.background = '#ffcccc';
                                    }}
                                  ></div>
                                  <div style={{
                                    padding: '4px',
                                    textAlign: 'center',
                                    fontSize: '0.7em',
                                    background: newCourse.image === img.url ? 'var(--primary-color)' : 'transparent',
                                    color: newCourse.image === img.url ? 'white' : '#666'
                                  }}>
                                    {img.label}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Aperçu de l'image */}
                          {newCourse.image && (
                            <div style={{
                              marginTop: '10px',
                              textAlign: 'center',
                              padding: '10px',
                              background: '#f8f9fa',
                              borderRadius: '6px',
                              border: '1px solid #e9ecef'
                            }}>
                              <strong>Aperçu :</strong>
                              <div style={{
                                width: '120px',
                                height: '80px',
                                margin: '10px auto',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                overflow: 'hidden'
                              }}>
                                <img 
                                  src={newCourse.image} 
                                  alt="Aperçu" 
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                  }}
                                  onError={(e) => {
                                    console.log('❌ Erreur de chargement de l\'image:', newCourse.image);
                                    e.target.src = '/images/default-course.jpg';
                                  }}
                                />
                              </div>
                            </div>
                          )}
                          
                          <small style={{color: '#666', fontSize: '0.8em'}}>
                            Entrez une URL d'image ou choisissez une option rapide
                          </small>
                        </div>

                        {/* SECTION PRIX AVEC CALCUL AUTOMATIQUE */}
                        <div className="form-group">
                          <label>Prix Original (TND) *</label>
                          <input
                            type="number"
                            name="originalPrice"
                            value={newCourse.originalPrice}
                            onChange={handleInputChange}
                            required
                            placeholder="Ex: 129"
                            min="1"
                            step="0.01"
                          />
                        </div>

                        <div className="form-group">
                          <label>Prix Promotionnel (TND)</label>
                          <input
                            type="number"
                            name="price"
                            value={newCourse.price}
                            onChange={handleInputChange}
                            placeholder="Ex: 89 (laisser vide pour pas de promotion)"
                            min="1"
                            step="0.01"
                          />
                          <small style={{color: '#666', fontSize: '0.8em'}}>
                            Laisser vide si pas de promotion
                          </small>
                        </div>

                        <div className="form-group">
                          <label>Pourcentage de Promotion</label>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '10px',
                            background: newCourse.hasPromotion ? '#f0f9ff' : '#f8f9fa',
                            border: `1px solid ${newCourse.hasPromotion ? '#bae6fd' : '#e9ecef'}`,
                            borderRadius: '6px'
                          }}>
                            <input
                              type="number"
                              name="discountPercentage"
                              value={newCourse.discountPercentage}
                              readOnly
                              style={{
                                flex: 1,
                                background: 'transparent',
                                border: 'none',
                                fontWeight: 'bold',
                                color: newCourse.hasPromotion ? '#22c55e' : '#666'
                              }}
                            />
                            <span style={{
                              color: newCourse.hasPromotion ? '#22c55e' : '#666',
                              fontWeight: 'bold'
                            }}>%</span>
                          </div>
                          
                          {newCourse.hasPromotion && (
                            <div style={{
                              marginTop: '10px',
                              padding: '12px',
                              background: '#ecfdf5',
                              border: '1px solid #d1fae5',
                              borderRadius: '6px'
                            }}>
                              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                <div>
                                  <div style={{fontSize: '0.9em', color: '#666'}}>Prix original</div>
                                  <del style={{color: '#999', fontSize: '1.1em'}}>{newCourse.originalPrice} TND</del>
                                </div>
                                <div style={{fontSize: '1.5em', color: '#dc2626'}}>→</div>
                                <div>
                                  <div style={{fontSize: '0.9em', color: '#666'}}>Prix promotionnel</div>
                                  <strong style={{color: '#e91e63', fontSize: '1.3em'}}>{newCourse.price} TND</strong>
                                </div>
                              </div>
                              <div style={{
                                marginTop: '8px',
                                textAlign: 'center',
                                background: '#22c55e',
                                color: 'white',
                                padding: '4px 8px',
                                borderRadius: '12px',
                                fontSize: '0.9em',
                                fontWeight: 'bold'
                              }}>
                                Économie de {newCourse.discountPercentage}%
                              </div>
                            </div>
                          )}
                          
                          {parseFloat(newCourse.price) > parseFloat(newCourse.originalPrice) && newCourse.originalPrice && (
                            <div style={{
                              marginTop: '10px',
                              padding: '8px',
                              background: '#fef2f2',
                              border: '1px solid #fecaca',
                              borderRadius: '4px',
                              color: '#dc2626',
                              fontSize: '0.8em'
                            }}>
                              ⚠️ Le prix promotionnel ne peut pas être supérieur au prix original
                            </div>
                          )}
                        </div>
                        
                        <div className="form-group">
                          <label>Niveau</label>
                          <select
                            name="level"
                            value={newCourse.level}
                            onChange={handleInputChange}
                          >
                            <option value="Débutant">Débutant</option>
                            <option value="Intermédiaire">Intermédiaire</option>
                            <option value="Avancé">Avancé</option>
                            <option value="Tous niveaux">Tous niveaux</option>
                          </select>
                        </div>
                        
                        <div className="form-group">
                          <label>Durée</label>
                          <input
                            type="text"
                            name="duration"
                            value={newCourse.duration}
                            onChange={handleInputChange}
                            placeholder="Ex: 10h 30min"
                          />
                        </div>
                        
                        <div className="form-group">
                          <label>Description</label>
                          <textarea
                            name="description"
                            value={newCourse.description}
                            onChange={handleInputChange}
                            placeholder="Description du cours..."
                            rows="4"
                          />
                        </div>
                        
                        <div className="form-group">
                          <label>Statut</label>
                          <select
                            name="status"
                            value={newCourse.status}
                            onChange={handleInputChange}
                          >
                            <option value="draft">Brouillon</option>
                            <option value="published">Publié</option>
                          </select>
                        </div>
                        
                        <div className="modal-actions">
                          <button 
                            type="button" 
                            className="btn btn-secondary"
                            onClick={handleCloseModal}
                          >
                            Annuler
                          </button>
                          <button 
                            type="submit" 
                            className="btn btn-primary"
                          >
                            Créer le Cours
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {/* TABLEAU DES COURS */}
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
                              <button className="btn-icon" title="Éditer">✏️</button>
                              <button 
                                className="btn-icon btn-danger" 
                                title="Supprimer"
                                onClick={() => handleDeleteCourse(course.id)}
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
              </div>
            )}

            {/* Gestion des Utilisateurs */}
            {activeTab === 'users' && (
              <div className="users-tab">
                <div className="tab-header">
                  <h2>Gestion des Utilisateurs</h2>
                </div>

                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Utilisateur</th>
                        <th>Email</th>
                        <th>Rôle</th>
                        <th>Inscription</th>
                        <th>Statut</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(user => (
                        <tr key={user.id}>
                          <td>
                            <div className="user-cell">
                              <div className="user-avatar">
                                <div className="avatar-placeholder">
                                  {user.displayName.charAt(0)}
                                </div>
                              </div>
                              <div>
                                <strong>{user.displayName}</strong>
                                <p className="user-meta">
                                  Dernière connexion: {user.lastLogin}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td>{user.email}</td>
                          <td>
                            <span className={`badge badge-${user.role}`}>
                              {user.role === 'instructor' ? 'Formateur' : 'Étudiant'}
                            </span>
                          </td>
                          <td>{user.createdAt}</td>
                          <td>
                            <div className="status-cell">
                              <span className={`badge ${user.online ? 'badge-success' : 'badge-warning'}`}>
                                {user.online ? 'En ligne' : 'Hors ligne'}
                              </span>
                              <span className={`badge ${user.active ? 'badge-success' : 'badge-danger'}`}>
                                {user.active ? 'Actif' : 'Inactif'}
                              </span>
                            </div>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button className="btn-icon" title="Voir profil">👁️</button>
                              <button className="btn-icon btn-warning" title="Modifier">⚙️</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Paiements */}
            {activeTab === 'payments' && (
              <div className="payments-tab">
                <h2>Gestion des Paiements</h2>
                <div className="coming-soon">
                  <p>🚧 Intégration Paymee en cours de développement</p>
                  <div className="features-list">
                    <h4>Fonctionnalités à venir :</h4>
                    <ul>
                      <li>Historique des transactions</li>
                      <li>Statuts des paiements</li>
                      <li>Rapports financiers</li>
                      <li>Export des données</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard; 