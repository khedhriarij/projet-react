// pages/catalog/Catalog.js - COMPLETE FIX
import { useState, useMemo, useEffect } from 'react';
import { useAuthContext } from '../../../viewmodels/hooks/useAuthContext';
import { useAdmin } from '../../../viewmodels/hooks/UseAdmin';
import { useCourseContext } from '../../../viewmodels/context/CourContext';
import { useCoursePurchase } from '../../../viewmodels/hooks/useCoursePurchase';
import CourseCard from '../../components/CourseCard/CourseCard';
import CourseFilters from '../../components/CourseFilters/CourseFilters';
import SearchBar from '../../components/SearchBar/SearchBar';
import './catalog.css';

export default function Catalog() {
  const { user } = useAuthContext();
  const { isAdmin } = useAdmin();
  const { courses } = useCourseContext(); 
  const { getPurchasedCourses } = useCoursePurchase();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [sortBy, setSortBy] = useState('popular');
  const [purchasedCourseIds, setPurchasedCourseIds] = useState(new Set());
  const [loadingPurchases, setLoadingPurchases] = useState(false);

  // ✅ Load purchased courses ONCE at the catalog level
  useEffect(() => {
    const loadPurchasedCourses = async () => {
      if (!user) {
        setPurchasedCourseIds(new Set());
        return;
      }

      try {
        setLoadingPurchases(true);
        console.log('🔄 [Catalog] Loading purchased courses for user:', user.uid);
        
        const purchasedCourses = await getPurchasedCourses();
        const purchasedIds = new Set(purchasedCourses.map(purchase => purchase.courseId));
        
        console.log('✅ [Catalog] Purchased course IDs:', Array.from(purchasedIds));
        setPurchasedCourseIds(purchasedIds);
      } catch (error) {
        console.error('❌ [Catalog] Error loading purchased courses:', error);
        setPurchasedCourseIds(new Set());
      } finally {
        setLoadingPurchases(false);
      }
    };

    loadPurchasedCourses();
  }, [user, getPurchasedCourses]);

  // ✅ Check if course is purchased
  const isCoursePurchased = (courseId) => {
    return purchasedCourseIds.has(courseId);
  };

  const filteredCourses = useMemo(() => {
    let filtered = courses;

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par catégorie
    if (selectedCategory !== 'Tous') {
      filtered = filtered.filter(course => course.category === selectedCategory);
    }

    // Tri
    switch (sortBy) {
      case 'price-low':
        filtered = [...filtered].sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered = [...filtered].sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered = [...filtered].sort((a, b) => b.rating - a.rating);
        break;
      case 'students':
        filtered = [...filtered].sort((a, b) => b.students - a.students);
        break;
      default:
        // Popular par défaut (featured first, then by students)
        filtered = [...filtered].sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return b.students - a.students;
        });
    }

    return filtered;
  }, [courses, searchTerm, selectedCategory, sortBy]);

  const categories = ['Tous', 'Développement', 'Design', 'Business'];

  return (
    <div className="catalog-page">
      <div className="catalog-header">
        <h1>Explorez Notre Catalogue de Cours</h1>
        <p>Découvrez {courses.length} cours professionnels pour booster votre carrière</p>
      </div>

      <div className="catalog-controls">
        <SearchBar 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
        
        <CourseFilters
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
      </div>

      <div className="catalog-results">
        <div className="results-info">
          <span className="results-count">
            {filteredCourses.length} cours trouvés
            {selectedCategory !== 'Tous' && ` dans "${selectedCategory}"`}
            {searchTerm && ` pour "${searchTerm}"`}
            {loadingPurchases && ' • Chargement des achats...'}
          </span>
        </div>

        {filteredCourses.length === 0 ? (
          <div className="no-results">
            <h3>Aucun cours trouvé</h3>
            <p>Essayez de modifier vos critères de recherche ou de filtrage</p>
          </div>
        ) : (
          <div className="course-grid">
            {filteredCourses.map(course => (
              <CourseCard 
                key={course.id}
                course={course}
                isAdmin={isAdmin}
                isPurchased={isCoursePurchased(course.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}