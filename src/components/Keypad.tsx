import React from 'react';

interface KeypadProps {
  onNumberClick: (num: string) => void;
  onSubmit: () => void;
  onClear: () => void;
}

export const Keypad: React.FC<KeypadProps> = ({ onNumberClick, onSubmit, onClear }) => {
  return (
    <div className="sm:mt-0 mt-2 md:mt-0">
      <div className="grid grid-cols-3 gap-2 w-full max-w-xs mx-auto">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
          <button
            key={num}
            onClick={() => onNumberClick(num.toString())}
            className="bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 active:bg-gray-100 dark:active:bg-gray-500 text-gray-800 dark:text-white font-semibold py-4 rounded-lg shadow-sm transition-colors duration-300"
          >
            {num}
          </button>
        ))}
        <button
          onClick={onClear}
          className="bg-red-500 hover:bg-red-600 active:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 dark:active:bg-red-800 text-white font-semibold py-4 rounded-lg shadow-sm transition-colors duration-300"
        >
          Clear
        </button>
        <button
          onClick={onSubmit}
          className="bg-green-500 hover:bg-green-600 active:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 dark:active:bg-green-800 text-white font-semibold py-4 rounded-lg shadow-sm transition-colors duration-300"
        >
          Enter
        </button>
      </div>
    </div>
  );
};