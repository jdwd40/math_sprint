import { create } from 'zustand';
import { Operation, GameState, Problem } from '../types/game';

const generateProblem = (operation: Operation): Problem => {
  let num1: number, num2: number, answer: number;

  if (operation === 'multiplication' || operation === 'division') {
    num1 = Math.floor(Math.random() * 12) + 1;
    num2 = Math.floor(Math.random() * 12) + 1;
  } else {
    num1 = Math.floor(Math.random() * 100) + 1;
    num2 = Math.floor(Math.random() * 100) + 1;
  }

  switch (operation) {
    case 'addition':
      answer = num1 + num2;
      break;
    case 'subtraction':
      [num1, num2] = [Math.max(num1, num2), Math.min(num1, num2)];
      answer = num1 - num2;
      break;
    case 'multiplication':
      answer = num1 * num2;
      break;
    case 'division':
      answer = num1;
      num1 = num1 * num2;
      break;
    default:
      answer = 0;
  }

  return { num1, num2, answer, userAnswer: '' };
};

export const useGameStore = create<GameState & {
  startGame: (operation: Operation) => void;
  submitAnswer: (answer: string) => void;
  endGame: () => void;
  tick: () => void;
  resetGame: () => void;
}>((set, get) => ({
  score: 0,
  timeLeft: 30,
  operation: 'addition',
  currentProblem: generateProblem('addition'),
  isPlaying: false,
  isGameOver: false,
  lastScoreChange: null,

  startGame: (operation) => {
    set({
      operation,
      score: 0,
      timeLeft: 30,
      isPlaying: true,
      isGameOver: false,
      currentProblem: generateProblem(operation),
      lastScoreChange: null,
    });
  },

  submitAnswer: (answer) => {
    const { currentProblem, score, operation } = get();
    const isCorrect = parseInt(answer) === currentProblem.answer;
    const scoreChange = isCorrect ? 10 : -5;
    const newScore = Math.max(0, score + scoreChange);
    
    set({
      score: newScore,
      currentProblem: generateProblem(operation),
      lastScoreChange: scoreChange,
    });

    return isCorrect;
  },

  endGame: () => {
    set({ isPlaying: false, isGameOver: true });
  },

  resetGame: () => {
    set({
      score: 0,
      timeLeft: 30,
      isPlaying: false,
      isGameOver: false,
      lastScoreChange: null,
    });
  },

  tick: () => {
    const { timeLeft, isPlaying } = get();
    if (isPlaying && timeLeft > 0) {
      set({ timeLeft: timeLeft - 1 });
    } else if (timeLeft === 0) {
      get().endGame();
    }
  },
}));