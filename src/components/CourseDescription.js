// src/pages/dashboard/components/CourseDescription.js
import React, { useState } from 'react';

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

export default CourseDescription;