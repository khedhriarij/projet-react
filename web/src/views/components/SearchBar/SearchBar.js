// components/SearchBar/SearchBar.js
import './SearchBar.css';

export default function SearchBar({ searchTerm, onSearchChange }) {
  return (
    <div className="search-bar">
      <div className="search-input-wrapper">
        <input
          type="text"
          placeholder="Rechercher un cours, une technologie..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
        />
        <span className="search-icon">🔍</span>
        {searchTerm && (
          <button 
            className="clear-search"
            onClick={() => onSearchChange('')}
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}