// src/types/quiz.ts
export interface Quiz {
  id: string;
  title: string;
  description: string;
  courseId?: string;
  duration: number;
  passingScore: number;
  questions: QuizQuestion[];
  totalPoints: number;
  isActive: boolean;
  attempts: number;
  averageScore: number;
  createdAt: string;
  updatedAt?: string;
}

export interface QuizQuestion {
  id: string;
  questionText: string;
  questionType: 'multiple_choice' | 'true_false' | 'text';
  options: string[];
  correctAnswer: string;
  points: number;
  explanation?: string;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  userId: string;
  score: number;
  totalPoints: number;
  percentage: number;
  answers: UserAnswer[];
  startedAt: string;
  completedAt?: string;
  timeSpent: number;
  passed: boolean;
}

export interface UserAnswer {
  questionId: string;
  userAnswer: string;
  isCorrect: boolean;
  pointsEarned: number;
}

export interface QuizFilters {
  status?: 'all' | 'active' | 'inactive';
  search?: string;
  sortBy?: 'title' | 'createdAt' | 'attempts' | 'averageScore';
}

export interface QuizStats {
  totalAttempts: number;
  averageScore: number;
  passRate: number;
  completionRate: number;
  totalQuestions: number;
  totalPoints: number;
}