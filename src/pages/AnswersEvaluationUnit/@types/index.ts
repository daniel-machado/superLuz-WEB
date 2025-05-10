export interface Evaluation {
  id: string;
  week: number;
  examScore: number;
  unitId: string;
  evaluatedBy: string;
  correctAnswers: number;
  wrongAnswers: number;
  totalScore: number;
  status: string;
  createdAt: string;  
  updatedAt: string;
}

export interface Question {
  id: string;
  question: string;
  points: number;
  createdAt: string;
  updatedAt: string;
}

export interface Answer {
  id: string;
  unitId: string;
  unitEvaluationId: string;
  questionId: string;
  answer: string;
  score: number;
  week: number;
  createdAt: string;
  updatedAt: string;
  unitAnswers?: {
    id: string;
    question: string;
    points: number;
  };
}
