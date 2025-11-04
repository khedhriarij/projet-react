// components/CourseFilters/CourseFilters.js
import './coursefilters.css';

export default function CourseFilters({
  categories,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange
}) {
  return (
    <div className="course-filters">
      <div className="filter-group">
        <label>Catégorie :</label>
        <div className="category-buttons">
          {categories.map(category => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => onCategoryChange(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <label>Trier par :</label>
        <select 
          value={sortBy} 
          onChange={(e) => onSortChange(e.target.value)}
          className="sort-select"
        >
          <option value="popular">Populaire</option>
          <option value="price-low">Prix croissant</option>
          <option value="price-high">Prix décroissant</option>
          <option value="rating">Meilleures notes</option>
          <option value="students">Plus d'étudiants</option>
        </select>
      </div>
    </div>
  );
}