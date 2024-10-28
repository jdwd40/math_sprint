import React from 'react';

interface KeypadProps {
  onNumberClick: (num: string) => void;
  onSubmit: () => void;
  onClear: () => void;
}

export const Keypad: React.FC<KeypadProps> = ({ onNumberClick, onSubmit, onClear }) => {
  return (
    <div className="grid grid-cols-3 gap-2 w-full max-w-xs mx-auto">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
        <button
          key={num}
          onClick={() => onNumberClick(num.toString())}
          className="bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-800 font-semibold py-4 rounded-lg shadow-sm transition-colors"
        >
          {num}
        </button>
      ))}
      <button
        onClick={onClear}
        className="bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-semibold py-4 rounded-lg shadow-sm transition-colors"
      >
        Clear
      </button>
      <button
        onClick={onSubmit}
        className="bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-semibold py-4 rounded-lg shadow-sm transition-colors"
      >
        Enter
      </button>
    </div>
  );
};