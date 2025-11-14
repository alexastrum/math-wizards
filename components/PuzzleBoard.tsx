
import React, { useState } from 'react';
import type { Puzzle, OperatorSymbol } from '../types';

interface DropZoneProps {
  operator: OperatorSymbol | null;
  onDrop: (operator: OperatorSymbol) => void;
  isCorrect: boolean | null;
}

const DropZone: React.FC<DropZoneProps> = ({ operator, onDrop, isCorrect }) => {
  const [isOver, setIsOver] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(false);
    const droppedOperator = e.dataTransfer.getData('text/plain') as OperatorSymbol;
    onDrop(droppedOperator);
  };
  
  const baseClasses = "flex items-center justify-center h-20 w-20 md:h-24 md:w-24 border-4 border-dashed rounded-xl text-5xl transition-all duration-300";
  const colorClasses = isCorrect === true 
    ? 'border-green-400 text-green-400'
    : isCorrect === false
    ? 'border-red-400 text-red-400'
    : 'border-white/50 text-white/50';
  const hoverClasses = isOver ? 'bg-white/20 border-white' : '';

  return (
    <div 
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`${baseClasses} ${colorClasses} ${hoverClasses}`}
    >
      {operator || '?'}
    </div>
  );
};


interface PuzzleBoardProps {
  puzzle: Puzzle;
  userSolution: (OperatorSymbol | null)[];
  onDrop: (index: number, operator: OperatorSymbol) => void;
  isCorrect: boolean | null;
}

const PuzzleBoard: React.FC<PuzzleBoardProps> = ({ puzzle, userSolution, onDrop, isCorrect }) => {
  return (
    <div className="flex items-center justify-center space-x-2 md:space-x-4 text-white text-6xl md:text-8xl p-4">
      <span>{puzzle.numbers[0]}</span>
      <DropZone operator={userSolution[0]} onDrop={(op) => onDrop(0, op)} isCorrect={isCorrect} />
      <span>{puzzle.numbers[1]}</span>
      <DropZone operator={userSolution[1]} onDrop={(op) => onDrop(1, op)} isCorrect={isCorrect} />
      <span>{puzzle.numbers[2]}</span>
      <span className="mx-2">=</span>
      <span>{puzzle.result}</span>
    </div>
  );
};

export default PuzzleBoard;
