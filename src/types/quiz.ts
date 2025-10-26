// types/quiz.ts
export interface Quiz {
  id: string;
  title: string;
  description: string;
  courseId: string;
  duration: number; // minutes
  passingScore: number; // percentage
  questions: QuizQuestion[];
  createdBy: string;
  createdAt: Date;
  isActive: boolean;
  totalPoints: number;
}

export interface QuizQuestion {
  id: string;
  questionText: string;
  questionType: 'multiple_choice' | 'true_false' | 'text';
  options?: string[];
  correctAnswer: string | string[];
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
  startedAt: Date;
  completedAt: Date;
  timeSpent: number; // seconds
  passed: boolean;
}

export interface UserAnswer {
  questionId: string;
  userAnswer: string;
  isCorrect: boolean;
  pointsEarned: number;
}

export interface QuizSession {
  currentQuestionIndex: number;
  answers: { [questionId: string]: string };
  timeRemaining: number;
  isCompleted: boolean;
}