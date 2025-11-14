
import React from 'react';

interface ControlsProps {
  onCheck: () => void;
  onNewPuzzle: () => void;
  isPuzzleComplete: boolean;
}

const CheckIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const RecycleIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M4 4l1.5 1.5A9 9 0 0112 5v0a9 9 0 017.5 12.5M20 20l-1.5-1.5A9 9 0 0112 19v0a9 9 0 01-7.5-12.5" />
  </svg>
);

const Controls: React.FC<ControlsProps> = ({ onCheck, onNewPuzzle, isPuzzleComplete }) => {
  const baseButtonClasses = "flex items-center justify-center px-6 py-3 text-2xl text-white font-bold rounded-lg border-2 border-white/80 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";
  const checkButtonClasses = "bg-green-500/80 hover:bg-green-500 hover:border-white";
  const newButtonClasses = "bg-blue-500/80 hover:bg-blue-500 hover:border-white";

  return (
    <div className="flex justify-center space-x-4 mt-8">
      <button 
        onClick={onCheck} 
        disabled={!isPuzzleComplete}
        className={`${baseButtonClasses} ${checkButtonClasses}`}
      >
        <CheckIcon /> Check Answer
      </button>
      <button onClick={onNewPuzzle} className={`${baseButtonClasses} ${newButtonClasses}`}>
        <RecycleIcon /> New Puzzle
      </button>
    </div>
  );
};

export default Controls;
