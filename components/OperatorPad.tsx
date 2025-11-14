
import React from 'react';
import type { OperatorSymbol } from '../types';

interface DraggableOperatorProps {
  operator: OperatorSymbol;
}

const DraggableOperator: React.FC<DraggableOperatorProps> = ({ operator }) => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('text/plain', operator);
  };
  
  return (
    <div 
      draggable 
      onDragStart={handleDragStart} 
      className="flex items-center justify-center h-20 w-20 md:h-24 md:w-24 bg-white/10 border-2 border-white/50 rounded-xl text-white text-5xl cursor-grab active:cursor-grabbing hover:bg-white/20 hover:border-white transition-all duration-200"
    >
      {operator}
    </div>
  );
};

const OperatorPad: React.FC = () => {
  const operators: OperatorSymbol[] = ['+', '-', '×', '÷'];
  return (
    <div className="flex justify-center space-x-4 my-8">
      {operators.map(op => <DraggableOperator key={op} operator={op} />)}
    </div>
  );
};

export default OperatorPad;
