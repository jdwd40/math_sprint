export type Operation = 'addition' | 'subtraction' | 'multiplication' | 'division';

export interface GameState {
  score: number;
  timeLeft: number;
  currentProblem: Problem;
  operation: Operation;
  isPlaying: boolean;
  isGameOver: boolean;
  lastScoreChange: number | null;
  difficultyLevel: number;
  consecutiveCorrect: number;
  timeBonus: number | null;
  showLevelUpAnimation: boolean;
}

export interface Problem {
  num1: number;
  num2: number;
  answer: number;
  userAnswer: string;
}

export interface Score {
  id: string;
  user_id: string;
  score: number;
  operation_type: Operation;
  created_at: string;
}