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
  typeQuestion: 'text' | 'number' | 'yes_no';
  description?: string | null;
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
  observation: string | null;
  createdAt: string;
  updatedAt: string;
  unitAnswers?: {
    id: string;
    question: string;
    points: number;
  };
}
