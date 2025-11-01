// src/components/Quiz/QuizManagement.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import QuizList from './QuizList';
import QuizBuilder from './QuizBuilder';
import './styles/QuizManagement.css';

const QuizManagement = () => {
  return (
    <div className="quiz-management">
      <div className="quiz-management-content">
        <Routes>
          <Route path="/" element={<QuizList />} />
          <Route path="/create" element={<QuizBuilder />} />
          <Route path="/edit/:quizId" element={<QuizBuilder />} />
          <Route path="*" element={<Navigate to="/admin/quiz" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default QuizManagement;